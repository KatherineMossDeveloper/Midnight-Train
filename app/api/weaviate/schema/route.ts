// app/api/weaviate/schema/route.ts (Next.js App Router)
export async function GET() {
  const baseUrl = process.env.WEAVIATE_URL;        // e.g. https://<cluster>.weaviate.network
  const apiKey  = process.env.WEAVIATE_API_KEY;    // if your cluster requires auth

 console.log("Inside route.ts for weaviate. ")

  if (!baseUrl) {
    return new Response(
      JSON.stringify({ error: "WEAVIATE_URL is not set" }),
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, "")}/v1/schema`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
      },
      // If your Weaviate is self-hosted with self-signed certs, you might need:
      next: { revalidate: 0 },
      cache: "no-store",
    });


    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return new Response(
        JSON.stringify({ error: "Weaviate schema fetch failed", status: res.status, body: text }),
        { status: 502 }
      );
    }

    const schema = await res.json();
    return new Response(JSON.stringify(schema), { status: 200 });
    
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Unexpected error in SchemaViewerWeaviate.tsx fetch", message: err?.message || String(err) }),
      { status: 500 }
    );
  }
}
