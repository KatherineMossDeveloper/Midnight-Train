// weaviateQueries.ts
// code that fetches data from the database
//
// export async function getImageObjects          pulls all the image records from the db.
// export async function getImageVectorNeighbors  pulls the top X number of nearest neighbors.

import { getBaseUrl } from "@/lib/baseUrl";

export async function getImageObjects(limit = 10) {
  // crystals = app/api/crystals/route.ts
  const res = await fetch(`${getBaseUrl()}/api/crystals?limit=${limit}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }
  console.log("Inside crystals.ts, getImageObjects; base URL:  ", getBaseUrl());

  return res.json();
}

export async function getImageVectorNeighbors({ imageId, k = 5 }: {
    imageId?: string;   // filename (image_id)
    k?: number;         // limit
}) {

  if (!imageId) {
      throw new Error("getImageVectorNeighbors requires imageId");
  }

  const params = new URLSearchParams();
  if (imageId) params.set("image_id", imageId);
  params.set("k", String(k));

  const res = await fetch(
    `${getBaseUrl()}/api/crystals/nearest?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
     const text = await res.text();
     console.error("API error status:", res.status);
     console.error("API error body:", text);
     throw new Error(`API error ${res.status}`);
  }
  console.log("Inside crystal.tx, getImageVectorNeighbors; base URL:  ", getBaseUrl());

  return res.json();
}
