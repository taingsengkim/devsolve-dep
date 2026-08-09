import { type NextRequest } from "next/server";
import {
  bearerTokenFor,
  forwardQuery,
  relay,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

/**
 * GET /api/user-profiles — paginated public user profile search.
 *
 * Query parameters:
 *  - query: string search term for name/bio
 *  - pageNumber: integer (0-indexed)
 *  - pageSize: integer (default 20, max 100)
 */
export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  const query = forwardQuery(request.nextUrl.searchParams, [
    "query",
    "pageNumber",
    "pageSize",
  ]);

  try {
    const upstream = await upstreamFetch(`/user-profiles${query}`, token);
    return relay(upstream, "Unable to search public user profiles.");
  } catch {
    return unreachable("user profiles");
  }
}
