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
import { PROBLEM_STATUSES } from "@/lib/validations/problem";

/**
 * GET /api/admin/problems — the problem moderation queue.
 *
 * A submitted problem sits at `PENDING_APPROVAL` and is not on the public
 * index until a moderator publishes it, so this list is the gate between an
 * author pressing Submit and anyone reading the result.
 *
 * Role enforcement is the backend's: the token is relayed and a non-admin gets
 * its 403 back unchanged.
 */

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const status = request.nextUrl.searchParams.get("status");
  if (
    status &&
    !PROBLEM_STATUSES.includes(status as (typeof PROBLEM_STATUSES)[number])
  ) {
    return badRequest(`status must be one of ${PROBLEM_STATUSES.join(", ")}`);
  }

  /* Paging here is Spring's own `page`/`size`/`sort`, not the `pageNumber`
     pair the showcase queue takes — the two upstream controllers differ. */
  const query = forwardQuery(request.nextUrl.searchParams, [
    "status",
    "page",
    "size",
    "sort",
  ]);

  try {
    const upstream = await upstreamFetch(`/admin/problems${query}`, token);
    return relay(upstream, "Unable to load the problem review queue.");
  } catch {
    return unreachable("problem");
  }
}
