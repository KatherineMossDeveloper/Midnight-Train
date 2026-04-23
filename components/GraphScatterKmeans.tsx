// GraphScatterKmeans.tsx
// presents a circle for every image in PCA coordinates with
// kmeans colorization.
//
// export type GraphScatterKmeansFunctions
// export type ScatterPoint
// type GraphScatterKmeansProps
// const GraphScatterKmeans = forwardRef
//
// See notes in DataExplorerClient about the currently selected image.s
//

"use client";

import { useEffect, useRef } from "react";
import { forwardRef, useImperativeHandle } from "react";

import * as d3 from "d3";
import { GRAY_DARK } from "@/lib/graphUtilities";
import { useLog } from "@/components/LogPanel";
import { useSelection } from "@/components/SelectionContext";
import { copySvgElementToClipboard, copyPngElementToClipboard } from "@/lib/exportImages"


export type GraphScatterKmeansFunctions = {
  copySvg: () => void;
  copyPng: () => void;
};

export type KmeansPoint = {
  x: number;
  y: number;
  cluster: number;
  filename: string;
};

type GraphScatterKmeansProps = {
  data: KmeansPoint[];
  width?: number;
  height?: number;
};

// ************************************************
const GraphScatterKmeans = forwardRef< GraphScatterKmeansFunctions,
                                       GraphScatterKmeansProps > (({ data,
                                                                     width = 300,
                                                                     height = 300 }, ref) =>
{
    // hooks.
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
    const svgRef = useRef<SVGSVGElement | null>(null);
    const { log } = useLog();
    useEffect(() => {log("[mount]  GraphScatterKmeans");}, [log]);

    // No points, return.
    if (!data || data.length === 0) {
      return;
    }

    useEffect(() => {
      if (!svgRef.current) return;
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Add dark screen background
      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", GRAY_DARK);

      // bottom is 80 to allow room for file names in entropy plot,
      // so that this plot and that plot line up horizontally.
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

      // pull kmeans cluster numbers from the data; create unique array of them, then sort.
      const clusterIDs = Array.from(new Set(data.map(d => d.cluster)))
        .filter((x): x is number => x !== undefined && x !== null)
        .sort((a, b) => a - b);
      // create a function that applies cluster numbers to the color scheme 'd3.schemeAccent'
      const colorScale = d3.scaleOrdinal<number, string>()
        .domain(clusterIDs)
        .range(d3.schemeAccent);


      // create function that map values to screen coordinates later.
      const xScale = d3.scaleLinear().domain(xExtent).range([0, innerWidth]);
      // create the X axis
      const xAxisG = g.append("g")
       .attr("transform", `translate(0, ${innerHeight})`)
       .call(d3.axisBottom(xScale))
       .selectAll("text")
       .attr("fill", "white");

      // create function that map values to screen coordinates later.
      const yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]);
      // create the Y axis
      const yAxisG = g.append("g")
       .call(d3.axisLeft(yScale))
       .selectAll("text")
       .attr("fill", "white");

      // make all paths and lines white.
      svg.selectAll("path, line")
        .attr("stroke", "white");

     // creates one circle per data item, positions it, colors it, then attaches a click handler.
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

     // transition that animates a redraw over 2 sec., with a slow down (ease).
     // the selected file is drawn larger than the others.
     sel
      .transition()
      .duration(2000)
      .ease(d3.easeCubicOut)
      .attr("r", d => d.filename === selectedFilename ? 8 : 4);

  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);

    svg.selectAll<SVGCircleElement, KmeansPoint>("circle")
      .attr("r", d => d.filename === selectedFilename ? 10 : 8)

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