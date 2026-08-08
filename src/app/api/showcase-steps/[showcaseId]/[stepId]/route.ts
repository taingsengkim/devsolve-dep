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
import { showcaseStepUpdateSchema } from "@/lib/validations/showcase";

/**
 * GET/PATCH/DELETE /api/showcase-steps/{showcaseId}/{stepId} — proxy for the
 * backend's /api/v1/showcase-steps/{showcaseId}/{stepId}.
 *
 * Both ids are in the path upstream: the step is addressed through the
 * showcase that owns it, so a step id from another showcase cannot be reached.
 */

type Context = { params: Promise<{ showcaseId: string; stepId: string }> };

/** Both path ids, or null when either is malformed. */
async function resolveIds(context: Context) {
  const { showcaseId, stepId } = await context.params;
  const showcase = asUuid(showcaseId);
  const step = asUuid(stepId);
  return showcase && step ? { showcase, step } : null;
}

const badIds = () =>
  badRequest("Showcase id and step id must both be UUIDs");

export async function GET(request: NextRequest, context: Context) {
  const ids = await resolveIds(context);
  if (!ids) return badIds();

  const token = await bearerTokenFor(request);

  try {
    const upstream = await upstreamFetch(
      `/showcase-steps/${ids.showcase}/${ids.step}`,
      token,
    );
    return relay(upstream, "Unable to load that step.");
  } catch {
    return unreachable("showcase");
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const ids = await resolveIds(context);
  if (!ids) return badIds();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badJson();
  }

  const parsed = showcaseStepUpdateSchema.safeParse(payload);
  if (!parsed.success) return validationFailed(parsed.error);

  if (Object.keys(parsed.data).length === 0) {
    return badRequest("No updatable fields were provided");
  }

  try {
    const upstream = await upstreamFetch(
      `/showcase-steps/${ids.showcase}/${ids.step}`,
      token,
      { method: "PATCH", body: JSON.stringify(parsed.data) },
    );
    return relay(upstream, "The step could not be updated.");
  } catch {
    return unreachable("showcase");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const ids = await resolveIds(context);
  if (!ids) return badIds();

  try {
    const upstream = await upstreamFetch(
      `/showcase-steps/${ids.showcase}/${ids.step}`,
      token,
      { method: "DELETE" },
    );
    return relay(upstream, "The step could not be deleted.");
  } catch {
    return unreachable("showcase");
  }
}
