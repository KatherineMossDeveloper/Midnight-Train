// GraphForceDirected.tsx
// creates and maintains the force directed graph of image relationships,
// as calculated by the Weaviate database default nearest neighbor algorithm,
// or as pulled from the JSON file.  Note that this component is a forward
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
// to update the log:  useEffect(() => {log("GraphForceDirected mounted.");}, [log]);
// to create the FDG:  useEffect(() => { if (!svgRef.current) return;
// to update the FDG:  useEffect(() => { if (!simulationRef.current) return;
//
// Notes on the flow.
// The use effect number one (create) waits for the DOM to exist so the graph can be created.
// The use effect number two (update) waits for the simulation to exist so it can be updated.
//
// The order of code flow here is approximately...
// -useEffect number one (create) is hit, but the svgRef is not current.
// -useEffect number one (create) is hit, so the d3.simulation is created.
// -useEffect number two (create) is hit, so the d3.simulation is maintained.
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
import { createZoomBehavior } from "@/lib/d3/createZoom";
import { createDragBehavior } from "@/lib/d3/createDrag";

// misc.
import { BLACK_HEX } from "@/lib/graphUtilities";
import { copySvgElementToClipboard, copyPngElementToClipboard } from "@/lib/exportImages"

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
  const zoomGroupRef = useRef<SVGGElement | null>(null);
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, imageSrc: "", label: "", });

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

   // --- ZOOM ROOT ---
   const zoomGroup = svg.append("g");
   zoomGroupRef.current = zoomGroup.node();

   // --- create and attach mouse events, etc. to the SVG ---
   if (!zoomGroupRef.current) return;
   const zoomBehavior = createZoomBehavior(zoomGroupRef.current);
   svg.call(zoomBehavior as any);

   // --- disable dbl-click zoom ---
   svg.on("dblclick.zoom", null);

   // --- Create persistent groups ---
   const linkGroup = zoomGroup.append("g").attr("class", "fdg-links").attr("stroke", "#888").attr("stroke-opacity", 0.6);
   const nodeGroup = zoomGroup.append("g").attr("class", "fdg-nodes").attr("stroke", "#fff").attr("stroke-width", 1.5);
   const labelGroup = zoomGroup.append("g").attr("class", "fdg-labels").attr("font-size", 10).attr("fill", "#ddd");

   // --- Store DOM references, handles, to the edges, nodes, and node labels ---
   linkGroupRef.current = linkGroup.node();
   nodeGroupRef.current = nodeGroup.node();
   labelGroupRef.current = labelGroup.node();

   // --- Create force simulation ---
   const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(60)
     )
     .force("charge", d3.forceManyBody().strength(-120))
     .force("center", d3.forceCenter(width / 2, height / 2))
     .force("x", d3.forceX(width / 2).strength(0.05))
     .force("y", d3.forceY(height / 2).strength(0.05));

    // --- Tick handler ---
    const padding = 20;
    simulation.on("tick", () => {
      nodes.forEach(d => {
        d.x = Math.max(padding, Math.min(width - padding, d.x ?? 0));
        d.y = Math.max(padding, Math.min(height - padding, d.y ?? 0));
      });

    // update links
    d3.select(linkGroupRef.current!)
      .selectAll<SVGLineElement, any>("line")
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    // update nodes
    d3.select(nodeGroupRef.current!)
      .selectAll<SVGCircleElement, any>("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);

    // update labels
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

  // --- LINKS ---
   const linkSel = d3
     .select(linkGroupRef.current!)
     .selectAll("line")
     .data(links, (d: any) => `${d.source}-${d.target}`);
   linkSel.exit().remove();
   linkSel
     .enter()
     .append("line")
     .attr("stroke-width", 1);

   // --- NODES ---
   const nodeSel = d3
     .select(nodeGroupRef.current!)
     .selectAll<SVGCircleElement, GraphNode>("circle")
     .data(nodes, d => d.id);
   nodeSel.exit().remove();
   const nodeEnter = nodeSel
     .enter()
     .append("circle")

   nodeSel
     .merge(nodeEnter)
     .attr("r", d => (d.isCenter ? 10 : 8))
     .attr("fill", d => (d.cluster == null ? "#f00" : colorScale(d.cluster)))
     .attr("stroke", d => (d.isCenter ? "#fff" : "none"))
     .attr("stroke-width", d => (d.isCenter ? 2 : 0))
     .call(createDragBehavior(simulationRef.current!))
     .on("mousedown.zoom", null)  // when mouse is pressed on a node, do not start a zoom.
     .on("mouseover", (event, d) => {
       setTooltip({
         visible: true,
         x: event.clientX,
         y: event.clientY,
         imageSrc: `/images_testing/${d.image_id}`,
         label: d.image_id ?? "",
       });
     })
     .on("mousemove", (event) => {
       setTooltip(prev => ({
         ...prev,
         x: event.clientX,
         y: event.clientY,
       }));
     })
     .on("mouseout", () => {
       setTooltip(prev => ({ ...prev, visible: false }));
     });

  // --- LABELS ---
  const labelSel = d3
    .select(labelGroupRef.current!)
    .selectAll<SVGTextElement, any>("text")
    .data(nodes, (d: any) => d.id);
  labelSel.exit().remove();
  labelSel
    .enter()
    .append("text")
    .text(d => d.image_id ?? d.id)  // filename preferred
    .attr("dx", 8)                  // offset from node
    .attr("dy", "0.35em");

  // --- UPDATE SIMULATION ---
  simulation.nodes(nodes as any);
  (simulation.force("link") as any).links(links as any);

  simulation.alpha(0.7).restart();
}, [nodes, links]);  // end of 2nd useEffect for maintenance of the graph.

  // TooltipFDG is a sibling to the SVG; not in D3, hence, its location below.
  return (
  <div style={{ marginTop: 24 }}>
      <svg
         ref={svgRef}
         className="w-full h-full"
         viewBox={`0 0 ${width} ${height}`}
         preserveAspectRatio="xMidYMid meet"
         />
      <TooltipFDG {...tooltip} />
  </div>
);

}); // closes forwardRef call

export default GraphForceDirected;
