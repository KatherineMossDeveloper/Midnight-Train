// crystalDataSource.ts
//

import "server-only";

import type { ImageObjectsResult, GetNeighborsResult } from "@/lib/types";
import { getImageObjectsFromWeaviate, getNeighborsFromWeaviate } from "@/lib/data/weaviateQueries";
import { getImageObjectsFromJson, getNeighborsFromJson } from "@/lib/data/jsonQueries";


// ************************************************
async function checkWeaviateAvailable(timeoutMs = 3000): Promise<boolean> {
  const url = `${process.env.WEAVIATE_URL || "http://localhost:8080"}/v1/.well-known/ready`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ************************************************
export async function getImageObjects(limit = 100): Promise<ImageObjectsResult> {
  try {
    const dbOk = await checkWeaviateAvailable(3000);

    if (dbOk) {
      const result = await getImageObjectsFromWeaviate(limit);

      return {
        items: result.items,
        dbStatus: {
          ok: true,
          source: "weaviate",
          message: `Weaviate database connected${result.weaviateVersion ? ` (ver. ${result.weaviateVersion})` : ""}`,
          weaviateVersion: result.weaviateVersion,
        },
      };
    }

    console.warn("---> crystalDataSource: Weaviate not available, using JSON");
  } catch (error) {
    console.error("---> crystalDataSource: Weaviate fetch failed, using JSON", error);
  }

  const jsonItems = await getImageObjectsFromJson(limit);

  return {
    items: jsonItems,
    dbStatus: {
      ok: false,
      source: "json",
      message: "From crystalDataSource.getImageObjects: Weaviate unavailable. Using bundled JSON snapshot.",
    },
  };
}

export async function getNeighbors(
  imageId: string,
  k = 5
): Promise<GetNeighborsResult> {
  try {
    const dbOk = await checkWeaviateAvailable(3000);

    if (dbOk) {
      return await getNeighborsFromWeaviate(imageId, k);
    }

    console.warn(`Weaviate unavailable for ${imageId}, falling back to JSON.`);
  } catch (error) {
    console.error(
      `Weaviate neighbor query failed for ${imageId}, falling back to JSON.`,
      error
    );
  }

  return await getNeighborsFromJson(imageId, k);
}

