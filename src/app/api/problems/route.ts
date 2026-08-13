import { type NextRequest } from "next/server";
import {
  badJson,
  bearerTokenFor,
  forwardQuery,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
  validationFailed,
} from "@/lib/api/proxy";
import { problemCreateSchema } from "@/lib/validations/problem";

/**
 * GET /api/problems — the published problem feed (`findPublished` upstream).
 *
 * Only problems a moderator has approved come back here, so this is the public
 * half of the pair whose other half is `/api/admin/problems`. A signed-in
 * caller still sends its token, since the upstream personalises what it can.
 */
const LIST_PARAMS = [
  "categoryId",
  "sdlcPhase",
  "tag",
  "technology",
  "q",
  "status",
  "unansweredOnly",
  "page",
  "size",
  "sort",
] as const;

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  const query = forwardQuery(request.nextUrl.searchParams, LIST_PARAMS);

  try {
    const upstream = await upstreamFetch(`/problems${query}`, token);
    return relay(upstream, "Unable to load problems.");
  } catch {
    return unreachable("problem");
  }
}

/**
 * POST /api/problems — authenticated proxy for the backend's
 * `POST /api/v1/problems` create-and-submit operation.
 */
export async function POST(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badJson();
  }

  const parsed = problemCreateSchema.safeParse(payload);
  if (!parsed.success) return validationFailed(parsed.error);

  try {
    const upstream = await upstreamFetch("/problems", token, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return relay(upstream, "The problem could not be submitted.");
  } catch {
    return unreachable("problem");
  }
}
