import { NextResponse, type NextRequest } from "next/server";
import * as z from "zod";
import {
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

const count = z.number().int().nonnegative().default(0);

const adminOverviewSchema = z.object({
  generatedAt: z.string().optional(),
  users: z
    .object({
      total: count,
      active: count,
      suspended: count,
      removed: count,
    })
    .default({ total: 0, active: 0, suspended: 0, removed: 0 }),
  organizations: z
    .object({
      total: count,
      active: count,
      pendingReview: count,
      rejected: count,
    })
    .default({ total: 0, active: 0, pendingReview: 0, rejected: 0 }),
  programs: z
    .object({
      total: count,
      draft: count,
      active: count,
      paused: count,
      closed: count,
      pendingReview: count,
    })
    .default({
      total: 0,
      draft: 0,
      active: 0,
      paused: 0,
      closed: 0,
      pendingReview: 0,
    }),
  reports: z
    .object({
      total: count,
      open: count,
      newReports: count,
      triaging: count,
      needsMoreInfo: count,
      validConfirmed: count,
      resolved: count,
      rejected: count,
      duplicate: count,
    })
    .default({
      total: 0,
      open: 0,
      newReports: 0,
      triaging: 0,
      needsMoreInfo: 0,
      validConfirmed: 0,
      resolved: 0,
      rejected: 0,
      duplicate: 0,
    }),
  moderation: z
    .object({
      totalPending: count,
      organizations: count,
      programs: count,
      problems: count,
      showcases: count,
      solutions: count,
      contentFlags: count,
    })
    .default({
      totalPending: 0,
      organizations: 0,
      programs: 0,
      problems: 0,
      showcases: 0,
      solutions: 0,
      contentFlags: 0,
    }),
});

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  try {
    const upstream = await upstreamFetch("/admin/overview", token);
    if (!upstream.ok) {
      return relay(upstream, "Unable to load the admin overview.");
    }

    const raw = await upstream.json();
    const parsed = adminOverviewSchema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "The admin overview returned an unexpected response." },
        { status: 502 },
      );
    }

    return NextResponse.json(parsed.data, { status: 200 });
  } catch {
    return unreachable("admin overview");
  }
}
