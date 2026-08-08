import { type NextRequest } from "next/server";
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
import { showcaseStepCreateSchema } from "@/lib/validations/showcase";

/**
 * GET/POST /api/showcase-steps/{showcaseId} — proxy for the backend's
 * /api/v1/showcase-steps/{showcaseId}.
 *
 * The build guide is the public half of a showcase, so reading the steps needs
 * no session. Writing one does, and the upstream takes a single step per call:
 * `stepNumber` carries the order, which the create form derives from list
 * position rather than asking the author to type.
 */

type Context = { params: Promise<{ showcaseId: string }> };

const badId = () => badRequest("Showcase id must be a UUID");

export async function GET(request: NextRequest, context: Context) {
  const { showcaseId: raw } = await context.params;
  const showcaseId = asUuid(raw);
  if (!showcaseId) return badId();

  const token = await bearerTokenFor(request);

  try {
    const upstream = await upstreamFetch(`/showcase-steps/${showcaseId}`, token);
    return relay(upstream, "Unable to load the build guide.");
  } catch {
    return unreachable("showcase");
  }
}

export async function POST(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { showcaseId: raw } = await context.params;
  const showcaseId = asUuid(raw);
  if (!showcaseId) return badId();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badJson();
  }

  const parsed = showcaseStepCreateSchema.safeParse(payload);
  if (!parsed.success) return validationFailed(parsed.error);

  try {
    const upstream = await upstreamFetch(`/showcase-steps/${showcaseId}`, token, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return relay(upstream, "The step could not be saved.");
  } catch {
    return unreachable("showcase");
  }
}
