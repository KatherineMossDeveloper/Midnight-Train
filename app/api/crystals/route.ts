// app/api/crystals/route.ts
// server route handler for pulling data from the database.
//
// "NextRequest" is a Next.js wrapper around the standard Web API "Request" object.
// When this is called in baseUrl.ts http://localhost:3000/api/crystals
// Next.js calls the GET function here.
//
// Constant environmental values are pulled from .env.local file,
// by referencing process.env...
//

import { NextRequest } from "next/server";
import type { CrystalRecord } from "@/types/CrystalRecord";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 10;

    const weaviateUrl = process.env.WEAVIATE_URL;
    const apiKey = process.env.WEAVIATE_API_KEY ?? "";

    if (!weaviateUrl) {
      return new Response(
        JSON.stringify({ error: "WEAVIATE_URL is not configured" }),
        { status: 500 }
      );
    }

    const schemaRes = await fetch(`${weaviateUrl}/v1/schema`, {
      headers: {
         ...(apiKey && { "X-API-Key": apiKey }),
    },
   });
   const schemaJson = await schemaRes.json();
   //console.log("Schema from Weaviate:", JSON.stringify(schemaJson, null, 2));

   const objectsRes = await fetch(`${weaviateUrl}/v1/objects`, {
      headers: {
       ...(apiKey && { "X-API-Key": apiKey }),
    },
    });
   const objectsJson = await objectsRes.json();

   // create the query, pulling all the fields
   const graphqlQuery = {
      query: `
        {
          Get {
            CrystalImage(limit: ${limit}) {
              image_id
              class_label
              confidence
              image_entropy
              image_header
              kmeans_pca_x
              kmeans_pca_y
              kmeans_pca_cluster
              _additional { id }
            }
          }
        }
      `,
   };

   // Post the query
   const res = await fetch(`${weaviateUrl}/v1/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { "X-API-Key": apiKey }),
      },
      body: JSON.stringify(graphqlQuery),
   });
   console.log("Weaviate result:  ", JSON.stringify(res, null, 2));

   // If the data was not returned, complain.
   if (!res.ok) {
      const text = await res.text();
      console.error("Weaviate GraphQL error:", res.status, text);
      return new Response(
        JSON.stringify({ error: "Weaviate GraphQL error", status: res.status }),
        { status: 500 }
      );
   }

   // put the data from the database in an array.
   const json = await res.json();
   const itemsRaw = json?.data?.Get?.CrystalImage ?? [];
   const items: CrystalRecord[] = itemsRaw.map((item: any) => ({
      image_id: item.image_id,
      class_label: item.class_label,
      confidence: item.confidence,
      image_entropy: item.image_entropy,
      image_header: item.image_header,
      id: item._additional.id,
      kmeans_pca_x: item.kmeans_pca_x ?? null,
      kmeans_pca_y: item.kmeans_pca_y ?? null,
      kmeans_pca_cluster: item.kmeans_pca_cluster ?? null,
   }));

   console.log(`✅ /api/crystals: returned ${items.length} items`);
   if (items.length > 0) { console.log("--->Sample item:", items[0]); }

   // sort the data by the image file name, image_id.
   items.sort((a, b) =>
       a.image_id.localeCompare(b.image_id, undefined, { numeric: true })
   );

   // return the sorted array of data.
   return new Response(JSON.stringify({ items }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
   });

  } catch (err: any) {
    console.error("Error in /api/crystals:", err);
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      { status: 500 }
    );
  }
}
