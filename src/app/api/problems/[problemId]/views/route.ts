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
 * POST /api/problems/{problemId}/views — records one problem-detail view.
 *
 * This stays open to signed-out readers, matching the public problem detail
 * endpoint. When a session exists its bearer token is still relayed so the
 * backend can apply any viewer-aware deduplication it supports.
 */

type Context = { params: Promise<{ problemId: string }> };

export async function POST(request: NextRequest, context: Context) {
  const { problemId: raw } = await context.params;
  const id = asUuid(raw);
  if (!id) return badRequest("Problem id must be a UUID");

  const token = await bearerTokenFor(request);

  try {
    const upstream = await upstreamFetch(`/problems/${id}/views`, token, {
      method: "POST",
    });
    return relay(upstream, "The problem view could not be recorded.");
  } catch {
    return unreachable("problem view");
  }
}
