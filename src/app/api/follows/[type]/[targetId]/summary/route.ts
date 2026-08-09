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

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ type: string; targetId: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { type, targetId } = await context.params;

  try {
    const upstream = await fetch(`${BACKEND_API_URL}/follows/${type}/${targetId}/summary`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { following: false, followerCount: 0 },
        { status: 200 }
      );
    }

    const body = await upstream.json();
    return NextResponse.json(body, { status: 200 });
  } catch {
    return NextResponse.json(
      { following: false, followerCount: 0 },
      { status: 200 }
    );
  }
}
