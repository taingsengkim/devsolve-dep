import { type NextRequest } from "next/server";
import {
  asUuid,
  badRequest,
  bearerTokenFor,
  relay,
  unauthorized,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";
import {
  BOOKMARK_TARGET_TYPES,
  type BookmarkTargetType,
} from "@/lib/validations/engagement";

/**
 * PUT/DELETE /api/bookmarks/{type}/{targetId} — proxy for the backend's
 * /api/v1/bookmarks/{type}/{targetId}.
 *
 * `PUT` is idempotent upstream: bookmarking twice leaves one bookmark.
 * Both are attributed to the session, so both require one.
 */

type Context = { params: Promise<{ type: string; targetId: string }> };

/** The path pair, or null when either half is malformed. */
async function resolveTarget(context: Context) {
  const { type, targetId } = await context.params;
  const upper = type.toUpperCase() as BookmarkTargetType;
  const id = asUuid(targetId);

  return BOOKMARK_TARGET_TYPES.includes(upper) && id
    ? { type: upper, id }
    : null;
}

const badTarget = () =>
  badRequest(
    `type must be one of ${BOOKMARK_TARGET_TYPES.join(", ")} and targetId must be a UUID`,
  );

export async function PUT(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const target = await resolveTarget(context);
  if (!target) return badTarget();

  try {
    const upstream = await upstreamFetch(
      `/bookmarks/${target.type}/${target.id}`,
      token,
      { method: "PUT" },
    );
    return relay(upstream, "The bookmark could not be saved.");
  } catch {
    return unreachable("bookmark");
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  const token = await bearerTokenFor(request);
  if (!token) return unauthorized();

  const target = await resolveTarget(context);
  if (!target) return badTarget();

  try {
    const upstream = await upstreamFetch(
      `/bookmarks/${target.type}/${target.id}`,
      token,
      { method: "DELETE" },
    );
    return relay(upstream, "The bookmark could not be removed.");
  } catch {
    return unreachable("bookmark");
  }
}
