import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

/**
 * Shared pieces for the Next route handlers under `src/app/api/*` that relay
 * to the backend. Each handler owns its validation and its URL; everything
 * below is the plumbing they all repeat otherwise.
 */

/** Backend base URL — already carries the `/api/v1` prefix. */
export const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

const PROVIDER_ID = "keycloak";

/**
 * The caller's Keycloak access token, or null when signed out. better-auth
 * holds it server-side against the session cookie and refreshes it when it is
 * close to expiring, so the browser never handles the JWT.
 */
export async function bearerTokenFor(
  request: NextRequest,
): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;

  try {
    const { accessToken } = await auth.api.getAccessToken({
      body: { providerId: PROVIDER_ID },
      headers: request.headers,
    });
    return accessToken ?? null;
  } catch {
    // Refresh token rejected, or the account is no longer linked.
    return null;
  }
}

export const unauthorized = () =>
  NextResponse.json({ message: "Not authenticated" }, { status: 401 });

export const unreachable = (what: string) =>
  NextResponse.json(
    { message: `Unable to reach the ${what} service. Please try again.` },
    { status: 502 },
  );

export const badJson = () =>
  NextResponse.json(
    { message: "Request body must be valid JSON" },
    { status: 400 },
  );

/**
 * Passes an upstream response through with its status intact.
 *
 * The backend advertises a wildcard content type on most operations, so a
 * body is not guaranteed to be JSON — and `DELETE` returns none at all. Both
 * are handled here rather than in every caller.
 */
export async function relay(upstream: Response, fallbackMessage: string) {
  const raw = await upstream.text();

  let body: unknown = null;
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = { message: raw };
    }
  }

  if (!upstream.ok) {
    const message =
      (body as { message?: string } | null)?.message ?? fallbackMessage;
    return NextResponse.json(
      { message, details: body },
      { status: upstream.status },
    );
  }

  if (body === null) return new NextResponse(null, { status: 204 });

  return NextResponse.json(body, { status: upstream.status });
}

/** Server-to-server request carrying the caller's bearer token. */
export function upstreamFetch(
  path: string,
  token: string,
  init: RequestInit = {},
) {
  return fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
}
