import { type NextRequest } from "next/server";
import * as z from "zod";

import {
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
  validationFailed,
} from "@/lib/api/proxy";

const organizationQuerySchema = z.object({
  query: z.string().trim().max(200).optional(),
  status: z.enum(["PENDING", "ACTIVE", "REJECTED"]).optional(),
  pageNumber: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const parsed = organizationQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );
  if (!parsed.success) return validationFailed(parsed.error);

  const query = new URLSearchParams({
    pageNumber: String(parsed.data.pageNumber),
    pageSize: String(parsed.data.pageSize),
  });
  if (parsed.data.query) query.set("query", parsed.data.query);
  if (parsed.data.status) query.set("status", parsed.data.status);

  try {
    const upstream = await upstreamFetch(
      `/admin/organizations?${query.toString()}`,
      token,
    );
    return relay(upstream, "Failed to fetch organizations.");
  } catch {
    return unreachable("organization");
  }
}
