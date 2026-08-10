import { type NextRequest } from "next/server";
import * as z from "zod";

import {
  asUuid,
  badJson,
  badRequest,
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
  validationFailed,
} from "@/lib/api/proxy";

const rejectionSchema = z.object({
  reason: z.string().trim().min(1, "A rejection reason is required").max(1000),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const id = asUuid((await params).id);
  if (!id) return badRequest("Organization id must be a valid UUID");

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badJson();
  }

  const parsed = rejectionSchema.safeParse(body);
  if (!parsed.success) return validationFailed(parsed.error);

  try {
    const upstream = await upstreamFetch(
      `/admin/organizations/${id}/reject`,
      token,
      { method: "PATCH", body: JSON.stringify(parsed.data) },
    );
    return relay(upstream, "Failed to reject organization.");
  } catch {
    return unreachable("organization");
  }
}
