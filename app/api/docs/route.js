import { getApiDocs } from "@/lib/swagger"; // adjust path if needed

// Ensure the OpenAPI spec is generated at build time where source files are available.
// This avoids runtime filesystem scanning in serverless environments (e.g., Vercel),
// which would otherwise produce an empty paths list.
export const dynamic = "force-static";
export const runtime = "nodejs";

export async function GET() {
  const spec = getApiDocs();
  return Response.json(spec);
}
