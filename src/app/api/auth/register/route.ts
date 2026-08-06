import { NextResponse, type NextRequest } from "next/server";
import * as z from "zod";

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
const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL;

/** Mirrors the backend `RegisterRequest` schema exactly. */
const registerRequestSchema = z
  .object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(50, "Username must not exceed 50 characters")
      .regex(
        /^[a-zA-Z0-9._-]+$/,
        "Only letters, numbers, dots, underscores, and hyphens allowed",
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
    email: z
      .email("Please enter a valid email address")
      .max(255, "Email must not exceed 255 characters"),
    firstName: z
      .string()
      .min(1, "First name is required")
      .max(70, "First name must not exceed 70 characters"),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .max(70, "Last name must not exceed 70 characters"),
    phone: z
      .string()
      .max(30, "Phone must not exceed 30 characters")
      .regex(/^\+?[0-9]{8,15}$/, "Phone must be 8-15 digits, optional leading +")
      .optional(),
    accountType: z.enum(["USER", "COMPANY", "ADMIN"]).default("USER"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterRequestBody = z.infer<typeof registerRequestSchema>;

/** Mirrors the backend `RegisterResponse` schema. */
export interface RegisterResponseBody {
  userId: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  accountType: "USER" | "COMPANY" | "ADMIN";
}

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
