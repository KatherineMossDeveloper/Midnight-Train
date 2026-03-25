// app/lib/weaviate.ts
//
// export function weaviateBaseUrl()   weaviate database url
// export function authHeaders()       weaviate database authorization
// export async function withTimeout   a timeout fetching

export function weaviateBaseUrl() {
  const scheme = process.env.WEAVIATE_SCHEME ?? "http";
  const host = process.env.WEAVIATE_HOST ?? "localhost:8080";
  return `${scheme}://${host}`;
}

export function authHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (process.env.WEAVIATE_API_KEY) {
    headers.Authorization = `Bearer ${process.env.WEAVIATE_API_KEY}`;
  }

  return headers;
}

export async function withTimeout<T>(p: Promise<T>, ms = 8000): Promise<T> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const result = await p;
    return result;
  } finally {
    clearTimeout(t);
  }
}
