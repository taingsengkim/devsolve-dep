import { type NextRequest } from "next/server";
import {
  asUuid,
  badRequest,
  bearerTokenFor,
  forwardQuery,
  relay,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

/**
 * GET /api/problems/{problemId}/solutions — the answers on one problem.
 *
 * Public: the profile's community tab reads `totalElements` off this to show
 * how many answers a problem drew, and a visitor reading a problem sees the
 * same list.
 */

type Context = { params: Promise<{ problemId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { problemId: raw } = await context.params;
  const problemId = asUuid(raw);
  if (!problemId) return badRequest("Problem id must be a UUID");

  const token = await bearerTokenFor(request);
  const query = forwardQuery(request.nextUrl.searchParams, [
    "pageNumber",
    "pageSize",
  ]);

  try {
    const upstream = await upstreamFetch(
      `/problems/${problemId}/solutions${query}`,
      token,
    );
    return relay(upstream, "Unable to load the answers.");
  } catch {
    return unreachable("problem");
  }
}
