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
 * The admin controller lists problems for moderation but serves no detail of
 * its own, so a reviewer opening a submission reads it through here. Whether a
 * problem still awaiting approval is visible is the backend's call: the token
 * is relayed and its 403 or 404 comes back unchanged.
 */

/* The segment is `problemId` rather than `id` because the sibling
   `[problemId]/solutions` route already names it that, and Next requires one
   slug name per dynamic path position. */
type Context = { params: Promise<{ problemId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

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
