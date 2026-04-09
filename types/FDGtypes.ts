// FDGtypes.ts
// types for the force directed graph.
//
// extending the types with the D3 types for FDG's.
//

import type { SimulationNodeDatum } from "d3-force";
import type { SimulationLinkDatum } from "d3-force";

export type GraphNode = SimulationNodeDatum & {
  id: string;                 // Weaviate UUID
  image_id?: string;          // filename
  cluster?: number;           // kmeans cluster
  confidence?: number;        // model confidence
  isCenter?: boolean;         // last chosen node
};

export type GraphLink = SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode;
  target: string | GraphNode;
  distance: number;
  weight?: number;
};