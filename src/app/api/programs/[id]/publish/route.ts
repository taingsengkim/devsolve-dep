import { NextResponse, type NextRequest } from "next/server";
import {
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
  BACKEND_API_URL,
} from "@/lib/api/proxy";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { id } = await params;

  try {
    const candidates = [
      `/programs/${id}/publish`,
      `/v1/programs/${id}/publish`,
      `/organizations/me/programs/${id}/publish`,
    ];

    let upstream: Response | null = null;
    for (const path of candidates) {
      const res = await upstreamFetch(path, token, {
        method: "PATCH",
      });
      upstream = res;
      if (res.ok) {
        break;
      }
    }

    if (!upstream) {
      return NextResponse.json(
        { message: "Failed to publish program." },
        { status: 500 }
      );
    }

    return relay(upstream, "Failed to publish program.");
  } catch {
    return unreachable("program publish");
  }
}
