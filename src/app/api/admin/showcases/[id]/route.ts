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
 * GET /api/admin/showcases/{id} — the full submission under review, steps
 * included. For a revision this is the pending copy rather than what is
 * currently live on the index.
 */

type Context = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badRequest("Showcase id must be a UUID");

  try {
    const upstream = await upstreamFetch(`/admin/showcases/${id}`, token);
    return relay(upstream, "Unable to load that submission.");
  } catch {
    return unreachable("showcase");
  }
}
