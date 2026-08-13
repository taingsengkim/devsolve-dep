import { type NextRequest } from "next/server";
import {
  asUuid,
  badRequest,
  bearerTokenFor,
  forwardQuery,
  relay,
  unreachable,
  upstreamFetch,
} from "@/lib/api/proxy";
import {
  COMMENTABLE_TYPES,
  type CommentableType,
} from "@/lib/validations/engagement";

/**
 * GET /api/comments/thread — top-level comments, each with its first replies
 * already attached.
 *
 * The flat `/comments` collection needs one request per parent to build the
 * same view, so a thread of any size means a request storm. This returns the
 * page and `replyLimit` replies under every entry in one round trip, and says
 * via `hasMoreReplies` where the rest have to be fetched.
 *
 * Reading is public, matching the content the thread hangs off; a token is
 * relayed when there is one so `myVote`, `canEdit` and `canDelete` come back
 * filled in for the caller.
 *
 * A static segment beats the sibling `[id]` route, so "thread" is never read
 * as a comment id.
 */
export async function GET(request: NextRequest) {
  const search = request.nextUrl.searchParams;
  const type = (search.get("commentableType") ?? "").toUpperCase() as
    | CommentableType
    | "";
  const id = asUuid(search.get("commentableId") ?? undefined);

  if (!type || !COMMENTABLE_TYPES.includes(type) || !id) {
    return badRequest(
      `commentableType must be one of ${COMMENTABLE_TYPES.join(", ")} and commentableId must be a UUID`,
    );
  }

  const token = await bearerTokenFor(request);
  const query = forwardQuery(search, [
    "commentableType",
    "commentableId",
    "sort",
    "replyLimit",
    "pageNumber",
    "pageSize",
  ]);

  try {
    const upstream = await upstreamFetch(`/comments/thread${query}`, token);
    return relay(upstream, "Unable to load the comments.");
  } catch {
    return unreachable("comment");
  }
}
