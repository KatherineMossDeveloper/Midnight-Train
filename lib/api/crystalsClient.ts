// crystalsClient.ts
// calls the api/weaviate/nearest route here because
// we might need to get nearest neighbor image data
// from the JSON file on disk.
//
// export async function getNeighborsClient
//

import type { ImageObjectsResult, GetNeighborsResult } from "@/lib/types";

// ************************************************
export async function getNeighborsClient(params: {
  imageId: string;
  k?: number;
}): Promise<GetNeighborsResult> {
  const { imageId, k = 5 } = params;

  const searchParams = new URLSearchParams();
  searchParams.set("image_id", imageId);
  searchParams.set("k", String(k));

  const url = `/api/weaviate/nearest?${searchParams.toString()}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Neighbor fetch failed: ${res.status} ${text}`);
  }

  return res.json();
}
