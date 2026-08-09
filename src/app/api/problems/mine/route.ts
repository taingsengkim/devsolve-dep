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
 * GET /api/problems/mine — the caller's own problems, drafts and
 * pending-approval ones included, which the public portfolio endpoint hides.
 *
 * A static segment beats the sibling `[problemId]` route in the App Router, so
 * "mine" is never read as a problem id.
 */

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const query = forwardQuery(request.nextUrl.searchParams, [
    "page",
    "size",
    "sort",
  ]);

  try {
    const upstream = await upstreamFetch(`/problems/mine${query}`, token);
    return relay(upstream, "Unable to load your problems.");
  } catch {
    return unreachable("problem");
  }
}
