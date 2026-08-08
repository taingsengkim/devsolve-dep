import { type NextRequest } from "next/server";
import {
  badRequest,
  bearerTokenFor,
  forwardQuery,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";
import { SHOWCASE_REVIEW_STATUSES } from "@/lib/validations/showcase";

/**
 * GET /api/admin/showcases — the moderation queue. One row per submission
 * awaiting a decision, which is either an initial publish or a revision of an
 * already-approved showcase (`submissionType` says which).
 *
 * Role enforcement is the backend's: the token is relayed and a non-admin gets
 * its 403 back unchanged.
 */

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const status = request.nextUrl.searchParams.get("reviewStatus");
  if (
    status &&
    !SHOWCASE_REVIEW_STATUSES.includes(
      status as (typeof SHOWCASE_REVIEW_STATUSES)[number],
    )
  ) {
    return badRequest(
      `reviewStatus must be one of ${SHOWCASE_REVIEW_STATUSES.join(", ")}`,
    );
  }

  const query = forwardQuery(request.nextUrl.searchParams, [
    "reviewStatus",
    "pageNumber",
    "pageSize",
  ]);

  try {
    const upstream = await upstreamFetch(`/admin/showcases${query}`, token);
    return relay(upstream, "Unable to load the showcase review queue.");
  } catch {
    return unreachable("showcase");
  }
}
