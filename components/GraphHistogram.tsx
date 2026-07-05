// GraphHistogram.tsx
// Graphs the histogram of the currently selected image.
//
// type GraphHistogramProps
// export default function GraphHistogram
//
// See notes in DataExplorerClient about the currently selected image.
//

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

import * as d3 from "d3";
import { useSelection } from "@/components/SelectionContext";
import { imageToGrayscalePixels } from "@/lib/imageToGrayscalePixels";
import { BLACK_HEX, LIGHTBLUE_HEX } from "@/lib/graphUtilities";

// ************************************************
export default function GraphHistogram() {

  // hooks.
  const { selectedFilename } = useSelection();
  const svgRef = useRef<SVGSVGElement | null>(null);   // get a handle to the DOM graph surface.
  const [pixels, setPixels] = useState<number[]>([]);

  const width = 300;
  const height = 340;
  const hasPixels = pixels.length > 0;

  // when the currently selected file name changes, gets its pixels.
  useEffect(() => {
    // Reacts cancel flag to keep things up to date.
    let cancelled = false;

    if (!selectedFilename) {
      setPixels([]);
      return;
    }
    const src = `/images_testing/${selectedFilename}`;

    // immediately invoked function expression.
    (async () => {
      try {
        const pixels = await imageToGrayscalePixels(src);
        if (!cancelled) {
          setPixels(pixels);
        }
      } catch (err) {
        if (!cancelled) {
          console.error(err);
        }
      }
    })();

    // cancel if the user clicked too quickly.
    return () => { cancelled = true; };

  }, [selectedFilename]);

  const bins = useMemo(() => {
    if (!hasPixels) return [];

    const binGenerator = d3
      .bin<number, number>()
      .domain([0, 255])
      .thresholds(64); // number of bins

    return binGenerator(pixels);
  }, [pixels]);

  useEffect(() => {
    // STEP 0. Prepare graph area.
    // create a handle to the SVG DOM element by wrapping it with d3.
    const svg = d3.select(svgRef.current);
    // dump any existing changes to the svg.
    svg.selectAll("*").remove();

    const maxBin = d3.max(bins, d => d.length);
    const margin = { top: 20, right: 20, bottom: 40, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create an area on the SVG for the plot.  It will have its own
    // coordinates, so that the upper left corner will be 0,0, with a
    // margin that creates a border.  Draw on the paper, not on the desk.
    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // if there is no data to display, put a note in the middle of the plot.
    if (!hasPixels || bins.length === 0) {
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .style("font-size", "14px")
        .text("No histogram data available");
      return;
    }

    // STEP 1. Create the X axis and its scale.  The xScale is a function that
    //         will convert the dimensions of the data to screen locations.
    //         scaling x:  mapping the data (0-255) to screen dimensions.
    const xScale = d3.scaleLinear().domain([0, 255]).range([0, innerWidth]);

    // Create the X axis in its DOM container and keep a handle to it.
    const xAxis = d3.axisBottom(xScale).ticks(8).tickFormat(d3.format("d"));

    // Create the X axis in its DOM container and keep a handle to it.
    const xAxisG = g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis);

    // x-axis label
    g.append("text")
      .attr("x", innerWidth / 2).attr("y", innerHeight + 34)
      .attr("text-anchor", "middle").attr("fill", "white")
      .style("font-size", "12px")
      .text("Pixel color");


    // find out how tall the Y axis should be.
    const yMax = d3.max(bins, (d) => d.length) ?? 0;
    // scaling y:  mapping the data (yMax) to screen dimensions.  (.nice = round tick labels)
    const yScale = d3.scaleLinear().domain([0, yMax]).nice().range([innerHeight, 0]);
    const yAxis = d3.axisLeft(yScale).ticks(5).tickFormat(d3.format("d"));
    // draw Y axis
    g.append("g")
      .call(yAxis);
    // y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -36)
      .attr("text-anchor", "middle").attr("fill", "white")
      .style("font-size", "12px")
      .text("Pixel count");

    // horizontal grid lines on the plot.
    g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .call((sel) => {
        sel.selectAll("line")
          .attr("stroke", "white")
          .attr("stroke-opacity", 0.50);
        sel.select("path").remove();
      });

    // title at the top of the plot.
    g.append("text")
      .attr("x", -6)
      .attr("y", -6)
      .attr("fill", "#f8fafc")
      .style("font-size", "12px")
      .style("font-weight", "200")
      .text(selectedFilename + " (maximum pixel count is " + maxBin + ").");

    // bars
    g.selectAll("rect.hist-bar")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "hist-bar")
      .attr("x", (d) => xScale(d.x0 ?? 0) + 1)
      .attr("y", (d) => yScale(d.length))
      .attr("width", (d) => {
        const w = xScale(d.x1 ?? 0) - xScale(d.x0 ?? 0) - 2;
        return Math.max(0, w);
      })
      .attr("height", (d) => innerHeight - yScale(d.length))
      .attr("rx", 2)
      .attr("fill", LIGHTBLUE_HEX)
      .attr("opacity", 0.9);
  }, [bins]);

  return (
   <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    />
  );
}