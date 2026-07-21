// createDrag.ts
// Create the drag events for the GraphForceDirected graph.
//

import * as d3 from "d3";

// ************************************************
export function createDragBehavior(simulation: d3.Simulation<any, any>) {

function dragStarted(event: d3.D3DragEvent<SVGCircleElement, any, any>,  d: any)
{
  if (!event.active) {
    simulation.alphaTarget(0.3).restart();
  }
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(event: d3.D3DragEvent<SVGCircleElement, any, any>, d: any)
{
  d.fx = event.x;
  d.fy = event.y;
}

function dragEnded(event: d3.D3DragEvent<SVGCircleElement, any, any>, d: any)
{
  if (!event.active) {
    simulation.alphaTarget(0);
  }
  d.fx = null;
  d.fy = null;
}

  return d3.drag<SVGCircleElement, any>()
    .on("start", dragStarted)
    .on("drag", dragged)
    .on("end", dragEnded);

}