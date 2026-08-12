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

/**
 * POST /api/problems/{id}/submit — the author sending their draft to review.
 *
 * A draft is invisible to everyone but its author, so without this it is a
 * dead end: the create form can leave a problem in `DRAFT`, and nothing else
 * in the app moves it on to `PENDING_APPROVAL`.
 *
 * No body, and nothing to validate — the id in the path is the whole request.
 * Whether this problem is in a state that can be submitted, and whether the
 * caller is its author, are the backend's calls; its 403 and 409 come back
 * unchanged.
 */

/* `problemId` rather than `id`, matching the sibling routes under this
   segment — Next allows one slug name per dynamic path position. */
type Context = { params: Promise<{ problemId: string }> };

export async function POST(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { problemId: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badRequest("Problem id must be a UUID");

  try {
    const upstream = await upstreamFetch(`/problems/${id}/submit`, token, {
      method: "POST",
    });
    return relay(upstream, "The problem could not be submitted for review.");
  } catch {
    return unreachable("problem");
  }
}
