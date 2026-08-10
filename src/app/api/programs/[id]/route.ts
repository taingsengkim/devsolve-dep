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

const unreachable = () =>
  NextResponse.json(
    { message: "Unable to reach the program service. Please try again." },
    { status: 502 }
  );

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await bearerTokenFor(request);
  const { id } = await params;

  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const primaryUrl = isUuid
    ? `${BACKEND_API_URL}/programs/${id}`
    : `${BACKEND_API_URL}/programs/handle/${id}`;

  const secondaryUrl = isUuid
    ? `${BACKEND_API_URL}/programs/handle/${id}`
    : `${BACKEND_API_URL}/programs/${id}`;

  try {
    let upstream = await fetch(primaryUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (upstream.status === 404) {
      const fallbackUpstream = await fetch(secondaryUrl, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      if (fallbackUpstream.ok) {
        upstream = fallbackUpstream;
      }
    }

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
        "Failed to fetch program details.";
      return NextResponse.json(
        { message, details: body },
        { status: upstream.status }
      );
    }

    return NextResponse.json(body, { status: upstream.status });
  } catch {
    return unreachable();
  }
}
