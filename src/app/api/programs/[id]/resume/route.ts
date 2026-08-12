import { NextResponse, type NextRequest } from "next/server";
import {
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
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
      `/programs/${id}/resume`,
      `/v1/programs/${id}/resume`,
      `/organizations/me/programs/${id}/resume`,
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
        { message: "Failed to resume program." },
        { status: 500 }
      );
    }

    return relay(upstream, "Failed to resume program.");
  } catch {
    return unreachable("program resume");
  }
}
