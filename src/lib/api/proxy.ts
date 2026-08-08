import { NextResponse, type NextRequest } from "next/server";
import * as z from "zod";
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

export const badRequest = (message: string) =>
  NextResponse.json({ message }, { status: 400 });

/** The shape every handler returns when a body fails its schema. */
export const validationFailed = (error: z.ZodError) => {
  const { formErrors, fieldErrors } = z.flattenError(error);
  return NextResponse.json(
    { message: "Validation failed", formErrors, fieldErrors },
    { status: 400 },
  );
};

const uuidSchema = z.uuid();

/**
 * Path ids are UUIDs upstream, so a malformed one is rejected here rather than
 * spent on a round trip. Returns the id when it parses, null when it does not.
 */
export function asUuid(value: string | undefined): string | null {
  return value && uuidSchema.safeParse(value).success ? value : null;
}

/**
 * Forwards only the query parameters a route actually supports, dropping
 * anything else so a caller cannot smuggle extra params upstream.
 */
export function forwardQuery(
  params: URLSearchParams,
  allowed: readonly string[],
): string {
  const forwarded = new URLSearchParams();
  for (const key of allowed) {
    const value = params.get(key);
    if (value !== null && value !== "") forwarded.set(key, value);
  }
  const query = forwarded.toString();
  return query ? `?${query}` : "";
}

/**
 * Reads the single `file` part out of a multipart request and validates it.
 *
 * The part is re-encoded rather than streamed through — streaming would need
 * `duplex: "half"` and would forward the bytes unchecked. Showcase images are
 * capped at 5MB, so buffering one is cheap.
 */
export async function fileFrom(
  request: NextRequest,
  validate: (file: File) => string | null,
): Promise<{ body: FormData } | { error: NextResponse }> {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { error: badRequest("Request must be multipart/form-data") };
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return { error: badRequest("A `file` part is required") };
  }

  const reason = validate(file);
  if (reason) return { error: badRequest(reason) };

  const body = new FormData();
  body.append("file", file, file.name);
  return { body };
}

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

/**
 * Server-to-server request carrying the caller's bearer token.
 *
 * The token is nullable for the operations the backend serves to anyone —
 * browsing showcases, reading a public program. Signed-in callers still send
 * theirs, since the upstream personalises those responses when it can.
 */
export function upstreamFetch(
  path: string,
  token: string | null,
  init: RequestInit = {},
) {
  return fetch(`${BACKEND_API_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      /* Only a serialized body is JSON. A FormData body has to set its own
         Content-Type so the multipart boundary is generated — naming the
         header here would strip it and the upstream parse would fail. */
      ...(typeof init.body === "string"
        ? { "Content-Type": "application/json" }
        : {}),
      ...init.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });
}
