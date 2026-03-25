// DataExplorer.tsx
//
// bar chart of the model's confidence percent.
// type DataExplorerProps
// export default function DataExplorer
//

"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { ImageDatabaseObject } from "@/types/ImageDatabaseObject";
import { useLog } from "@/components/LogPanel";

type DataExplorerProps = {
  data: ImageDatabaseObject[];
};

export default function DataExplorer({ data }: DataExplorerProps) {

    const svgRef = useRef<SVGSVGElement | null>(null);

    const { log } = useLog();
    useEffect(() => {log("[mount]  DataExplorer");}, [log]);
    useEffect(() => {if (!svgRef.current) return;

    // simple example: bar chart of confidence
    const width = 400;
    const height = 300;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous render
    svg.attr("width", width).attr("height", height);

    const x = d3
      .scaleBand()
      .domain(data.map((d, i) => String(i)))
      .range([0, width])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.confidence ?? 0) || 1])
      .range([height, 0]);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (_d, i) => x(String(i))!)
      .attr("y", (d) => y(d.confidence ?? 0))
      .attr("width", x.bandwidth())
      .attr("height", (d) => height - y(d.confidence ?? 0))
      .attr("fill", "steelblue");

  }, [data]);

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Confidence chart</h2>
      <svg ref={svgRef} />
    </div>
  );
}

      /* for debugging data in the db. put it in the return above */
      /* <ul> */
      /*  {crystals.map((d, i) => ( */
      /*    <li key={i}> */
      /*      {d.image_id} — {d.class_label}, {d.confidence}, {d.image_entropy} */
      /*    </li> */
      /*  ))} */
      /*</ul> */

