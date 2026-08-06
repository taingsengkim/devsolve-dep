import { NextResponse, type NextRequest } from "next/server";
import * as z from "zod";
import {
  registerRequestSchema,
  type RegisterResponseBody,
} from "@/lib/validations/auth";

/**
 * POST /api/auth/register — proxy for the backend's POST /api/v1/auth/register.
 *
 * Registration runs server-side rather than straight from the browser so the
 * backend origin (and any future service credentials) never reach the client.
 * This sits alongside the better-auth catch-all at `api/auth/[...all]`; a static
 * segment wins over a catch-all in the App Router, and better-auth owns no
 * `register` path of its own, so the two don't collide.
 */

// Backend base URL already carries the `/api/v1` prefix (see .env.example).
const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON" },
      { status: 400 },
    );
  }

  const parsed = registerRequestSchema.safeParse(payload);
  if (!parsed.success) {
    const { formErrors, fieldErrors } = z.flattenError(parsed.error);
    return NextResponse.json(
      { message: "Validation failed", formErrors, fieldErrors },
      { status: 400 },
    );
  }

  let upstream: Response;
  try {
    upstream = await fetch(`${BACKEND_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(parsed.data),
      cache: "no-store",
    });
  } catch {
    // Network-level failure — the backend never saw the request.
    return NextResponse.json(
      { message: "Unable to reach the registration service. Please try again." },
      { status: 502 },
    );
  }

  // The spec advertises `*/*`, so the body may not be JSON on error paths.
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
      (body as { message?: string } | null)?.message ??
      (upstream.status === 409
        ? "That username or email is already registered"
        : "Registration failed. Please try again.");

    return NextResponse.json(
      { message, details: body },
      { status: upstream.status },
    );
  }

  return NextResponse.json(body as RegisterResponseBody, { status: 201 });
}
