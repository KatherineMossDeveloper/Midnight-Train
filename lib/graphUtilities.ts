// /lib/graphUtilities.tsx
// maintains the nodes and edges for the force directed graph in the
// GraphForceDirected component.  It will add them when a new image
// is selected by the user.
//
// export function mergeGraphData(...)
// export const CLUSTER_COLORS_HEX
// export const CLUSTER_COLORS_HEX_TAILWIND to color the image circles on the ImageGallery images.
//

import type { GraphNode, GraphLink } from "@/types/FDGtypes";

export const GRAY_DARK = "#020617"

export const CLUSTER_HEX  = [
  "#7fc97f",
  "#beaed4",
  "#fdc086",
  "#ffff99",
];

export const CLUSTER_COLORS = [
  "border-l-[#7fc97f]",
  "border-l-[#beaed4]",
  "border-l-[#fdc086]",
  "border-l-[#ffff99]",
];

// ************************************************
export function mergeGraphData(
  prevNodes: Map<string, GraphNode>,
  prevEdges: GraphLink[],
  center: {
  id: string;
  image_id?: string;
  kmeans_pca_cluster?: number;
  },
  neighbors: Array<{
    id: string;
    image_id?: string;
    kmeans_pca_cluster?: number;
    distance: number;
  }>
) {
  const newNodes = new Map(prevNodes);
  const newEdges = [...prevEdges];

  // Clear previous center flags
  newNodes.forEach(node => {
     node.isCenter = false;
  });

  // Add center node, mark as the center one.
  if (!newNodes.has(center.id)) {
    newNodes.set(center.id,
        {id: center.id,
         image_id: center.image_id,
         isCenter: true });
  }
  // mark the center one, even if not new. (c)
  const centerNode = newNodes.get(center.id)!;
  centerNode.isCenter = true;
  centerNode.image_id = center.image_id;

  if (center.kmeans_pca_cluster !== undefined && center.kmeans_pca_cluster !== null) {
    centerNode.cluster = center.kmeans_pca_cluster;
  }
  console.log( "Inside graphUtilities, center test", center.id, center.kmeans_pca_cluster );

  for (const n of neighbors) {
    // Add neighbor node
    if (!newNodes.has(n.id)) {
      newNodes.set(n.id, {
        id: n.id,
        image_id: n.image_id,
        cluster: n.kmeans_pca_cluster,
      });
    }

    // Add edge if it doesn't already exist
    const exists = newEdges.some(
      e => e.source === center.id && e.target === n.id
    );

    if (!exists) {
      newEdges.push({
        source: center.id,
        target: n.id,
        distance: n.distance,
        weight: 1 / (n.distance + 1e-6),
      });
    }
  }

  return { newNodes, newEdges };
}
