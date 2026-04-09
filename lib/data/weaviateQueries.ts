// weaviateQueries.ts
// pull all data or near neighbor image data from the db.
//
// function getWeaviateClient
// export async function getImageObjectsFromWeaviate
// export async function getNeighborsFromWeaviate
//

import "server-only";
import weaviate from "weaviate-ts-client";
import type { ImageDatabaseObject } from "@/lib/data/types";

const WEAVIATE_URL = process.env.WEAVIATE_URL || "http://localhost:8080";
const WEAVIATE_CLASS = process.env.WEAVIATE_CLASS || "CrystalImage";

// ************************************************
function getWeaviateClient() {
  return weaviate.client({
    scheme: WEAVIATE_URL.startsWith("https") ? "https" : "http",
    host: WEAVIATE_URL.replace(/^https?:\/\//, ""),
  });
}

// ************************************************
export async function getImageObjectsFromWeaviate(
  limit = 100
): Promise<{ items: ImageDatabaseObject[]; weaviateVersion?: string }> {
  const client = getWeaviateClient();

  const result = await client.graphql
    .get()
    .withClassName(WEAVIATE_CLASS)
    .withFields(`
      image_id
      class_label
      confidence
      image_entropy
      kmeans_pca_x
      kmeans_pca_y
      kmeans_pca_cluster
      _additional { id }
    `)
    .withSort([{"path": ["image_id"], "order": "asc"}])
    .withLimit(limit)
    .do();

  const rows = result?.data?.Get?.[WEAVIATE_CLASS] ?? [];

  const items: ImageDatabaseObject[] = rows.map((r: any) => ({
    id: r._additional?.id,
    image_id: r.image_id,
    class_label: r.class_label,
    confidence: r.confidence,
    image_entropy: r.image_entropy,
    kmeans_pca_x: r.kmeans_pca_x,
    kmeans_pca_y: r.kmeans_pca_y,
    kmeans_pca_cluster: r.kmeans_pca_cluster,
  }));

  let weaviateVersion: string | undefined;

  try {
    const meta = await client.misc.metaGetter().do();
    weaviateVersion = meta?.version;
  } catch {
    // leave undefined
  }

  return { items, weaviateVersion };
}

export interface NeighborCenter {
  id: string;
  image_id: string;
  kmeans_pca_cluster?: number;
}

export interface NeighborRecord {
  id: string;
  image_id: string;
  kmeans_pca_cluster?: number;
  distance: number;
  class_label?: string;
  confidence?: number;
  image_entropy?: number;
  kmeans_pca_x?: number;
  kmeans_pca_y?: number;
}
export interface GetNeighborsResult {
  center: NeighborCenter;
  neighbors: NeighborRecord[];
  source: "weaviate";
}


// ************************************************
export async function getNeighborsFromWeaviate( id: string, imageId: string,  k = 5
): Promise<GetNeighborsResult> {
  if (!imageId) {
    throw new Error("getNeighborsFromWeaviate requires imageId");
  }

  if (k <= 0) {
    throw new Error("getNeighborsFromWeaviate requires positive k");
  }

  const client = getWeaviateClient();

  // Resolve UUID from image_id
  const lookup = await client.graphql
    .get()
    .withClassName(WEAVIATE_CLASS)
    .withFields("_additional { id } image_id")
    .withWhere({
      path: ["image_id"],
      operator: "Equal",
      valueText: imageId,
    })
    .withLimit(2)
    .do();

  const hits = lookup?.data?.Get?.[WEAVIATE_CLASS] ?? [];

  if (!hits.length) {
    throw new Error(`No record found for image_id=${imageId}`);
  }

  const centerUuid = hits[0]._additional.id;

  // Nearest neighbor query
  const result = await client.graphql
    .get()
    .withClassName(WEAVIATE_CLASS)
    .withFields(`
      image_id
      class_label
      confidence
      image_entropy
      kmeans_pca_x
      kmeans_pca_y
      kmeans_pca_cluster
      _additional { id distance }
    `)
    .withNearObject({ id: centerUuid })
    .withLimit(k + 1) // includes self
    .do();

  const rows = result?.data?.Get?.[WEAVIATE_CLASS] ?? [];

  const centerRow = rows.find(
    (r: any) => r._additional?.id === centerUuid
  );

  const neighbors: NeighborRecord[] = rows
    .filter((r: any) => r._additional?.id !== centerUuid)
    .slice(0, k)
    .map((r: any) => ({
      id: r._additional?.id,
      image_id: r.image_id,
      class_label: r.class_label,
      confidence: r.confidence,
      image_entropy: r.image_entropy,
      kmeans_pca_x: r.kmeans_pca_x,
      kmeans_pca_y: r.kmeans_pca_y,
      kmeans_pca_cluster: r.kmeans_pca_cluster,
      distance: r._additional?.distance,
    }));

  return {
    center: {
      id: centerUuid,
      image_id: centerRow?.image_id ?? imageId,
      kmeans_pca_cluster: centerRow?.kmeans_pca_cluster,
    },
    neighbors,
    source: "weaviate",
  };
}