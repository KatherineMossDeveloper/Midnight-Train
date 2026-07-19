// FDGtypes.ts
// types for the force directed graph.
//
// These types extend themselves using the "d3-force" types, so that the
// Midnight Train data can be used in the GraphForceDirected component.
// The SimulationNodeDatum fields are added to the GraphNode.
// An example of the resulting structure might be...
// {
//  id: "b203bc46-f147-4521-b340",  <-- the Midnight Train fields
//  image_id: "CEX (1).png",
//  cluster: 0,
//  confidence: 100,
//  isCenter: false,
//
//  index: 0,                       <-- the d3-force SimulationNodeDatum fields
//  x: 563.1,
//  y: 289.5,
//  vx: 0.0004,
//  vy: 0.0002
// }
//
// Before the simulation begins, D3 "normalizes" the two types, GraphNode and
// LinkNode. It replaces each link's source and target ID strings with
// references to the node objects.  That is why the source and target
// fields in the GraphLink are "string | GraphNode"; i.e., either a string
// or a GraphNode object.  After that, during the runtime of the graph,
// the physics engine never has to search for matching IDs again.  For those
// of you who are fans of databases, the node and link arrays resemble two
// database tables in a one-to-many relationship. Initially, each link stores
// source and target IDs as if they were foreign keys.

import type { SimulationNodeDatum } from "d3-force";
import type { SimulationLinkDatum } from "d3-force";

export type GraphNode = SimulationNodeDatum & {
  id: string;                 // Weaviate UUID
  image_id?: string;          // filename
  cluster?: number;           // kmeans cluster
  isCenter?: boolean;         // last chosen node
};

export type GraphLink = SimulationLinkDatum<GraphNode> & {
  source: string | GraphNode;
  target: string | GraphNode;
};