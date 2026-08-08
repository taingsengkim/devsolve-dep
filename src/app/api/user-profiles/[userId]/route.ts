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
 * GET /api/user-profiles/{userId} — one public profile.
 *
 * A solution carries only its author's id, so anything that lists answers
 * resolves the names through here.
 */

type Context = { params: Promise<{ userId: string }> };

export async function GET(request: NextRequest, context: Context) {
  const { userId: raw } = await context.params;
  const userId = asUuid(raw);
  if (!userId) return badRequest("User id must be a UUID");

  const token = await bearerTokenFor(request);

  try {
    const upstream = await upstreamFetch(`/user-profiles/${userId}`, token);
    return relay(upstream, "Unable to load that profile.");
  } catch {
    return unreachable("profile");
  }
}
