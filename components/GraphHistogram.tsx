// GraphHistogram.tsx
// Graphs the histogram of the currently selected image.
//

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelection } from "@/components/SelectionContext";
import { imageToGrayscalePixels } from "@/lib/imageToGrayscalePixels"
import * as d3 from "d3";

type GraphHistogramProps = {
  width?: number;
  height?: number;
  barColor?: string;
};

export default function GraphHistogram({ width = 520, height = 60,
                                         barColor = "#f5f5f4", // slate-100
}: GraphHistogramProps) {

  const { selectedFilename } = useSelection();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [pixels, setPixels] = useState<number[]>([]);
  const hasPixels = pixels.length > 0;

  const bins = useMemo(() => {
    if (!hasPixels) return [];

    const histogram = d3
      .bin<number, number>()
      .domain([0, 255])
      .thresholds(128); // number of bins

    return histogram(pixels);
  }, [pixels, hasPixels]);

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

  useEffect(() => {
    // create a handle to the SVG DOM element by wrapping it with d3.
    const svg = d3.select(svgRef.current);
    // dump any existing changes to the svg.
    svg.selectAll("*").remove();

    const maxBin = d3.max(bins, d => d.length);
    const margin = { top: 20, right: 20, bottom: 40, left: 48 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // give the svg a shape.
    const root = svg
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // create an element 'g' inside the svg & adjust it a bit down and to the right.
    const g = root
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // if there is not data to display, put a note in the middle of the plot.
    if (!hasPixels || bins.length === 0) {
      g.append("text")
        .attr("x", innerWidth / 2)
        .attr("y", innerHeight / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#94a3b8")
        .style("font-size", "14px")
        .text("No histogram data available");
      return;
    }

    // scaling x:  mapping the data (0-255) to screen dimensions.
    const x = d3
      .scaleLinear()
      .domain([0, 255])
      .range([0, innerWidth]);

    // find out how tall the Y axis should be.
    const yMax = d3.max(bins, (d) => d.length) ?? 0;

    // scaling y:  mapping the data (yMax) to screen dimensions.  (.nice = round tick labels)
    const y = d3
      .scaleLinear()
      .domain([0, yMax])
      .nice()
      .range([innerHeight, 0]);

    // create axes
    const xAxis = d3.axisBottom(x).ticks(8).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format("d"));

    // draw X axis
    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .call((sel) => {
        sel.selectAll("text").attr("fill", "#cbd5e1");
        sel.selectAll("line").attr("stroke", "#94a3b8");
        sel.selectAll("path").attr("stroke", "#94a3b8");
      });

    // draw Y axis
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
      .style("font-size", "12px")
      .text("Pixel intensity");

    // y-axis label
    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -36)
      .attr("text-anchor", "middle")
      .attr("fill", "#cbd5e1")
      .style("font-size", "12px")
      .text("Count");

    // horizontal grid lines on the plot.
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

    // bars
    g.selectAll("rect.hist-bar")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "hist-bar")
      .attr("x", (d) => x(d.x0 ?? 0) + 1)
      .attr("y", (d) => y(d.length))
      .attr("width", (d) => {
        const w = x(d.x1 ?? 0) - x(d.x0 ?? 0) - 2;
        return Math.max(0, w);
      })
      .attr("height", (d) => innerHeight - y(d.length))
      .attr("rx", 2)
      .attr("fill", barColor)
      .attr("opacity", 0.9)
      .append("title")
      .text((d) => {
        const from = Math.round(d.x0 ?? 0);
        const to = Math.round(d.x1 ?? 0);
        return `Intensity ${from}-${to}\nCount: ${d.length}`;
      });

    // title at the top of the plot.
    g.append("text")
      .attr("x", 0)
      .attr("y", -6)
      .attr("fill", "#f8fafc")
      .style("font-size", "14px")
      .style("font-weight", "600")
      .text(selectedFilename + " (maximum pixel count is " + maxBin + ").");
  }, [bins, hasPixels, width, height]);

  return (
    <div className="rounded-xl bg-slate-900/60 p-3 ">
      <svg ref={svgRef} />
    </div>
  );
}