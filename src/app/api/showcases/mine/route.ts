import { type NextRequest } from "next/server";
import {
  bearerTokenFor,
  forwardQuery,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

/**
 * GET /api/showcases/mine — the caller's own showcases, including the ones
 * still pending review and the ones carrying an unpublished revision.
 *
 * A static segment beats the sibling `[id]` route in the App Router, so "mine"
 * is never read as a showcase id.
 */

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const query = forwardQuery(request.nextUrl.searchParams, [
    "pageNumber",
    "pageSize",
  ]);

  try {
    const upstream = await upstreamFetch(`/showcases/mine${query}`, token);
    return relay(upstream, "Unable to load your showcases.");
  } catch {
    return unreachable("showcase");
  }
}
