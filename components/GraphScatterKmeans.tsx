// GraphScatterKmeans.tsx
// presents a circle for every image in PCA coordinates with
// kmeans colorization.
//
// export type GraphScatterKmeansFunctions
// export type ScatterPoint
// type GraphScatterKmeansProps
//
// This component is in the currently selected image context.
// See DataExplorerClient for notes on this.
// This component is a forwardRef because the parent needs to
// call function here if the user clicks a 'copy to clipboard'
// button on the main UI.
//

"use client";

import { useEffect, useRef } from "react";
import { forwardRef, useImperativeHandle } from "react";

import * as d3 from "d3";
import { useLog } from "@/components/LogPanel";
import { useSelection } from "@/components/SelectionContext";
import { copySvgElementToClipboard, copyPngElementToClipboard } from "@/lib/exportImages"
import { gray_dark } from "@/lib/graphUtilities";

export type GraphScatterKmeansFunctions = {
  copySvg: () => void;
  copyPng: () => void;
};

export type ScatterPoint = {
  x: number;
  y: number;
  cluster: number;
  filename: string;
};

type GraphScatterKmeansProps = {
  data: ScatterPoint[];
  width?: number;
  height?: number;
};


const GraphScatterKmeans = forwardRef< GraphScatterKmeansFunctions,
                                       GraphForceDirectedProps > (({ data, width = 300,
                                                                     height = 300 }, ref) =>
{

    // list the functions that the parent is allowed to call.
    // copySVG and copyPng allow the user to save graphics to the clipboard.
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

    const { log } = useLog();
    useEffect(() => {log("[mount]  GraphScatterKmeans");}, [log]);

    const svgRef = useRef<SVGSVGElement | null>(null);
    useEffect(() => {if (!svgRef.current) return;

    // wrap the svg element in the DOM within a D3 selection object.
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Add background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", gray_dark);

    // No points, return.
    if (!data || data.length === 0) {
      return;
    }
    // Log to browser console
    console.log("GraphScatterKmeans data sample:", data.slice(0, 5));

    const margin = { top: 20, right: 20, bottom: 80, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // create a drawing element with a rendering starting point at the margin left and top.
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Extents:  the min and maximum values in the data set.
    const xExtent = d3.extent(data, (d) => d.x);
    const yExtent = d3.extent(data, (d) => d.y);
    if ( !xExtent || xExtent[0] == null || xExtent[1] == null || !yExtent || yExtent[0] == null || yExtent[1] == null ) {
      console.warn("Invalid extents:", { xExtent, yExtent });
      return;
    }

    // pull cluster numbers from the data; create unique array of them.
    const clusterIDs = Array.from(new Set(data.map(d => d.cluster)))
      .filter((x): x is number => x !== undefined && x !== null)
      .sort((a, b) => a - b);
    // create a function that applies these numbers to the color scheme 'd3.schemeAccent'
    const colorScale = d3.scaleOrdinal<number, string>()
      .domain(clusterIDs)
      .range(d3.schemeAccent);

    // create functions that map values to screen coordinates later.
    const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
    const yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]);

    // create the X axis
    g.append("g")
     .attr("transform", `translate(0, ${innerHeight})`)
     .call(d3.axisBottom(xScale))
     .selectAll("text")
     .attr("fill", "white");

    // create the Y axis
    g.append("g")
     .call(d3.axisLeft(yScale))
     .selectAll("text")
     .attr("fill", "white");

    svg.selectAll("path, line")
       .attr("stroke", "white");

   // draw circles, call attach events, add static styles before calling
   const sel = g.selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.x))
      .attr("cy", (d) => yScale(d.y))
      .attr("r", 8)
      .attr("fill", (d) => colorScale(d.cluster))
      .attr("opacity", 0.85)
      .style("cursor", "pointer")
      .on("click", (_, d) => setSelectedFilename(d.filename));

   // transition that animates a redraw.
   sel
    .transition()
    .duration(2000)
    .ease(d3.easeCubicOut)
    .attr("r", d => d.filename === selectedFilename ? 8 : 4);

  }, [data, width, height]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll<SVGCircleElement, ScatterPoint>("circle")
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
});  // closes forwardRef call

export default GraphScatterKmeans;