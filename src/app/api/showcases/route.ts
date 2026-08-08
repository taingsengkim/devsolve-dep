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
import { showcaseCreateSchema } from "@/lib/validations/showcase";

/**
 * GET/POST /api/showcases — proxy for the backend's /api/v1/showcases.
 *
 * The index is public: a visitor browsing showcases has no session, so the
 * listing relays without a token and passes one along when there is one.
 * Publishing is not — `POST` is attributed to whoever the token identifies.
 */

const LIST_PARAMS = [
  "query",
  "categoryId",
  "sortBy",
  "sortDirection",
  "pageNumber",
  "pageSize",
] as const;

export async function GET(request: NextRequest) {
  const token = await bearerTokenFor(request);
  const query = forwardQuery(request.nextUrl.searchParams, LIST_PARAMS);

  try {
    const upstream = await upstreamFetch(`/showcases${query}`, token);
    return relay(upstream, "Unable to load showcases.");
  } catch {
    return unreachable("showcase");
  }
}

export async function POST(request: NextRequest) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badJson();
  }

  const parsed = showcaseCreateSchema.safeParse(payload);
  if (!parsed.success) return validationFailed(parsed.error);

  try {
    const upstream = await upstreamFetch("/showcases", token, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return relay(upstream, "The showcase could not be created.");
  } catch {
    return unreachable("showcase");
  }
}
