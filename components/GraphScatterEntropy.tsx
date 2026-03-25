// GraphScatterEntropy.tsx
// presents a circle for every image at entropy on the Y axis
// and the file name on the X with kmeans colorization.
//
// This component is in the currently selected image context.
// See DataExplorerClient for notes on this.
// This component is a forwardRef because the parent needs to
// call function here if the user clicks a 'copy to clipboard'
// button on the main UI.
//

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import { copySvgElementToClipboard, copyPngElementToClipboard } from "@/lib/exportImages"
import * as d3 from "d3";
import { useLog } from "@/components/LogPanel";
import { useSelection } from "@/components/SelectionContext";
import { gray_dark } from "@/lib/graphUtilities";

export type EntropyPoint = {
  entropy: number;  // positive float
  cluster: number;  // positive float
  filename: string;  // file name
};

type GraphScatterEntropyByFilenameProps = {
  data: EntropyPoint[];
  width?: number;
  height?: number;
  xTickEvery?: number;
};

export type GraphScatterEntropyFunctions = {
  copySvg: () => void;
  copyPng: () => void;
};


const GraphScatterEntropy = forwardRef< GraphScatterEntropyFunctions,
                                        GraphScatterEntropyByFilenameProps > (({ data,
                                                                                 width = 300,
                                                                                 height = 300,
                                                                                 xTickEvery = 1 }, ref) =>
{
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

  const { selectedFilename, setSelectedFilename } = useSelection();
  const svgRef = useRef<SVGSVGElement | null>(null);

  const { log } = useLog();
  useEffect(() => {log("[mount]  GraphScatterEntropy");}, [log]);

  // Sort filenames alphabetically for the X axis domain
  const sorted = useMemo(() => {
    const copy = [...data];
    copy.sort((a, b) => a.filename.localeCompare(b.filename));
    return copy;
  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add dark screen background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", gray_dark);

    // calculate dimensions
    const margin = { top: 20, right: 20, bottom: 80, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // sort data by their kmeans cluster number.
    const clusterIDs = Array.from(new Set(data.map(d => d.cluster)))
      .filter((x): x is number => x !== undefined && x !== null)
      .sort((a, b) => a - b);

    // apply the color scheme, using the cluster numbers as index.
    const colorScale = d3.scaleOrdinal<number, string>()
      .domain(clusterIDs)
      .range(d3.schemeAccent);

    // give the svg a width and height
    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // prepare the X axis labels, which are file names.
    const xDomain = sorted.map((d) => d.filename);
    const x = d3
      .scaleBand<string>()
      .domain(xDomain)
      .range([0, innerWidth])
      .padding(0.2);

    // prepare the Y axis numbers:  numeric => scaleLinear
    const yMax = d3.max(sorted, (d) => d.entropy) ?? 0;
    const y = d3
      .scaleLinear()
      .domain([0, yMax * 1.05]) // a bit of headroom
      .nice()
      .range([innerHeight, 0]);

    // create the X axis, with tick marks for every file name.
    const xAxis = d3.axisBottom<string>(x).tickValues(
      xDomain.filter((_, i) => i % Math.max(1, xTickEvery) === 0) );

    // draw the X axis
    const gx = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    // rotate long file names on the X axis.
    gx.selectAll<SVGTextElement, string>("text")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .attr("dx", "-0.6em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-65)");

    // create the Y axis
    const yAxis = d3.axisLeft(y).ticks(6);

    g.append("g")
     .call(yAxis)
     .selectAll("text")
     .attr("fill", "white");

    // add the path color, so that it is copied to clipboard, when needed.
    svg.selectAll("path, line")
       .attr("stroke", "white");

    // Points (center them within the band using bandwidth()/2)
    const sel = g.selectAll("circle")
      .data(sorted)
      .enter()
      .append("circle")
      .attr("fill", (d) => "yellow")
      .attr("cx", (d) => (x(d.filename) ?? 0) + x.bandwidth() / 2)
      .attr("cy", (d) => y(d.entropy))
      .attr("r", 8)
      .attr("fill", (d) => colorScale(d.cluster))
      .attr("opacity", 0.85)
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedFilename(d.filename));

    sel
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr("r", d => d.filename === selectedFilename ? 8 : 4);
      
  }, [sorted, width, height, xTickEvery]);

  useEffect(() => {
    if (!svgRef.current) return;
  
    const svg = d3.select(svgRef.current);
    svg.selectAll<SVGCircleElement, EntropyPoint>("circle")
       .attr("r", d => d.filename === selectedFilename ? 10 : 8)
       .attr("stroke", d => d.filename === selectedFilename ? "white" : "none")
       .attr("stroke-width", d => d.filename === selectedFilename ? 2 : 0);
  
    }, [selectedFilename]);
   
  
  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );

}); // closes forwardRef call

export default GraphScatterEntropy;
