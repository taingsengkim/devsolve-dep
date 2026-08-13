import { type NextRequest } from "next/server";
import {
  asUuid,
  badRequest,
  bearerTokenFor,
  forwardQuery,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { userId: rawUserId } = await context.params;
  const userId = asUuid(rawUserId);
  if (!userId) return badRequest("User id must be a valid UUID");

  const query = forwardQuery(request.nextUrl.searchParams, [
    "pageNumber",
    "pageSize",
  ]);

  try {
    const upstream = await upstreamFetch(
      `/follows/users/${userId}/following/users${query}`,
      token,
    );
    return relay(upstream, "Unable to load the following users list.");
  } catch {
    return unreachable("following users");
  }
}
