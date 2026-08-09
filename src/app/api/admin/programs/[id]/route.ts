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
    { message: "Unable to reach the program service. Please try again." },
    { status: 502 }
  );

/**
 * GET /api/admin/programs/[id]
 *
 * Admin-only endpoint to fetch a single program by ID regardless of its
 * submission state (PENDING_REVIEW, APPROVED, REJECTED) or visibility
 * (PUBLIC, PRIVATE). 
 *
 * The backend does not expose GET /admin/programs/{id}, so this route:
 * 1. Tries GET /programs/{id} first (works for APPROVED/published programs)
 * 2. If 404, falls back to fetching from the admin list endpoint and 
 *    filtering by ID — the list endpoint returns all programs regardless of state.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id } = await params;

  const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    // Step 1: Try the public programs endpoint first (works for approved/published)
    const publicUrl = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
      ? `${BACKEND_API_URL}/programs/${id}`
      : `${BACKEND_API_URL}/programs/handle/${id}`;

    const publicUpstream = await fetch(publicUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (publicUpstream.ok) {
      const body = await publicUpstream.json().catch(() => null);
      return NextResponse.json(body, { status: 200 });
    }

    // Step 2: Fall back to admin list endpoint — returns ALL programs regardless of state
    // Backend enforces pageSize <= 100.
    const listUrl = `${BACKEND_API_URL}/admin/programs?size=100`;
    const listUpstream = await fetch(listUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!listUpstream.ok) {
      const errBody = await listUpstream.json().catch(() => null);
      const message =
        (errBody as { message?: string } | null)?.message ??
        "Failed to fetch program details.";
      return NextResponse.json(
        { message, details: errBody },
        { status: listUpstream.status }
      );
    }

    const listData = await listUpstream.json().catch(() => ({ content: [] }));
    const programs: any[] = listData?.content ?? [];

    // Find by UUID id or handle
    const program = programs.find(
      (p: any) => p.id === id || p.handle === id
    );

    if (!program) {
      return NextResponse.json(
        { message: "Program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(program, { status: 200 });
  } catch {
    return unreachable();
  }
}
