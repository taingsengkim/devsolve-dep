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
 * GET/DELETE /api/showcases/{id}/revision — the author's pending revision of
 * an already-approved showcase.
 *
 * Editing an approved showcase does not change what is live: the upstream
 * stores the edit as a revision awaiting review. `GET` reads that pending copy
 * back, `DELETE` withdraws it and leaves the live version alone. Both are
 * scoped to the caller, so a session is required.
 */

type Context = { params: Promise<{ id: string }> };

const badId = () => badRequest("Showcase id must be a UUID");

export async function GET(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badId();

  try {
    const upstream = await upstreamFetch(`/showcases/${id}/revision`, token);
    return relay(upstream, "Unable to load your pending revision.");
  } catch {
    return unreachable("showcase");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badId();

  try {
    const upstream = await upstreamFetch(`/showcases/${id}/revision`, token, {
      method: "DELETE",
    });
    return relay(upstream, "The revision could not be withdrawn.");
  } catch {
    return unreachable("showcase");
  }
}
