// app/lib/baseUrl.ts
// logic to find where Midnight Train is.
//
// Constant environmental values are pulled from .env.local file,
// by referencing process.env...
//

export function getBaseUrl() {
  // If we're in the browser, a relative URL is fine
  // e.g., http://localhost:3000/api/crystals
  if (typeof window !== "undefined") {
    return "";
  }

  // If deploying with a host later, change this in .env.local file.
  // After editing, restart the server.
  if (process.env.APP_URL) {
    return process.env.APP_URL;
  }

  // If deployed on Vercel, they'll give us the URL
  // e.g., https://midnight-train.vercel.app/api/crystals
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fallback for local dev
  // e.g., http://localhost:3000/api/crystals
  return "http://localhost:3000";
}
