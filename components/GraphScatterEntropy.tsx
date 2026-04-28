// GraphScatterEntropy.tsx
// presents a circle for every image, with entropy on the Y axis
// and the file name on the X with kmeans colorization.
//
// See notes in DataExplorerClient about the currently selected image.
//

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { forwardRef, useImperativeHandle } from "react";

import * as d3 from "d3";
import { copySvgElementToClipboard, copyPngElementToClipboard } from "@/lib/exportImages"
import { useLog } from "@/components/LogPanel";
import { useSelection } from "@/components/SelectionContext";
import { BLACK_HEX } from "@/lib/graphUtilities";

export type GraphScatterEntropyFunctions = {
  copySvg: () => void;
  copyPng: () => void;
};

export type EntropyPoint = {
  entropy: number;
  cluster: number;
  filename: string;
};

type GraphScatterEntropyByFilenameProps = {
  data: EntropyPoint[];
  width?: number;       // svg width
  height?: number;      // svg height
  xTickEvery?: number;
};

// ************************************************
const GraphScatterEntropy = forwardRef< GraphScatterEntropyFunctions,
                                        GraphScatterEntropyByFilenameProps > (({ data,
                                                                                 width = 300,
                                                                                 height = 300,
                                                                                 xTickEvery = 1 }, ref) =>
{
  // hooks.
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
  const svgRef = useRef<SVGSVGElement | null>(null);   // get a handle to the DOM graph surface.
  const { log } = useLog();
  useEffect(() => {log("[mount]  GraphScatterEntropy");}, [log]);

  // Sort the data alphabetically for the X axis domain
  const sortedEntropyPoints = useMemo(() => {
    const copy = [...data];  // ... gets a copy, so we don't change the original.
    copy.sort((a, b) => a.filename.localeCompare(b.filename));
    return copy;
  }, [data]);

  // No points, return.
  if (!data || data.length === 0) {
    return;
  }

  // ---> useEffect to create the graph and it elements.
  /////////////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", BLACK_HEX);

    // calculate dimensions;  bottom is 80 to allow room for file names.
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

    // create a drawing element with a rendering starting point at the margin left and top.
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // prepare the X axis labels. Pull out the filenames
    const xDomainFilenames = sortedEntropyPoints.map((d) => d.filename);
    const x = d3
      .scaleBand<string>()       // create a parallel array of screen positions for the discrete string data.
      .domain(xDomainFilenames)  // create a look-up table for positioning
      .range([0, innerWidth])
      .padding(0.2);

    // create the X axis, with tick marks for every file name.
    const xAxis = d3.axisBottom(x);

    // draw the X axis
    const xAxisG = g
      .append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    // rotate long file names on the X axis.
    xAxisG.selectAll<SVGTextElement, string>("text")
      .attr("fill", "white")
      .style("text-anchor", "end")
      .attr("dx", "-0.6em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-65)");

    // prepare the Y axis numbers:  numeric => scaleLinear
    const yMaxEntropy = d3.max(sortedEntropyPoints, (d) => d.entropy) ?? 0;
    const y = d3
      .scaleLinear()            // numeric data is continuous
      .domain([0, yMaxEntropy * 1.05]) // max Y, plus a bit of headroom
      .nice()
      .range([innerHeight, 0]);

    // create the Y axis
    const yAxis = d3.axisLeft(y).ticks(6);

    const yAxisG = g.append("g")
     .call(yAxis)
     .selectAll("text")
     .attr("fill", "white");

    // add the path color, so that when copied to clipboard, lines will be white.
    svg.selectAll("path, line")
       .attr("stroke", "white");

    // create circles for the sortedEntropyPoints data objects, using filename, entropy #, and cluster #.
    const sel = g.selectAll("circle")
      .data(sortedEntropyPoints)
      .enter()
      .append("circle")
      .attr("cx", (d) => (x(d.filename) ?? 0) + x.bandwidth() / 2) // map file name to pixel position, centering.
      .attr("cy", (d) => y(d.entropy))
      .attr("fill", (d) => colorScale(d.cluster))
      .attr("opacity", 0.85)
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedFilename(d.filename));

    sel
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr("r", d => d.filename === selectedFilename ? 10 : 6)
      .attr("stroke", d => d.filename === selectedFilename ? "#fff" : "none")
      .attr("stroke-width", d => d.filename === selectedFilename ? 2 : 0);

  }, [data]);

  
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
