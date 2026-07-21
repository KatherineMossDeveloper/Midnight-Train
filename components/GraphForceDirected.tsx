// GraphForceDirected.tsx
// creates and maintains the force directed graph of image relationships,
// as calculated by the Weaviate database default nearest neighbor algorithm,
// or as pulled from the JSON files.  Note that this component is a forward
// referenced constant that is exported, rather than an exported function.
// The parent, DataExplorerClient, owns the buttons, but the child,
// ForceDirectedGraph, owns the data, so the parent calls the functions in
// the child; a.k.a. an imperative escape hatch.
//
//
// type GraphForceDirectedProps
// export type GraphForceDirectedFunctions
// const GraphForceDirected = forwardRef
//
// There are three useEffect's here.
// the log:  useEffect(() => {log("GraphForceDirected mounted.");}, [log]);
//    puts the 'hello world' message in the log panel.
// the "create" useEffect:  useEffect(() => { if (!svgRef.current) return;
//    creates SVG, links, nodes, labels, simulation, and registers tick callback
// the "update" useEffect:  useEffect(() => { if (!simulationRef.current) return;
//    sends new nodes, new links, and restarts simulation.
//
// Notes on the flow.
// useEffect number one (create) waits for the DOM to exist so the graph can be created.
// useEffect number two (update) waits for the simulation to exist so it can be updated.
//
// The order of code flow here is approximately...
// -useEffect number one (create) is hit, but the svgRef is not current.
// -useEffect number one (create) is hit, so the d3.simulation is created.
// -useEffect number two (update) is hit, so the d3.simulation is maintained.
//

"use client";

import { useEffect, useState, useRef } from "react";
import { forwardRef, useImperativeHandle } from "react";

// types and components
import type { GraphNode, GraphLink } from "@/types/FDGtypes";
import { useLog } from "@/components/LogPanel";
import TooltipFDG from "@/components/ui/TooltipFDG";

// D3
import * as d3 from "d3";
import { createDragBehavior } from "@/lib/d3/createDragBehavior";

// misc.
import { BLACK_HEX } from "@/lib/graphUtilities";
import { WHITE_HEX } from "@/lib/graphUtilities";
import { copySvgElementToClipboard, copyPngElementToClipboard } from "@/lib/exportImages"

// physics engine variables.
const forceManyBodyStrength = -50;  // how strong the nodes repel each other; a.k.a., "charge".
const forceLinkDistance = 80;       // preferred length of edges, or lines.

// optional variables to set.
const forceAlphaDecay = 0.02;       // how fast should the animation resolve?
const forceVelocityDecay = 0.05;    // velocity decay; a.k.a., friction
const forceXstrength = 0.05;        // pulls nodes to the center
const forceYstrength = 0.05;        // pulls nodes to the center


export type GraphForceDirectedFunctions = {
  copySvg: () => void;
  copyPng: () => void;
};

type GraphForceDirectedProps = {
  nodes: GraphNode[];
  links: GraphLink[];
  width?: number;       // svg width
  height?: number;      // svg height
};

