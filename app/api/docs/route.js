import { getApiDocs } from "@/lib/swagger"; // adjust path if needed

export async function GET() {
  const spec = getApiDocs();
  return Response.json(spec);
}
