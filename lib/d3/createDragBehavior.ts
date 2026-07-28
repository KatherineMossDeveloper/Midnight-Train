// createDrag.ts
// Create the drag events for the GraphForceDirected graph.
//

import * as d3 from "d3";

// ************************************************
export function createDragBehavior(simulation: d3.Simulation<any, any>) {

  function dragStarted(event: d3.D3DragEvent<SVGCircleElement, any, any>,  node: any)
  {
    if (!event.active) {                      // if the physics engine is not moving,
      simulation.alphaTarget(0.3).restart();  // give it some energy and restart it.
    }
    node.fx = node.x;                         // freeze the node where it is.
    node.fy = node.y;
  }

  function dragged(event: d3.D3DragEvent<SVGCircleElement, any, any>, node: any)
  {
    node.fx = event.x;  // if the user is dragging the mouse,
    node.fy = event.y;  // update the node's positions.
  }

  function dragEnded(event: d3.D3DragEvent<SVGCircleElement, any, any>, node: any)
  {
    if (!event.active) {          // if the user no longer drags the node,
      simulation.alphaTarget(0);  // set the target alpha energy to 0.
    }
    node.fx = null;               // release the node positions.
    node.fy = null;               // so they are not longer fixed.
  }

  return d3.drag<SVGCircleElement, any>()
    .on("start", dragStarted)    // these are event-handler registrations (not calls),
    .on("drag", dragged)         // registered in D3's .drag() system.
    .on("end", dragEnded);       // they are like any other event-driven code.

}