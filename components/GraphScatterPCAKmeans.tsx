// GraphScatterPCAKmeans.tsx
// presents a circle for every image in PCA coordinates with
// kmeans colorization.
//
// export type GraphScatterKmeansFunctions
// export type ScatterPoint
// type GraphScatterKmeansProps
// const GraphScatterKmeans = forwardRef
//
// See notes in DataExplorerClient about the currently selected image.
//

"use client"; // D3 uses SVG elements, so this should run in the browser.

import { useEffect, useRef } from "react";  // useEffect runs code when variable(s) change.
import { forwardRef, useImperativeHandle } from "react"; // allow the parent to call function here when buttons are pressed in the parent.

import * as d3 from "d3";
import { BLACK_HEX } from "@/lib/graphUtilities";
import { useLog } from "@/components/LogPanel";  // useLog is hook into the LogPanel.
import { useSelection } from "@/components/SelectionContext"; // useSelection will notify when a new image file is selected.
import { copySvgElementToClipboard, copyPngElementToClipboard } from "@/lib/exportImages"

const height = 300;
const width = 300;


export type GraphScatterPCAKmeansFunctions = {
  copySvg: () => void;
  copyPng: () => void;
};

export type PCAKmeansPoint = {
  x: number;
  y: number;
  cluster: number;
  filename: string;
};

type GraphScatterPCAKmeansProps = {
  data: PCAKmeansPoint[];
};

// ************************************************
// { data } 'deconstructs' the props object, so we have just PCAKmeansPoint[] later in this code.
const GraphScatterKmeans = forwardRef< GraphScatterPCAKmeansFunctions,
                                       GraphScatterPCAKmeansProps > (( { data }, ref) =>
{
    // hooks.
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

    // alert when a new image file is selected.
    const { selectedFilename, setSelectedFilename } = useSelection();
    // get a handle to the DOM SVG, which might not exist yet.
    const svgRef = useRef<SVGSVGElement | null>(null);
    // get the log functionality.
    const { log } = useLog();
    // use the log by writing to the log component.
    useEffect(() => {log("[mount]  GraphScatterKmeans");}, [log]);

    // No points, return.
    if (!data ) {
      return;
    }

  // ---> useEffect to create the graph and it elements.
  /////////////////////////////////////////////////////////////////////
  useEffect(() => {
      if (!svgRef.current) return;

      // bottom is 80 to allow room for file names in entropy plot,
      // so that this plot and that plot line up horizontally.
      const margin = { top: 20, right: 20, bottom: 80, left: 20 };
      const innerWidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;


      // STEP 0. Prepare graph area.
      //         First, D3 creates a handle to the DOM SVG graphic object
      const svg = d3.select(svgRef.current);
      svg.selectAll("*").remove();

      // Add a background
      svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", BLACK_HEX);

      // make all paths and lines white.
      svg.selectAll("path, line")
        .attr("stroke", "white");

      // Create an area on the SVG for the plot with its own coordinates.
      // Draw on the paper, not on the desk.
      const g = svg.append("g")
          .attr("transform", `translate(${margin.left},${margin.top})`);

      // Extents:  the min and maximum values in the data set.
      const xExtent = d3.extent(data, d => d.x);
      const yExtent = d3.extent(data, d => d.y);
      if ( xExtent[0] === undefined || xExtent[1] === undefined ||
           yExtent[0] === undefined || yExtent[1] === undefined)
      {
          return;
      }

      // STEP 1. Create the X axis, along the bottom of the plot.  Create the colorScale
      //         function that will take a number and return the corresponding color,
      //         like this... 0 → green, 1 → purple, 2 → orange, 3 → yellow.
      // pull kmeans cluster numbers from the data; create unique array of them, then sort.
      const clusterIDs = Array.from(new Set(data.map(d => d.cluster)))
        .filter((x): x is number => x !== undefined && x !== null)
        .sort((a, b) => a - b);
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


      // STEP 2.  Create the Y axis, along the left side of the plot.  yScale is a function
      //          that will convert the dimensions of the data to locations on the screen.
      const yScale = d3.scaleLinear().domain(yExtent).range([innerHeight, 0]);
      // create the Y axis
      const yAxisG = g.append("g")
       .call(d3.axisLeft(yScale))
       .selectAll("text")
       .attr("fill", "white");


      // STEP 3.  Put it all together. Create circles for the data and
      //          apply the following "attr"-ibutes to the circles.
     const plottedData = g.selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", (d) => xScale(d.x))
        .attr("cy", (d) => yScale(d.y))
        .attr("fill", (d) => colorScale(d.cluster))
        .attr("opacity", 0.85)
        .style("cursor", "pointer")
        .on("click", (_, d) => setSelectedFilename(d.filename));

     // transition that animates a redraw over 2 sec., with a slow down (ease).
     // the selected file is drawn larger than the others.
     plottedData
      .transition()
      .duration(1000)
      .ease(d3.easeCubicOut)
      .attr("r", d => d.filename === selectedFilename ? 10 : 6)
      .attr("stroke", d => d.filename === selectedFilename ? "#fff" : "none")
      .attr("stroke-width", d => d.filename === selectedFilename ? 2 : 0);


  }, [data]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll<SVGCircleElement, PCAKmeansPoint>("circle")
       .attr("r", d => d.filename === selectedFilename ? 10 : 6)
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