// FDGtypes.ts
// types for the force directed graph.
//

export type GraphNode = {
  id: string;                 // Weaviate UUID
  image_id?: string;          // filename
  cluster?: number;           // kmeans cluster
  confidence?: number;        // the % confidence the model had when labeling
  isCenter?: boolean;         // the node last chosen
};

export type GraphLink = {
  source: string;             // UUID
  target: string;             // UUID
  distance: number;           // raw vector distance
  weight: number;             // derived (for D3 force strength)
};
