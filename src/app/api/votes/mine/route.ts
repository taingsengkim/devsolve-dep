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
 * GET /api/votes/mine — proxy for backend's /api/v1/votes/mine.
 * Returns paginated user votes.
 */
export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { searchParams } = new URL(request.url);
  const query = forwardQuery(searchParams, ["type", "pageNumber", "pageSize"]);

  try {
    const upstream = await upstreamFetch(`/votes/mine${query}`, token);
    return relay(upstream, "Unable to fetch votes.");
  } catch {
    return unreachable("vote");
  }
}
