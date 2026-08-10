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

const unauthorized = () =>
  NextResponse.json({ message: "Not authenticated" }, { status: 401 });

const isUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value
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

  const idIsUuid = isUuid(id);
  const primaryUrl = idIsUuid
    ? `${BACKEND_API_URL}/programs/${id}`
    : `${BACKEND_API_URL}/programs/handle/${id}`;

  const secondaryUrl = idIsUuid
    ? `${BACKEND_API_URL}/programs/handle/${id}`
    : `${BACKEND_API_URL}/programs/${id}`;

  try {
    let upstream = await fetch(primaryUrl, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!upstream.ok) {
      const fallbackUpstream = await fetch(secondaryUrl, {
        method: "GET",
        headers,
        cache: "no-store",
      });
      if (fallbackUpstream.ok) {
        upstream = fallbackUpstream;
      } else if (token) {
        if (idIsUuid) {
          const adminUpstream = await fetch(
            `${BACKEND_API_URL}/admin/programs/${id}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          );
          if (adminUpstream.ok) {
            upstream = adminUpstream;
          }
        }

        if (!upstream.ok) {
          const orgProgramsUpstream = await fetch(
            `${BACKEND_API_URL}/organizations/me/programs?size=100`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              cache: "no-store",
            }
          );
          if (orgProgramsUpstream.ok) {
            const rawOrg = await orgProgramsUpstream.text();
            if (rawOrg) {
              try {
                const parsed = JSON.parse(rawOrg);
                const items: any[] = parsed.content ?? parsed ?? [];
                const found = items.find(
                  (item: any) => item.id === id || item.handle === id
                );
                if (found) {
                  return NextResponse.json(found, { status: 200 });
                }
              } catch {
                // Ignore JSON parse error
              }
            }
          }
        }
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id } = await params;
  if (!isUuid(id)) {
    return NextResponse.json(
      { message: "Program id must be a valid UUID" },
      { status: 400 }
    );
  }

  try {
    const upstream = await fetch(`${BACKEND_API_URL}/programs/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
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
        (body as { message?: string } | null)?.message ??
        "Failed to delete program.";
      return NextResponse.json(
        { message, details: body },
        { status: upstream.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch {
    return unreachable();
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id } = await params;
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Request body must be valid JSON" },
      { status: 400 }
    );
  }

  const jsonHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };

  const bodyStr = JSON.stringify(payload);

  const candidates: Array<{ url: string; method: string }> = [
    { url: `${BACKEND_API_URL}/organizations/me/programs/${id}`, method: "PUT" },
    { url: `${BACKEND_API_URL}/programs/${id}`, method: "PUT" },
    { url: `${BACKEND_API_URL}/programs/${id}`, method: "PATCH" },
    { url: `${BACKEND_API_URL}/programs/${id}/state`, method: "PATCH" },
    { url: `${BACKEND_API_URL}/programs/${id}/activate`, method: "POST" },
    { url: `${BACKEND_API_URL}/organizations/me/programs/${id}/activate`, method: "POST" },
    { url: `${BACKEND_API_URL}/organizations/me/programs/${id}`, method: "PATCH" },
  ];

  try {
    let upstream: Response | null = null;

    for (const candidate of candidates) {
      const res = await fetch(candidate.url, {
        method: candidate.method,
        headers: jsonHeaders,
        body: bodyStr,
        cache: "no-store",
      });

      upstream = res;
      if (res.ok) {
        break;
      }
    }

    if (!upstream) {
      return NextResponse.json(
        { message: "Failed to update program state." },
        { status: 500 }
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
      const message =
        (body as { message?: string } | null)?.message ??
        "Failed to update program state.";
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
