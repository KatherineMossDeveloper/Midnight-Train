// createZoom.ts
// Create the zoom event for GraphForceDirected graph

import * as d3 from "d3";

export function createZoomBehavior(
  zoomGroup: SVGGElement
) {
  return d3.zoom<SVGSVGElement, unknown>()
     .scaleExtent([0.3, 5])   // min/max zoom
    .on("zoom", (event) => {
        d3.select(zoomGroup)
            .attr("transform", event.transform);
    });
}
