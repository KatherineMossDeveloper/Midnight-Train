// GraphParallelCoordinates.tsx
// presents a circle for every image, with Parallel Coordinates on the Y axes
// and points on the X.
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

export type GraphParallelCoordinatesFunctions = {
  copySvg: () => void;
  copyPng: () => void;
};

export type ParallelCoordinatesPoints = {
  cluster: number;
  pca_y: number;
  pca_x: number;
  entropy: number;
  confidence: number;
  filename: string;
};

type GraphParallelCoordinatesByFilenameProps = {
  data: ParallelCoordinatesPoints[];
  visibleClusters: number[];
};

// ************************************************
// { data } 'deconstructs' the props object, so we have just an array later in this code.
const GraphParallelCoordinates = forwardRef< GraphParallelCoordinatesFunctions,
                                        GraphParallelCoordinatesByFilenameProps > (({ data, visibleClusters }, ref) =>
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
  useEffect(() => {log("[mount]  GraphParallelCoordinates");}, [log]);

  const width = 900;
  const height = 450;
  const WHITE_HEX = "#FFFFFF";
  const margin = { top: 30, right: 40, bottom: 50, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;


type NumericField =
  | "cluster"
  | "pca_x"
  | "pca_y"
  | "entropy"
  | "confidence";

const fields: NumericField[] = [
  "cluster",
  "pca_x",
  "pca_y",
  "entropy",
  "confidence",
];
  // No points, return.
  const visibleData = data.filter(d =>
     visibleClusters.includes(d.cluster)
  );
  if (!data || data.length === 0) {
    return null;
  }

  const colorScale = d3.scaleOrdinal<number, string>()  // <type, type> is to make Typescript happy.
    .domain([0, 1, 2, 3])   // 0 green (CEX); 1 purple (PG); 2 orange (PG); 3 yellow (PG)
    .range(d3.schemeAccent);

  const selectedColorScale = d3.scaleOrdinal<number, string>()
    .domain([0, 1, 2, 3])
    .range([
      "#1bff77",  // deep green
      "#6a3d9a",  // deep purple
      "#d95f02",  // deep orange
      "#ffee00"   // deep gold
    ]);

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

    // sort data by their kmeans cluster number.
    const clusterIDs = Array.from(new Set(data.map(d => d.cluster)))
      .filter((x): x is number => x !== undefined && x !== null)
      .sort((a, b) => a - b);

    // STEP 0. Prepare graph area.
    //         First, D3 creates a handle, or reference, to the DOM SVG graphic object
    // Add a background and color it black.
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", BLACK_HEX);

    // Create an area on the SVG for the plot.  It will have its own
    // coordinates, so that the upper left corner will be 0,0, with a
    // margin that creates a border.  Draw on the paper, not on the desk.
    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // STEP 1. Create the X axis and its scale.
    const xScale = d3
      .scalePoint()  // no data on the X axis; just make evenly-spaced points.
      .domain(fields)
      .range([0, innerWidth])
      .padding(0.5);

    // STEP 2. Create the Y axis and its scale.
    // Create an empty object that will hold one Y scale for each field.
const yScales: Record<NumericField, d3.ScaleLinear<number, number>> = {} as Record<
  NumericField,
  d3.ScaleLinear<number, number>
>;

   for (const field of fields) {
      const extent = d3.extent(data, d => d[field]);
      if (extent[0] === undefined || extent[1] === undefined) {
         continue;
      }
      yScales[field] = d3.scaleLinear()
        .domain(extent)
        .range([innerHeight, 0]);
   }

    // STEP 3.  put it all together. Create Y axes for the data,
    //          apply the following "attr"-ibutes to them.
    function linePath(d: ParallelCoordinatesPoints) {
      return d3.line()(
        fields.map((dim) => [
           xScale(dim) ?? 0,
           yScales[dim](d[dim])
        ])
      );
    }

    const sel = g.selectAll("path.data-line")
      .data(visibleData)
      .join("path")
      .attr("class", "data-line")
      .attr("d", linePath)
      .attr("fill", "none")
      .attr("stroke", d => colorScale(d.cluster))
      .attr("stroke-width", 5)
      .attr("opacity", 0.75)
      .on("click", (_, d) => setSelectedFilename(d.filename));

    // tell D3 to draw the selected line last so that it is on top and more visible.
    //sel.filter(d => d.filename === selectedFilename).raise();

    // Remove old highlight layer before redrawing it.
    g.selectAll("path.selected-glow").remove();
    const selectedDatum = data.find(d => d.filename === selectedFilename);
    if (selectedDatum) {
      // Backlit / glow line.
      g.append("path")
       .datum(selectedDatum)
       .attr("class", "selected-glow")
       .attr("d", linePath)
       .attr("fill", "none")
       .attr("stroke", "#ffd54f").attr("stroke-width", 16)
       .attr("opacity", 0.75)
       .attr("stroke-linecap", "round").attr("stroke-linejoin", "round")
       .style("filter", "blur(5px)")  // tell SVG to add blurred path.
       .raise();

      // Crisp selected line.
      g.append("path")
       .datum(selectedDatum)
       .attr("class", "selected-glow")
       .attr("d", linePath)
       .attr("fill", "none")
       .attr("stroke", d => selectedColorScale(d.cluster)).attr("stroke-width", 7)
       .attr("opacity", 1)
       .attr("stroke-linecap", "round").attr("stroke-linejoin", "round")
       .raise();
    }

    // create an animation that makes the currently selected file name prominent.
    sel
      .transition()
      .duration(300)
      .ease(d3.easeCubicOut)
      .attr("stroke", d => d.filename === selectedFilename ? "#fff" : colorScale(d.cluster))
      .attr("stroke-width", d => d.filename === selectedFilename ? 7 : 5)
      .attr("opacity", d => d.filename === selectedFilename ? 1 : 0.75);

    // draw the details of each axis in a loop.
    fields.forEach((dim) => {
       const axisGroup = g.append("g")
          .attr("transform", `translate(${xScale(dim)},0)`)
          .call(d3.axisLeft(yScales[dim]).ticks(5));
       axisGroup.selectAll("path").attr("stroke", WHITE_HEX);
       axisGroup.selectAll("line").attr("stroke", WHITE_HEX);
       axisGroup.selectAll("text").attr("fill", WHITE_HEX);
       axisGroup.append("text").attr("y", -5).attr("text-anchor", "middle")
                               .attr("fill", WHITE_HEX).attr("font-size", 14).text(dim);
    });

  }, [data]);  // closes forwardRef call

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );

}); // closes forwardRef call

export default GraphParallelCoordinates;
