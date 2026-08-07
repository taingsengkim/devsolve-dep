import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth/auth";

const BACKEND_API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;
const PROVIDER_ID = "keycloak";

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
    { message: "Unable to reach the follow service. Please try again." },
    { status: 502 }
  );

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ type: string; targetId: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { type, targetId } = await context.params;

  try {
    const upstream = await fetch(`${BACKEND_API_URL}/follows/${type}/${targetId}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

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
        (body as { message?: string } | null)?.message ?? "Failed to follow target.";
      return NextResponse.json({ message, details: body }, { status: upstream.status });
    }

    return NextResponse.json(body ?? { success: true }, { status: upstream.status });
  } catch {
    return unreachable();
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ type: string; targetId: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { type, targetId } = await context.params;

  try {
    const upstream = await fetch(`${BACKEND_API_URL}/follows/${type}/${targetId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      const raw = await upstream.text();
      let body: unknown = null;
      if (raw) {
        try {
          body = JSON.parse(raw);
        } catch {
          body = { message: raw };
        }
      }
      const message =
        (body as { message?: string } | null)?.message ?? "Failed to unfollow target.";
      return NextResponse.json({ message, details: body }, { status: upstream.status });
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return unreachable();
  }
}
