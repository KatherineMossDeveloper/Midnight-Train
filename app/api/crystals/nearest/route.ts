// api/crystals/nearest/route.ts
// weaviateQueries uses this code to fetch nearest neighbor vectors.
//
// function getWeaviateClient()
// export async function GET(req: Request)
//

import { NextResponse } from "next/server";
import weaviate from "weaviate-ts-client";

// Adjust these if you already centralize them elsewhere
const WEAVIATE_URL = process.env.WEAVIATE_URL || "http://localhost:8080";
const WEAVIATE_CLASS = process.env.WEAVIATE_CLASS || "CrystalImage";

function getWeaviateClient() {
  return weaviate.client({
    scheme: WEAVIATE_URL.startsWith("https") ? "https" : "http",
    host: WEAVIATE_URL.replace(/^https?:\/\//, ""),
  });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const id = searchParams.get("id");             // Weaviate UUID
    const imageId = searchParams.get("image_id");  // filename
    const k = 4 //Number(searchParams.get("k") ?? "10");

    if ((!id && !imageId) || k <= 0) {
      return NextResponse.json(
        { error: "Provide id or image_id and a positive k" },
        { status: 400 }
      );
    }

    const client = getWeaviateClient();

    // --- Resolve UUID if only image_id is provided ---
    let centerUuid = id ?? "";

    if (!centerUuid && imageId) {
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
        return NextResponse.json(
          { error: `No record found for image_id=${imageId}` },
          { status: 404 }
        );
      }

      centerUuid = hits[0]._additional.id;
    }

    // --- Nearest neighbor query ---
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
       (r: any) => r._additional.id === centerUuid
    );

    const neighbors = rows
      .filter((r: any) => r._additional.id !== centerUuid)
      .slice(0, k)
      .map((r: any) => ({
        id: r._additional.id,
        image_id: r.image_id,
        class_label: r.class_label,
        confidence: r.confidence,
        image_entropy: r.image_entropy,
        kmeans_pca_x: r.kmeans_pca_x,
        kmeans_pca_y: r.kmeans_pca_y,
        kmeans_pca_cluster: r.kmeans_pca_cluster,
        distance: r._additional.distance,
      }));

      return NextResponse.json({
         center: {
         id: centerUuid,
         image_id: centerRow?.image_id ?? imageId,
         kmeans_pca_cluster: centerRow?.kmeans_pca_cluster,
      },
      neighbors,
    });

  } catch (err: any) {
    console.error("Nearest route error:", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
