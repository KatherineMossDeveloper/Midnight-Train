// api/weaviate/status/route.ts
// used by the WeaviateStatus component.
//

import { NextResponse } from "next/server";

const WEAVIATE_URL = process.env.WEAVIATE_URL ?? "http://localhost:8080";

// ************************************************
export async function GET() {
  try {
    // --- 1. Fetch Weaviate meta info ---
    const metaRes = await fetch(`${WEAVIATE_URL}/v1/meta`, {
      cache: "no-store",
    });

    if (!metaRes.ok) {
      return NextResponse.json(
        { ok: false, weaviateVersion: null },
        { status: 200 }
      );
    }

    const meta = await metaRes.json();

    // --- 2. Fetch schema (to count classes) ---
    const schemaRes = await fetch(`${WEAVIATE_URL}/v1/schema`, {
      cache: "no-store",
    });
    if (!schemaRes.ok) {
      throw new Error("Failed to fetch Weaviate schema");
    }
    const schema = await schemaRes.json();
    const classNames = schema?.classes?.map((c: any) => c.class) ?? [];

    // --- Return status payload ---
    return NextResponse.json({
      ok: true,
      weaviateVersion: meta?.version ?? "unknown",
      weaviateHostname: meta?.hostname ?? "unknown",
      classCount: classNames.length,
      classNames,
    });
  } catch (error) {
      return NextResponse.json(
        { ok: false, weaviateVersion: null },
        { status: 200 }
      );

    //return NextResponse.json(
    //  {
    //    ok: false,
    //    error: "Weaviate unavailable",
    //  },
    //  { status: 503 }
    //);

  }
}
