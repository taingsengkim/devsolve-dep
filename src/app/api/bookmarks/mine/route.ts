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
 * GET /api/bookmarks/mine — proxy for backend's /api/v1/bookmarks/mine.
 * Returns paginated user bookmarks.
 */
export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { searchParams } = new URL(request.url);
  const query = forwardQuery(searchParams, ["type", "pageNumber", "pageSize"]);

  try {
    const upstream = await upstreamFetch(`/bookmarks/mine${query}`, token);
    return relay(upstream, "Unable to fetch bookmarks.");
  } catch {
    return unreachable("bookmark");
  }
}
