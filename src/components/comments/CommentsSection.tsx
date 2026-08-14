"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { AlertCircle, MessageSquare, RotateCcw } from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateCommentMutation,
  useDeleteCommentMutation,
  useGetCommentByIdQuery,
  useGetCommentThreadQuery,
  useGetCommentsQuery,
  useUpdateCommentMutation,
  type CommentResponse,
} from "@/lib/redux/services/commentsApi";
import type {
  CommentableType,
  CommentSort,
} from "@/lib/validations/engagement";
import { parseApiError } from "@/lib/api/errors";
import { useSidebarAuth } from "@/hooks/useSidebarAuth";
import { CommentComposer } from "./CommentComposer";
import { CommentItem, ShowMoreReplies } from "./CommentItem";

/**
 * The comment thread for one piece of content.
 *
 * Reads `/comments/thread`, which returns each top-level comment with its
 * first few replies already attached — the flat `/comments` collection needs a
 * request per parent to draw the same view. The remaining replies under any
 * one comment are fetched on demand.
 *
 * Any comment can be replied to, including a reply, and `parentCommentId`
 * records the one actually answered. The drawing is deliberately flatter than
 * the data: every descendant of a top-level comment sits at one indent and
 * names who it answers, because indenting per level runs out of width after
 * two or three on a phone.
 */

const PAGE_SIZE = 20;
const REPLY_LIMIT = 3;

const SORTS: { value: CommentSort; label: string }[] = [
  { value: "NEWEST", label: "Newest first" },
  { value: "OLDEST", label: "Oldest first" },
  { value: "TOP", label: "Top comments" },
];

