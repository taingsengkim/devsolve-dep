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
  const identifier = raw?.trim();
  if (!identifier) return badRequest("User identifier is required");

  // The backend binds this segment to a UUID, so anything else comes back as a
  // 400 naming an internal path. Rejecting it here keeps that leak out of the
  // client and says what was actually wrong.
  const userId = asUuid(identifier);
  if (!userId) return badRequest("User identifier must be a valid user id");

  const token = await bearerTokenFor(request);

  try {
    const upstream = await upstreamFetch(`/user-profiles/${userId}`, token);
    return relay(upstream, "Unable to load that profile.");
  } catch {
    return unreachable("profile");
  }
}
