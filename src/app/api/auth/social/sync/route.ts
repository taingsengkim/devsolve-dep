import { type NextRequest } from "next/server";
import {
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

/**
 * POST /api/auth/social/sync — proxy for the backend's POST /auth/social/sync.
 *
 * Social sign-ups never pass through `/auth/register`: the OIDC redirect is the
 * whole flow, so nothing ever tells the backend to create their local
 * `user_profiles` row. This is the call that does it. It takes no body — the
 * backend reads the identity from the bearer token — and answers with
 * `{ created, profile }`, where `created` distinguishes a first sign-up from a
 * returning user.
 *
 * Sits alongside better-auth's `[...all]` catch-all under /api/auth; a static
 * segment wins over a catch-all in the App Router, and better-auth owns no
 * `social/sync` path of its own.
 */

export async function POST(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  try {
    const upstream = await upstreamFetch("/auth/social/sync", token, {
      method: "POST",
    });
    return relay(upstream, "Unable to finish setting up your account.");
  } catch {
    return unreachable("account setup");
  }
}
