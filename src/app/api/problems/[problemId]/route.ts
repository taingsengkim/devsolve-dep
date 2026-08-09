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
 * GET /api/problems/{id} — one problem in full.
 *
 * Two callers share it: the public `/community/{id}` page, and the moderation
 * screen, whose admin controller lists problems but serves no detail of its
 * own. So a token is relayed when there is one but never required — the
 * upstream serves a published problem to anyone, and decides for itself
 * whether a caller may see one still awaiting approval. Its 403 or 404 comes
 * back unchanged.
 */

/* The segment is `problemId` rather than `id` because the sibling
   `[problemId]/solutions` route already names it that, and Next requires one
   slug name per dynamic path position. */
type Context = { params: Promise<{ problemId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);

  const { problemId: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badRequest("Problem id must be a UUID");

  try {
    const upstream = await upstreamFetch(`/problems/${id}`, token);
    return relay(upstream, "Unable to load that problem.");
  } catch {
    return unreachable("problem");
  }
}

/**
 * DELETE /api/problems/{id} — the author withdrawing their own problem.
 *
 * A soft delete upstream: the record survives so anything already pointing at
 * it does not break, and it stops being served. Who may delete which problem
 * is the backend's call — the token is relayed and its 403 comes back
 * unchanged.
 */
export async function DELETE(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { problemId: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badRequest("Problem id must be a UUID");

  try {
    const upstream = await upstreamFetch(`/problems/${id}`, token, {
      method: "DELETE",
    });
    return relay(upstream, "The problem could not be deleted.");
  } catch {
    return unreachable("problem");
  }
}