export function CommentsSection({
  commentableType,
  commentableId,
  className,
}: {
  commentableType: CommentableType;
  commentableId: string;
  className?: string;
}) {
  const [sort, setSort] = useState<CommentSort>("NEWEST");
  const [pageNumber, setPageNumber] = useState(0);
  const [draft, setDraft] = useState("");
  /** Parents whose full reply list the reader has asked for. */
  const [expanded, setExpanded] = useState<string[]>([]);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [focusedCommentId, setFocusedCommentId] = useState<string | null>(null);

  useEffect(() => {
    const syncFocusedComment = () => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      setFocusedCommentId(
        hash.startsWith("comment-") ? hash.slice("comment-".length) : null,
      );
    };

    syncFocusedComment();
    window.addEventListener("hashchange", syncFocusedComment);
    return () => window.removeEventListener("hashchange", syncFocusedComment);
  }, []);

  /* Posting is attributed to a session, so a signed-out reader is offered the
     way in rather than a box that only fails once they have typed into it. */
  const { user, isPending: isSessionPending } = useSidebarAuth();
  const canPost = Boolean(user);

  const target = { commentableType, commentableId };

  const { data, isLoading, isFetching, isError, refetch } =
    useGetCommentThreadQuery({
      ...target,
      sort,
      replyLimit: REPLY_LIMIT,
      pageNumber,
      pageSize: PAGE_SIZE,
    });

  const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const { data: focusedComment } = useGetCommentByIdQuery(
    focusedCommentId ?? "",
    { skip: !focusedCommentId },
  );

  const threads = useMemo(() => data?.content ?? [], [data]);
  const total = data?.totalElements ?? 0;
  const hasMorePages = data ? !data.last : false;
  const focusedCommentIsVisible = focusedCommentId
    ? threads.some(
        (thread) =>
          thread.comment.id === focusedCommentId ||
          thread.replies.some((reply) => reply.id === focusedCommentId),
      )
    : false;

  useEffect(() => {
    if (!focusedCommentId) return;

    const target =
      document.getElementById(`comment-${focusedCommentId}`) ??
      document.getElementById(`focused-comment-${focusedCommentId}`);
    if (!target) return;

    window.requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [focusedCommentId, focusedComment, threads]);

  const report = (error: unknown, fallback: string) =>
    toast.error(parseApiError(error, fallback).message);

  const post = async () => {
    const content = draft.trim();
    if (!content) return;

    try {
      await createComment({ ...target, content }).unwrap();
      setDraft("");
      /* A new top-level comment is at the front only under NEWEST; for the
         other orders the reader is told where it went rather than left
         hunting for it. */
      if (sort !== "NEWEST") toast.success("Comment posted.");
    } catch (error) {
      report(error, "Your comment could not be posted.");
    }
  };

  /** `parentCommentId` is the comment being answered, at whatever depth. */
  const reply = async (parentCommentId: string, content: string) => {
    try {
      await createComment({ ...target, content, parentCommentId }).unwrap();
      /* Expand in case the new reply lands past the few the thread endpoint
         seeds. Harmless when the id belongs to a nested reply rather than a
         thread root — those refetch on the invalidated tag regardless. */
      setExpanded((prev) =>
        prev.includes(parentCommentId) ? prev : [...prev, parentCommentId],
      );
    } catch (error) {
      report(error, "Your reply could not be posted.");
    }
  };

  const edit = async (id: string, content: string) => {
    try {
      await updateComment({ ...target, id, content }).unwrap();
    } catch (error) {
      report(error, "Your comment could not be saved.");
    }
  };

  const remove = async (id: string) => {
    setBusyId(id);
    try {
      await deleteComment({ ...target, id }).unwrap();
    } catch (error) {
      report(error, "Your comment could not be deleted.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className={className} aria-label="Comments">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
          <MessageSquare aria-hidden="true" className="size-4.5" />
          Comments
          {total > 0 && (
            <span className="rounded-lg bg-muted px-2 py-0.5 text-sm font-bold tabular-nums text-muted-foreground">
              {total}
            </span>
          )}
        </h2>

        {total > 1 && (
          <Select
            value={sort}
            onValueChange={(value: string | null) => {
              if (!value) return;
              setSort(value as CommentSort);
              setPageNumber(0);
              setExpanded([]);
            }}
          >
            <SelectTrigger
              aria-label="Sort comments"
              className="h-9 w-40 rounded-xl border-border bg-card text-sm"
            >
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORTS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </header>

      {/* Composer first: the reason most people open a thread is to add to it,
          and burying the box under a page of comments hides it. */}
      {isSessionPending ? (
        <div className="h-24 animate-pulse rounded-2xl bg-muted" />
      ) : canPost ? (
        <CommentComposer
          value={draft}
          onChange={setDraft}
          onSubmit={post}
          isSubmitting={isPosting}
        />
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-border px-5 py-4">
          <p className="text-base text-muted-foreground">
            Sign in to join the discussion.
          </p>
          <Link
            href="/login"
            className={cn(
              buttonVariants(),
              "h-9 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700",
            )}
          >
            Sign in
          </Link>
        </div>
      )}

      <div className="mt-6">
        {focusedComment && !focusedCommentIsVisible && (
          <div
            id={`focused-comment-${focusedComment.id}`}
            className="mb-6 scroll-mt-24 rounded-2xl border border-primary/30 bg-primary/5 p-4"
          >
            <p className="mb-3 text-sm font-semibold text-primary">
              Comment from notification
            </p>
            <CommentItem
              comment={focusedComment}
              omitAnchor
              isSignedIn={canPost}
              isBusy={busyId === focusedComment.id}
              onReply={(content) => reply(focusedComment.id, content)}
              onEdit={(content) => edit(focusedComment.id, content)}
              onDelete={() => remove(focusedComment.id)}
            />
          </div>
        )}

        {isLoading ? (
          <ThreadSkeleton />
        ) : isError ? (
          <div
            role="alert"
            className="flex flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-900/60 dark:bg-rose-950/30"
          >
            <AlertCircle className="size-5 text-rose-600 dark:text-rose-400" />
            <p className="text-base font-medium text-rose-800 dark:text-rose-200">
              The comments could not be loaded.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
              className="rounded-xl"
            >
              <RotateCcw data-icon="inline-start" />
              Try again
            </Button>
          </div>
        ) : threads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border py-10 text-center">
            <p className="text-base font-semibold text-foreground">
              No comments yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Be the first to say something.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {threads.map((thread) => (
                <CommentItem
                  key={thread.comment.id}
                  comment={thread.comment}
                  isSignedIn={canPost}
                  isBusy={busyId === thread.comment.id}
                  onReply={(content) => reply(thread.comment.id, content)}
                  onEdit={(content) => edit(thread.comment.id, content)}
                  onDelete={() => remove(thread.comment.id)}
                >
                  <Replies
                    parent={thread.comment}
                    seeded={thread.replies}
                    replyCount={thread.replyCount}
                    hasMore={thread.hasMoreReplies}
                    isExpanded={expanded.includes(thread.comment.id)}
                    onExpand={() =>
                      setExpanded((prev) => [...prev, thread.comment.id])
                    }
                    busyId={busyId}
                    isSignedIn={canPost}
                    onReply={reply}
                    onEdit={edit}
                    onDelete={remove}
                    target={target}
                  />
                </CommentItem>
              ))}
            </AnimatePresence>

            {hasMorePages && (
              <div className="flex justify-center pt-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isFetching}
                  onClick={() => setPageNumber((page) => page + 1)}
                  className="rounded-xl"
                >
                  {isFetching ? "Loading…" : "Load more comments"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Everything answering one top-level comment, drawn in a single column.
 *
 * A reply targets the comment it actually answers — `parentCommentId` is that
 * comment's id, not the thread opener's — so the tree in the database matches
 * what the reader clicked. Rendering does not follow that shape: nesting a
 * level per depth walks off the right edge of a phone after two or three, so
 * every descendant sits at the same indent and says who it is addressed to
 * instead.
 *
 * Depth is handled by recursion through `Descendants`, which keeps the hook
 * count fixed per component — a loop over a variable number of parents could
 * not call `useGetCommentsQuery` for each.
 */
function Replies({
  parent,
  seeded,
  replyCount,
  hasMore,
  isExpanded,
  onExpand,
  busyId,
  isSignedIn,
  onReply,
  onEdit,
  onDelete,
  target,
}: {
  parent: CommentResponse;
  seeded: CommentResponse[];
  replyCount: number;
  hasMore: boolean;
  isExpanded: boolean;
  onExpand: () => void;
  busyId: string | null;
  isSignedIn?: boolean;
  onReply: (parentCommentId: string, content: string) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  target: { commentableType: CommentableType; commentableId: string };
}) {
  const { data, isFetching } = useGetCommentsQuery(
    { ...target, parentCommentId: parent.id, pageSize: 100, sort: "OLDEST" },
    { skip: !isExpanded },
  );

  const replies = isExpanded && data ? data.content : seeded;
  const remaining = Math.max(replyCount - seeded.length, 0);

  if (replies.length === 0 && !hasMore) return null;

  return (
    <div className="mt-3 space-y-3 border-l-2 border-border pl-4">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          isReply
          isSignedIn={isSignedIn}
          isBusy={busyId === reply.id}
          onReply={(content) => onReply(reply.id, content)}
          onEdit={(content) => onEdit(reply.id, content)}
          onDelete={() => onDelete(reply.id)}
        >
          {/* Answers to this reply, lifted into the same column. */}
          {(reply.replyCount ?? 0) > 0 && (
            <Descendants
              parent={reply}
              busyId={busyId}
              isSignedIn={isSignedIn}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              target={target}
            />
          )}
        </CommentItem>
      ))}

      {hasMore && !isExpanded && remaining > 0 && (
        <ShowMoreReplies
          remaining={remaining}
          isLoading={isFetching}
          onClick={onExpand}
        />
      )}
    </div>
  );
}

/**
 * Replies to a reply. Rendered flat beside their siblings, each labelled with
 * the author it answers, and recursing for anything below them.
 */
function Descendants({
  parent,
  busyId,
  isSignedIn,
  onReply,
  onEdit,
  onDelete,
  target,
}: {
  parent: CommentResponse;
  busyId: string | null;
  isSignedIn?: boolean;
  onReply: (parentCommentId: string, content: string) => Promise<void>;
  onEdit: (id: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  target: { commentableType: CommentableType; commentableId: string };
}) {
  const { data } = useGetCommentsQuery({
    ...target,
    parentCommentId: parent.id,
    pageSize: 100,
    sort: "OLDEST",
  });

  const replies = data?.content ?? [];
  if (replies.length === 0) return null;

  return (
    <div className="mt-3 space-y-3">
      {replies.map((reply) => (
        <CommentItem
          key={reply.id}
          comment={reply}
          isReply
          replyingTo={parent.authorName}
          isSignedIn={isSignedIn}
          isBusy={busyId === reply.id}
          onReply={(content) => onReply(reply.id, content)}
          onEdit={(content) => onEdit(reply.id, content)}
          onDelete={() => onDelete(reply.id)}
        >
          {(reply.replyCount ?? 0) > 0 && (
            <Descendants
              parent={reply}
              busyId={busyId}
              isSignedIn={isSignedIn}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              target={target}
            />
          )}
        </CommentItem>
      ))}
    </div>
  );
}

function ThreadSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading comments"
      className="animate-pulse space-y-6"
    >
      <span className="sr-only">Loading comments…</span>
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex gap-3">
          <span className="size-9 shrink-0 rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-20 rounded-2xl bg-muted" />
            <div className="h-4 w-24 rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default CommentsSection;
