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

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const targetUrl = `${BACKEND_API_URL}/admin/flags${
    queryString ? `?${queryString}` : ""
  }`;

  try {
    const upstream = await fetch(targetUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (upstream.status === 404 || upstream.status === 403) {
      return NextResponse.json(
        { items: [], content: [], totalElements: 0, totalPages: 0 },
        { status: 200 }
      );
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
      return NextResponse.json(
        { items: [], content: [], totalElements: 0, totalPages: 0 },
        { status: 200 }
      );
    }

    return NextResponse.json(body, { status: upstream.status });
  } catch {
    return NextResponse.json(
      { items: [], content: [], totalElements: 0, totalPages: 0 },
      { status: 200 }
    );
  }
}
