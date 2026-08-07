import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const PROVIDER_ID = "keycloak";

const moderationActionSchema = z.object({
  action: z.enum(["WARN", "SUSPEND", "REMOVE", "BAN"]),
  reason: z.string().min(1, "Reason is required").max(2000),
  expiresAt: z.string().optional(),
});

async function bearerTokenFor(request: NextRequest): Promise<string | null> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return null;

  try {
    const { accessToken } = await auth.api.getAccessToken({
      body: { providerId: PROVIDER_ID },
      headers: request.headers,
    });
    return accessToken ?? null;
  } catch {
    return null;
  }
}

const unauthorized = () =>
  NextResponse.json({ message: "Not authenticated" }, { status: 401 });

const unreachable = () =>
  NextResponse.json(
    { message: "Unable to reach the moderation service. Please try again." },
    { status: 502 }
  );

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ message: "Target ID is required" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = moderationActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { message: "Validation error", errors: parsed.error.format() },
      { status: 400 }
    );
  }

  const targetUrl = `${BACKEND_API_URL}/admin/${id}/moderation-actions`;

  const payload: { action: string; reason: string; expiresAt?: string } = {
    action: parsed.data.action,
    reason: parsed.data.reason,
  };
  if (parsed.data.expiresAt) {
    payload.expiresAt = parsed.data.expiresAt;
  }

  try {
    const upstream = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const raw = await upstream.text();
    let resBody: unknown = null;
    if (raw) {
      try {
        resBody = JSON.parse(raw);
      } catch {
        resBody = { message: raw };
      }
    }

    if (!upstream.ok) {
      const message =
        (resBody as { message?: string } | null)?.message ??
        "Failed to apply moderation action.";
      return NextResponse.json(
        { message, details: resBody },
        { status: upstream.status }
      );
    }

    return NextResponse.json(resBody, { status: 201 });
  } catch {
    return unreachable();
  }
}

