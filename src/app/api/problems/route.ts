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
import { problemCreateSchema } from "@/lib/validations/problem";

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
