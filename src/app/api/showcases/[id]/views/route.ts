import { type NextRequest } from "next/server";
import {
  asUuid,
  badRequest,
  bearerTokenFor,
  relay,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

/**
 * POST /api/showcases/{id}/views — records a read and answers with the new
 * count. Deliberately open to signed-out callers: most showcase traffic is
 * anonymous, and counting only members would make the number meaningless.
 */

type Context = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { id: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badRequest("Showcase id must be a UUID");

  const token = await bearerTokenFor(request);

  try {
    const upstream = await upstreamFetch(`/showcases/${id}/views`, token, {
      method: "POST",
    });
    return relay(upstream, "The view could not be recorded.");
  } catch {
    return unreachable("showcase");
  }
}
