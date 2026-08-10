import { type NextRequest } from "next/server";
import * as z from "zod";

import {
  asUuid,
  badRequest,
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
  validationFailed,
} from "@/lib/api/proxy";

const historyQuerySchema = z.object({
  pageNumber: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const id = asUuid((await params).id);
  if (!id) return badRequest("Organization id must be a valid UUID");

  const parsed = historyQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  if (!parsed.success) return validationFailed(parsed.error);

  const query = new URLSearchParams({
    pageNumber: String(parsed.data.pageNumber),
    pageSize: String(parsed.data.pageSize),
  });

  try {
    const upstream = await upstreamFetch(
      `/admin/organizations/${id}/review-history?${query.toString()}`,
      token,
    );
    return relay(upstream, "Failed to fetch organization review history.");
  } catch {
    return unreachable("organization");
  }
}
