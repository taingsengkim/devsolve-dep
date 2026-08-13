import { type NextRequest } from "next/server";
import {
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

/**
 * PATCH /api/notifications/read-all — Mark all notifications as read.
 * Proxies PATCH /api/v1/notifications/read-all
 */
export async function PATCH(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  try {
    const upstream = await upstreamFetch("/notifications/read-all", token, {
      method: "PATCH",
    });
    return relay(upstream, "Unable to mark all notifications as read.");
  } catch {
    return unreachable("notification");
  }
}