// ************************************************
const GraphForceDirected = forwardRef< GraphForceDirectedFunctions,
                                       GraphForceDirectedProps >(({ nodes,
                                                                    links,
                                                                    width = 900,
                                                                    height = 400 }, ref) =>
{

  // hooks
  // list the functions that the parent is allowed to call.
  useImperativeHandle(ref, () => ({

    copySvg: () => {
       if (!svgRef.current) return;
       copySvgElementToClipboard(svgRef.current);
    },

    copyPng: async () => {
       if (!svgRef.current) return;
       await copyPngElementToClipboard(svgRef.current);
    }
  }));

  const svgRef = useRef<SVGSVGElement | null>(null);  // get a handle to the DOM graph surface.
  const { log } = useLog();
  useEffect(() => {log("[mount]  GraphForceDirected");}, [log]);

  const simulationRef = useRef<d3.Simulation<any, any> | null>(null); // physics engine running FDG
  const linkGroupRef = useRef<SVGGElement | null>(null);
  const nodeGroupRef = useRef<SVGGElement | null>(null);
  const labelGroupRef = useRef<SVGGElement | null>(null);

  const forceCenterWidth = width/2;   // these keep the whole graph centered in the plot;
  const forceCenterHeight = height/2; // a.k.a., "center".

  // create a function that takes a number (cluster no.) and returns the hex color as a string.
  // the colors are "#7fc97f", green; "#beaed4" purple; "#fdc086" orange; "#ffff99" yellow
  const colorScale = d3.scaleOrdinal<number, string>()
     .domain([0, 1, 2, 3])
     .range(d3.schemeAccent);

  // ---> useEffect number one.  Create the graph and it elements.
  /////////////////////////////////////////////////////////////////////
  useEffect(() => {
   if (!svgRef.current) return;

   const svg = d3.select(svgRef.current);
   svg.selectAll("*").remove();

   svg.append("rect")
     .attr("width", width)
     .attr("height", height)
     .attr("fill", BLACK_HEX);

   const graphGroup = svg.append("g");

   // Links, nodes, and labels are the pieces that make up the FDG elements.  Putting them
   // into the graphGroup, together appended to "g", organizes them neatly as one collection.
   // using links as an example, these objects are...
   // linkGroup        = D3 selection wrapper; a container that will be given data in the 2nd useEffect.
   // linkGroup.node() = actual SVG <g> DOM element
   // linkGroupRef     = React ref holding that DOM element

   const linkGroup = graphGroup.append("g").attr("class", "fdg-links").attr("stroke", WHITE_HEX).attr("stroke-opacity", 0.9);
   const nodeGroup = graphGroup.append("g").attr("class", "fdg-nodes").attr("stroke", WHITE_HEX).attr("stroke-width", 1.5);
   const labelGroup = graphGroup.append("g").attr("class", "fdg-labels").attr("font-size", 10).attr("fill", "#ddd");

   linkGroupRef.current = linkGroup.node();
   nodeGroupRef.current = nodeGroup.node();
   labelGroupRef.current = labelGroup.node();

   // create an instance of the physics engine from D3.
   // "links" pulls toward neighbors; connects edges by id field; try to keep them 60 pixels apart (distance).
   // "charge" is repulsion, so objects do not cover each other, if possible.
   // "center" centers all objects within the plot.
   // "x", "y" pulls individual object to the center, so they don't wander off stage.

   // STEP 3.  Create the force directed graph simulation.
   const simulation = d3
     .forceSimulation(nodes)
     .force("link",d3.forceLink(links).id((d: any) => d.id).distance(forceLinkDistance))
     .force("charge", d3.forceManyBody().strength(forceManyBodyStrength))
     .force("center", d3.forceCenter(forceCenterWidth, forceCenterHeight))
     .force("x", d3.forceX(forceCenterWidth).strength(forceXstrength))
     .force("y", d3.forceY(forceCenterHeight).strength(forceYstrength));
     //.alphaDecay(forceAlphaDecay)
     //.velocityDecay(forceVelocityDecay);


    // register tick handler; on every tick, update the SVG positions:
    // links, circles, and labels move to their new positions.
   const padding = 20;
   simulation.on("tick", () =>
   {
      nodes.forEach(d => {
        d.x = Math.max(padding, Math.min(width - padding, d.x ?? 0));
        d.y = Math.max(padding, Math.min(height - padding, d.y ?? 0));
      });

      // links
      d3.select(linkGroupRef.current!)
        .selectAll<SVGLineElement, any>("line")
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      // nodes
      d3.select(nodeGroupRef.current!)
        .selectAll<SVGCircleElement, any>("circle")
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

      // labels
      d3.select(labelGroupRef.current!)
        .selectAll<SVGTextElement, any>("text")
        .attr("x", d => d.x)
        .attr("y", d => d.y);
   });

   // --- Store simulation ---
   simulationRef.current = simulation;

   // --- Cleanup on unmount ---
   return () => {
     simulation.stop();
   };
  }, []);  // end of 1st useEffect for initialization of the graph.


 // ---> useEffect number two.  Update graph when data changes.
 /////////////////////////////////////////////////////////////
 useEffect(() => {
   if (!simulationRef.current) return;

   const simulation = simulationRef.current;

   // STEP 0.  Draw the labels.
   const labelSel = d3
     .select(labelGroupRef.current!)
     .selectAll<SVGTextElement, any>("text")
     .data(nodes, d => d.id)
     .join("text")
     .text(d => d.image_id ?? d.id)
     .attr("fill", WHITE_HEX)
     .attr("font-size", 14)
     .attr("dx", 8)
     .attr("dy", "0.35em");

   // STEP 1.  Draw the links.
   const linkSel = d3
     .select(linkGroupRef.current!)
     .selectAll("line")
     .data(links, (d: any) => `${d.source}-${d.target}`)
     .join("line")
     .attr("stroke-width", 1);

   // STEP 2.  Draw the nodes.
   const nodeSel = d3
     .select(nodeGroupRef.current!)
     .selectAll<SVGCircleElement, GraphNode>("circle")
     .data(nodes, d => d.id)
     .join("circle")
     .attr("r", d => (d.isSelectedFilename ? 13 : 9))
     .attr("fill", d => (d.cluster == null ? BLACK_HEX : colorScale(d.cluster)))
     .attr("stroke", d => (d.isSelectedFilename ? WHITE_HEX : "none"))
     .attr("stroke-width", d => (d.isSelectedFilename ? 2 : 0))
     .call(createDragBehavior(simulationRef.current!));

   // call the D3 physics engine to refresh the UI.
   // D3 will calculate the new positions and velocities, and
   // call the tick handler created in the "create" useEffect.
   simulation.nodes(nodes as any);  // give the updated nodes to the physics engine
   (simulation.force("link") as any).links(links as any);  // give the link force new links.
   simulation.alpha(0.7).restart();  // restart the physics engine.

 }, [nodes, links]);  // end of 2nd useEffect for maintenance of the graph.


  return (
   <div style={{ marginTop: 24 }}>
      <svg
         ref={svgRef}
         className="w-full h-full"
         viewBox={`0 0 ${width} ${height}`}
         preserveAspectRatio="xMidYMid meet"
      />
   </div>
  );

}); // closes forwardRef call

export default GraphForceDirected;

