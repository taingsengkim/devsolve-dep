import { type NextRequest } from "next/server";

import {
  asUuid,
  badRequest,
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const id = asUuid((await params).id);
  if (!id) return badRequest("Organization id must be a valid UUID");

  try {
    const upstream = await upstreamFetch(`/admin/organizations/${id}`, token);
    return relay(upstream, "Failed to fetch organization details.");
  } catch {
    return unreachable("organization");
  }
}
