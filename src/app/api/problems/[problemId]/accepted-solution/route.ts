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

/**
 * The accepted answer on a problem — `PUT` to mark one, `DELETE` to unmark.
 *
 * Only the problem's author may accept, and the backend is the authority on
 * that: whatever it refuses comes back unchanged.
 */

type Context = { params: Promise<{ problemId: string }> };

/** Mirrors `AcceptedSolutionRequest`. */
const acceptedSolutionSchema = z.object({
  solutionId: z.uuid("Solution id must be a UUID"),
});

export async function PUT(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { problemId: raw } = await context.params;
  const problemId = asUuid(raw);
  if (!problemId) return badRequest("Problem id must be a UUID");

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badJson();
  }

  const parsed = acceptedSolutionSchema.safeParse(payload);
  if (!parsed.success) return validationFailed(parsed.error);

  try {
    const upstream = await upstreamFetch(
      `/problems/${problemId}/accepted-solution`,
      token,
      { method: "PUT", body: JSON.stringify(parsed.data) },
    );
    return relay(upstream, "That answer could not be accepted.");
  } catch {
    return unreachable("problem");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const { problemId: raw } = await context.params;
  const problemId = asUuid(raw);
  if (!problemId) return badRequest("Problem id must be a UUID");

  try {
    const upstream = await upstreamFetch(
      `/problems/${problemId}/accepted-solution`,
      token,
      { method: "DELETE" },
    );
    return relay(upstream, "That answer could not be unaccepted.");
  } catch {
    return unreachable("problem");
  }
}
