// jsonQueries.ts
//
// export async function getImageObjectsFromJson
// export async function getNeighborsFromJson
//

import "server-only";
import fs from "fs/promises";
import path from "path";
import type { GetNeighborsResult, NeighborRecord } from "@/lib/types";

interface SavedGraphNode {
  id: string;
  image_id: string;
  cluster?: number;
}

interface GraphEndpoint {
  id: string;
  image_id: string;
}

interface GraphLink {
  source: GraphEndpoint;
  target: GraphEndpoint;
  distance?: number;
}

// ************************************************
export async function getImageObjectsFromJson( limit = 100
): Promise<ImageDatabaseObject[]> {
  const filePath = path.join(process.cwd(), "lib", "data", "crystals.json");
  const fileText = await fs.readFile(filePath, "utf-8");
  const rows = JSON.parse(fileText) as ImageDatabaseObject[];

  return rows.slice(0, limit);
}

// ************************************************
export async function getNeighborsFromJson( imageId: string, k = 5
): Promise<GetNeighborsResult> {
  try {
    const nodesPath = path.join(process.cwd(), "lib", "data", "fdg_nodes.json");
    const nodesText = await fs.readFile(nodesPath, "utf-8");
    const nodes = JSON.parse(nodesText) as SavedGraphNode[];

    const linksPath = path.join(process.cwd(), "lib", "data", "fdg_links.json");
    const linksText = await fs.readFile(linksPath, "utf-8");
    const links = JSON.parse(linksText) as GraphLink[];

    const centerNode = nodes.find((n) => n.image_id === imageId);

    if (!centerNode) {
      return {
        center: {
          image_id: imageId,
        },
        neighbors: [],
        source: "json",
      };
    }

    const centerId = centerNode.id;

    const connectedLinks = links.filter(
      (l) => l.source.id === centerId || l.target.id === centerId
    );

    const uniqueNeighbors = new Map<string, NeighborRecord>();

    for (const link of connectedLinks) {
      const neighborRef =
        link.source.id === centerId ? link.target : link.source;

      const neighborNode = nodes.find((n) => n.id === neighborRef.id);

      if (!neighborNode) {
        continue;
      }

      if (neighborNode.image_id === imageId) {
        continue;
      }

      const candidate: NeighborRecord = {
        id: neighborNode.id,
        image_id: neighborNode.image_id,
        kmeans_pca_cluster: neighborNode.cluster,
        distance: link.distance,
      };

      const existing = uniqueNeighbors.get(candidate.image_id);

      if (
        !existing ||
        (candidate.distance ?? Infinity) < (existing.distance ?? Infinity)
      ) {
        uniqueNeighbors.set(candidate.image_id, candidate);
      }
    }

    const neighbors = Array.from(uniqueNeighbors.values())
      .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
      .slice(0, k);

    return {
      center: {
        id: centerNode.id,
        image_id: centerNode.image_id,
        kmeans_pca_cluster: centerNode.cluster,
      },
      neighbors,
      source: "json",
    };
  } catch (error) {
    console.error("---> getNeighborsFromJson failed:", error);

    return {
      center: {
        image_id: imageId,
      },
      neighbors: [],
      source: "json",
    };
  }
}