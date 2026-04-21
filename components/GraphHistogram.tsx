// GraphHistogram.tsx
// Graphs the histogram of the currently selected image.
//
// type GraphHistogramProps
// export default function GraphHistogram
//
// See notes in DataExplorerClient about the currently selected image.
//

"use client";

import * as d3 from "d3";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelection } from "@/components/SelectionContext";
import { imageToGrayscalePixels } from "@/lib/imageToGrayscalePixels";

type GraphHistogramProps = {
  title?: string;
  width?: number;
  height?: number;
  barColor?: string;
};

// ************************************************
export default function GraphHistogram({ title = "Hover for color intensity & pixel count", width = 300, height = 400,
                                         barColor = "#bedbff", // light blue
}: GraphHistogramProps) {

  // hooks.
  const { selectedFilename } = useSelection();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pixels, setPixels] = useState<number[]>([]);

  const hasPixels = pixels.length > 0;

  const bins = useMemo(() => {
    if (!hasPixels) return [];

    const histogram = d3
      .bin<number, number>()
      .domain([0, 255])
      .thresholds(64); // number of bins

    return histogram(pixels);
  }, [pixels, hasPixels]);


  useEffect(() => {
    // when the currently selected file name changes, get its pixels.
    let cancelled = false;  // Reacts cancel flag to keep things up to date.
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

  useEffect(() => {
    // create a handle to the SVG DOM element by wrapping it with d3.
    const svg = d3.select(svgRef.current);
    // dump any existing changes to the svg.
    svg.selectAll("*").remove();

    const maxBin = d3.max(bins, d => d.length);  // get the highest # for the title.
    const margin = { top: 10, right: 20, bottom: 10, left: 20 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // give the svg a shape.
    const root = svg
      .attr("viewBox", `0 0 ${width} ${height}`);

    // create an element 'g' inside the svg to draw on.
    // adjust it a bit down and to the right.
    const g = root
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // if there is no data to display, put a note in the middle of the plot.
    if (!hasPixels || bins.length === 0) {
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#94a3b8")
        .text("No histogram data available");
      return;
    }

    // scaling x:  mapping the data (0-255) to screen dimensions.
    const x = d3.scaleLinear().domain([0, 255]).range([0, innerWidth]);

    // find out how tall the Y axis should be.
    const yMax = d3.max(bins, (d) => d.length) ?? 0;

    // scaling y:  mapping the data (yMax) to screen dimensions.  (.nice = round tick labels)
    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);

    // create axes functions.  create ticks mark.  make the tick labels decimal, "d".
    const xAxis = d3.axisBottom(x).ticks(8).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format("d"));

    // draw X axis on another group within the g group.
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((sel) => {
        sel.selectAll("text").attr("fill", "#cbd5e1");
        sel.selectAll("line").attr("stroke", "#94a3b8");
        sel.selectAll("path").attr("stroke", "#94a3b8");
      });

    // draw Y axis on another group within the g group.
    g.append("g")
      .call(yAxis)
      .call((sel) => {
        sel.selectAll("text").attr("fill", "#cbd5e1");
        sel.selectAll("line").attr("stroke", "#94a3b8");
        sel.selectAll("path").attr("stroke", "#94a3b8");
      });

    // x-axis label
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 34)
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .text("Pixel intensity");

    // y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -36)
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .text("Count");

    // horizontal grid lines on the plot on another group within the g group.
    g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(y)
          .ticks(5)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .call((sel) => {
        sel.selectAll("line")
          .attr("stroke", "#334155")
          .attr("stroke-opacity", 0.45);
        sel.select("path").remove();
      });

    // draw a rectangle for each histogram bin
    g.selectAll("rect.hist-bar")
      .data(bins)                                  // use the bins data.
      .enter()                                     // create a DOM element for all
      .append("rect")                              // create rectangles
      .attr("class", "hist-bar")                   // create class handle for this
      .attr("x", (d) => x(d.x0 ?? 0) + 1)          // left edge of bars
      .attr("y", (d) => y(d.length))               // top edge of bars
      .attr("width", (d) => {
        const w = x(d.x1 ?? 0) - x(d.x0 ?? 0) - 2;
        return Math.max(0, w);
      })
      .attr("height", (d) => innerHeight - y(d.length)) // height = bottom - top
      .attr("rx", 2)                                // rounded corners
      .attr("fill", barColor)
      .attr("opacity", 0.9)
      .append("title")
      .text((d) => {
        const from = Math.round(d.x0 ?? 0);
        const to = Math.round(d.x1 ?? 0);
        return `Color intensity ${from}-${to}\nPixel count: ${d.length}`;
      });

    // title at the top of the plot.
    g.append("text")
      .attr("x", 0)
      .attr("y", -6)
      .attr("fill", "#f8fafc")
      .text(selectedFilename + " (maximum pixel count is " + maxBin + ").");
  }, [bins, hasPixels]);

  return (
   <div className="rounded-xl bg-slate-900/60 h-[350px]">
    <span>{title}</span>
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    />
   </div>
  );
}