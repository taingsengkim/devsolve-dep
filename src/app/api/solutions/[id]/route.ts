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
 * DELETE /api/solutions/{id} — the author withdrawing their own answer.
 *
 * Who may delete which solution is the backend's call; the token is relayed
 * and its 403 comes back unchanged.
 */

type Context = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badRequest("Solution id must be a UUID");

  try {
    const upstream = await upstreamFetch(`/solutions/${id}`, token, {
      method: "DELETE",
    });
    return relay(upstream, "The solution could not be deleted.");
  } catch {
    return unreachable("solution");
  }
}
