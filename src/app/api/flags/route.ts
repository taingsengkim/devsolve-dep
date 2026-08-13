import { type NextRequest } from "next/server";
import {
  badJson,
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
  validationFailed,
} from "@/lib/api/proxy";
import { flagCreateSchema } from "@/lib/validations/engagement";

/**
 * POST /api/flags — a reader reporting a comment, problem, solution or
 * showcase to the moderators.
 *
 * The admin side of flags already had routes under `/api/admin/flags`; this is
 * the one that raises them. A report is attributed to the reporter, so it
 * needs a token, and what happens next is the moderators' call.
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

  const parsed = flagCreateSchema.safeParse(payload);
  if (!parsed.success) return validationFailed(parsed.error);

  try {
    const upstream = await upstreamFetch("/flags", token, {
      method: "POST",
      body: JSON.stringify(parsed.data),
    });
    return relay(upstream, "Your report could not be submitted.");
  } catch {
    return unreachable("flag");
  }
}
