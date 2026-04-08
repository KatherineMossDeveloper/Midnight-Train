// createDrag.ts
// Create the drag event for the GraphForceDirected graph.
//

import * as d3 from "d3";

// ************************************************
export function createDragBehavior(
  simulation: d3.Simulation<any, any>
) {
  return d3.drag<SVGCircleElement, any>()
    .on("start", (event, d) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    })
    .on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    })
    .on("end", (event, d) => {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
}
