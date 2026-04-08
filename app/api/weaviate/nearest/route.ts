// api/weaviate/nearest/route.ts
// calls getNeighbors, to get nearest neighbor data from
// either the database or the file system.
//

import { NextResponse } from "next/server";
import { getNeighbors } from "@/lib/data/crystalDataSource";

// ************************************************
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageId = searchParams.get("image_id");
  const kParam = searchParams.get("k");

  if (!imageId) {
    return NextResponse.json(
      { error: "Missing image_id" },
      { status: 400 }
    );
  }

  const kRaw = Number(kParam ?? 5);
  const k = Number.isFinite(kRaw) && kRaw > 0 ? kRaw : 5;

  try {
    const result = await getNeighbors(imageId, k);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Neighbor route failed.", error);
    return NextResponse.json(
      { error: "Failed to retrieve neighbors." },
      { status: 500 }
    );
  }
}
