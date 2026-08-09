"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "motion/react";
import {
  AlertCircle,
  ArrowLeft,
  Bookmark,
  CheckCircle2,
  ChevronUp,
  CircleDot,
  Download,
  MessageSquare,
  Plus,
  RotateCcw,
  Send,
} from "lucide-react";

import { SolutionCard } from "@/components/discussions/SolutionCard";
import { MarkdownView } from "@/components/showcases/detail/MarkdownView";
import {
  useGetProblemByIdQuery,
  type ProblemResponse,
} from "@/lib/redux/services/problemsApi";
import {
  useGetMyProfileQuery,
  useGetSolutionsByProblemQuery,
} from "@/lib/redux/services/solutionsApi";
import {
  useGetVoteSummaryQuery,
  useRemoveVoteMutation,
  useSetVoteMutation,
} from "@/lib/redux/services/votesApi";
import {
  useGetBookmarkStatusQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@/lib/redux/services/bookmarksApi";
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from "@/lib/redux/services/commentsApi";
import { SDLC_LABELS } from "@/lib/validations/problem";

/**
 * One problem, read from the API — `GET /api/v1/problems/{id}` for the post,
 * `/problems/{id}/solutions` for the answers, `/comments` for the thread, and
 * the vote and bookmark endpoints for the two buttons.
 *
 * Only problems reach this route: a showcase card links to `/showcases/{id}`,
 * which has its own page. That is why nothing here branches on the two.
 */

const CARD =
  "rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs";

const SOLUTION_PAGE_SIZE = 50;
const COMMENT_PAGE_SIZE = 50;

function formatDate(iso?: string) {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBytes(bytes?: number) {
  if (bytes === undefined || Number.isNaN(bytes)) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const id = problemId ?? "";

  const {
    data: problem,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetProblemByIdQuery(id, { skip: !id });

  const [sortOrder, setSortOrder] = useState<"votes" | "newest">("newest");

  if (isLoading) return <DetailSkeleton />;

  if (isError || !problem) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined;

    return (
      <NotFound
        title={status === 404 ? "Problem not found" : "Something went wrong"}
        body={
          status === 404
            ? "It may have been removed, or the link may be wrong."
            : "This problem could not be loaded right now."
        }
        onRetry={status === 404 ? undefined : () => void refetch()}
      />
    );
  }

  return (
    <Loaded
      id={id}
      problem={problem}
      sortOrder={sortOrder}
      onSortChange={setSortOrder}
    />
  );
}

/** Split out so the hooks below only run once a problem is actually loaded. */
function Loaded({
  id,
  problem,
  sortOrder,
  onSortChange,
}: {
  id: string;
  problem: ProblemResponse;
  sortOrder: "votes" | "newest";
  onSortChange: (order: "votes" | "newest") => void;
}) {
  const { data: solutionPage, isLoading: isLoadingSolutions } =
    useGetSolutionsByProblemQuery({
      problemId: id,
      pageSize: SOLUTION_PAGE_SIZE,
    });

  /* Who is reading. A signed-out visitor gets a 401 here, which is the answer
     rather than an error: they cannot post either way. */
  const { data: me } = useGetMyProfileQuery();
  const isSignedIn = Boolean(me?.id);
  const isOwnProblem = Boolean(me?.id && problem.author?.id === me.id);
  const canAnswer = isSignedIn && !isOwnProblem;

  const { data: votes } = useGetVoteSummaryQuery({
    type: "PROBLEM",
    targetId: id,
  });
  const [setVote, { isLoading: isSettingVote }] = useSetVoteMutation();
  const [removeVote, { isLoading: isRemovingVote }] = useRemoveVoteMutation();
  const isVoting = isSettingVote || isRemovingVote;
  const hasUpvoted = votes?.currentUserVote === 1;

  const { data: isBookmarked = false } = useGetBookmarkStatusQuery({
    type: "PROBLEM",
    targetId: id,
  });
  const [addBookmark, { isLoading: isAddingBookmark }] = useAddBookmarkMutation();
  const [removeBookmark, { isLoading: isRemovingBookmark }] = useRemoveBookmarkMutation();
  const isBookmarking = isAddingBookmark || isRemovingBookmark;

  const { data: commentPage } = useGetCommentsQuery({
    commentableType: "PROBLEM",
    commentableId: id,
    pageSize: COMMENT_PAGE_SIZE,
  });
  const [createComment, { isLoading: isPostingComment }] =
    useCreateCommentMutation();
  const [draft, setDraft] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  const solutions = useMemo(() => {
    const list = [...(solutionPage?.content ?? [])];
    /* `SolutionResponse` carries no score, so "votes" can only put accepted
       answers first — the per-card scores are fetched by the cards themselves. */
    if (sortOrder === "votes") {
      return list.sort(
        (a, b) =>
          Number(b.reviewStatus === "ACCEPTED") -
          Number(a.reviewStatus === "ACCEPTED"),
      );
    }
    return list.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [solutionPage, sortOrder]);

  const comments = commentPage?.content ?? [];
  const attachments = problem.attachments ?? [];
  const tags = problem.tags ?? [];
  const technologies = problem.technologies ?? [];
  const isResolved = problem.status === "RESOLVED";

  const onVote = async () => {
    if (isVoting) return;
    const target = { type: "PROBLEM" as const, targetId: id };
    if (hasUpvoted) await removeVote(target);
    else await setVote({ ...target, value: 1 });
  };

  const onBookmark = async () => {
    if (isBookmarking) return;
    if (isBookmarked) {
      await removeBookmark({ type: "PROBLEM", targetId: id });
    } else {
      await addBookmark({ type: "PROBLEM", targetId: id });
    }
  };

  const onComment = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isPostingComment) return;

    try {
      await createComment({
        commentableType: "PROBLEM",
        commentableId: id,
        content,
      }).unwrap();
      setDraft("");
      setCommentError(null);
    } catch (caught) {
      setCommentError(messageOf(caught, "Your comment could not be posted."));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-[#F8FAFC] pb-16 font-sans text-slate-800 dark:bg-slate-950 dark:text-slate-100"
    >
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/community"
          className="mb-6 inline-flex items-center gap-2 text-base font-semibold text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
        >
          <ArrowLeft className="size-4" />
          Back to Community
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            {/* ── The problem ── */}
            <section className={`${CARD} p-6`}>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    isResolved
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"
                  }`}
                >
                  {isResolved ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <CircleDot className="size-3.5" />
                  )}
                  {isResolved ? "Solved" : "Open"}
                </span>

                {problem.sdlcPhase && (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {SDLC_LABELS[problem.sdlcPhase]}
                  </span>
                )}
                {problem.category?.name && (
                  <span className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
                    {problem.category.name}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                  {problem.title ?? "Untitled problem"}
                </h1>

                <div className="flex shrink-0 items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => void onVote()}
                    disabled={isVoting}
                    aria-pressed={hasUpvoted}
                    aria-label={hasUpvoted ? "Remove upvote" : "Upvote"}
                    className={`cursor-pointer rounded-lg p-1.5 transition-colors disabled:opacity-50 ${
                      hasUpvoted
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    <ChevronUp className="size-4" />
                  </button>
                  <span className="px-1.5 text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
                    {votes?.score ?? 0}
                  </span>
                </div>
              </div>

              {(tags.length > 0 || technologies.length > 0) && (
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {technologies.map((tech, i) => (
                    <span
                      key={tech.id ?? `${tech.name}-${i}`}
                      className="rounded-lg border border-slate-200/60 bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    >
                      {tech.name}
                      {tech.version ? ` ${tech.version}` : ""}
                    </span>
                  ))}
                  {tags.map((tag, i) => (
                    <span
                      key={tag.id ?? `${tag.name}-${i}`}
                      className="rounded-lg border border-blue-200/60 bg-blue-50 px-2.5 py-1 font-mono text-xs font-medium text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Description
                </h2>
                {problem.description ? (
                  <MarkdownView source={problem.description} />
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This problem was posted without a description.
                  </p>
                )}
              </div>

              {attachments.length > 0 && (
                <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Attachments
                  </h2>
                  {attachments.map((file, i) => (
                    <div
                      key={file.id ?? `${file.fileName}-${i}`}
                      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/60"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {file.fileName ?? "Unnamed file"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {[file.mimeType, formatBytes(file.sizeBytes)]
                            .filter(Boolean)
                            .join(" · ") || "—"}
                        </p>
                      </div>
                      {file.downloadUrl?.startsWith("https://") && (
                        <a
                          href={file.downloadUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:bg-white dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                          <Download className="size-3.5" />
                          Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4 text-sm dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => void onBookmark()}
                  disabled={isBookmarking}
                  aria-pressed={isBookmarked}
                  className={`flex cursor-pointer items-center gap-1.5 rounded-xl border px-3.5 py-1.5 font-medium transition disabled:opacity-50 ${
                    isBookmarked
                      ? "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  <Bookmark
                    className={`size-4 ${isBookmarked ? "fill-current" : ""}`}
                  />
                  {isBookmarked ? "Bookmarked" : "Bookmark"}
                </button>
              </div>
            </section>

            {/* ── Answers ── */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                  {solutionPage?.totalElements ?? 0}{" "}
                  {solutionPage?.totalElements === 1 ? "Solution" : "Solutions"}
                </h2>
                <div className="flex items-center rounded-lg bg-slate-200/60 p-0.5 text-xs font-bold dark:bg-slate-800">
                  {(["newest", "votes"] as const).map((order) => (
                    <button
                      key={order}
                      type="button"
                      onClick={() => onSortChange(order)}
                      aria-pressed={sortOrder === order}
                      className={`cursor-pointer rounded-md px-3 py-1 transition-colors ${
                        sortOrder === order
                          ? "bg-white text-slate-900 shadow-xs dark:bg-slate-900 dark:text-slate-100"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {order === "votes" ? "accepted" : "newest"}
                    </button>
                  ))}
                </div>
              </div>

              {canAnswer && (
                <Link
                  href={`/community/${id}/solutions/create`}
                  className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-600 px-4 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-700"
                >
                  <Plus className="size-4" />
                  Post your solution
                </Link>
              )}
            </div>

            {/* Why the composer is absent, when it is. Silence would read as a
                bug to whoever came here to answer. */}
            {isOwnProblem && (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                This is your problem, so you cannot answer it yourself. You can
                accept an answer once someone posts one.
              </p>
            )}
            {!isSignedIn && (
              <p className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
                Sign in to post a solution to this problem.
              </p>
            )}

            {isLoadingSolutions ? (
              <div className="animate-pulse space-y-4">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
                  />
                ))}
              </div>
            ) : solutions.length === 0 ? (
              <p className={`${CARD} p-8 text-center text-sm text-slate-500 dark:text-slate-400`}>
                {canAnswer
                  ? "No answers yet. Be the first to post one."
                  : "No answers yet."}
              </p>
            ) : (
              <div className="space-y-4">
                {solutions.map((solution, index) => (
                  <SolutionCard
                    key={solution.id}
                    solution={solution}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* ── Comments ── */}
            <section className={`${CARD} p-6`}>
              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                <MessageSquare className="size-4 text-slate-500" />
                Comments ({commentPage?.totalElements ?? comments.length})
              </h2>

              {comments.length > 0 && (
                <div className="mb-4 space-y-3">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm dark:border-slate-800 dark:bg-slate-800/60"
                    >
                      {comment.authorAvatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={comment.authorAvatarUrl}
                          alt=""
                          className="size-8 rounded-full bg-slate-200 object-cover dark:bg-slate-700"
                        />
                      ) : (
                        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                          {(comment.authorName || "?").slice(0, 1).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center justify-between gap-3">
                          <span className="font-bold text-slate-800 dark:text-slate-100">
                            {comment.authorName || "Unknown"}
                          </span>
                          <span className="shrink-0 text-xs text-slate-400">
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <p className="whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <form onSubmit={onComment} className="flex items-center gap-2">
                <input
                  type="text"
                  value={draft}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (commentError) setCommentError(null);
                  }}
                  maxLength={5000}
                  aria-label="Write a comment"
                  placeholder="Add a comment…"
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950"
                />
                <button
                  type="submit"
                  disabled={isPostingComment || !draft.trim()}
                  className="cursor-pointer rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </form>
              {commentError && (
                <p className="mt-2 text-sm font-medium text-rose-600" role="alert">
                  {commentError}
                </p>
              )}
            </section>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-6">
            <section className={`${CARD} space-y-3.5 p-5 text-sm`}>
              <h2 className="border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:text-slate-500">
                Problem Details
              </h2>
              {problem.sdlcPhase && (
                <Row
                  label="SDLC Phase"
                  value={SDLC_LABELS[problem.sdlcPhase]}
                />
              )}
              <Row label="Category" value={problem.category?.name ?? "—"} />
              <Row
                label="Views"
                value={(problem.viewCount ?? 0).toLocaleString()}
              />
              <Row label="Posted" value={formatDate(problem.createdAt)} />
              <Row label="Published" value={formatDate(problem.publishedAt)} />
            </section>

            <section className={`${CARD} p-5 text-sm`}>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Posted By
              </h2>
              <div className="flex items-center gap-3">
                {problem.author?.avatarUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={problem.author.avatarUrl}
                    alt=""
                    className="size-10 rounded-full border border-slate-200 bg-slate-100 object-cover dark:border-slate-700"
                  />
                ) : (
                  <span className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    {(problem.author?.fullName || "?")
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-slate-900 dark:text-slate-100">
                    {problem.author?.fullName ?? "Unknown author"}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {(problem.author?.reputation ?? 0).toLocaleString()}{" "}
                    reputation
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
        {value}
      </span>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading the problem"
      className="min-h-screen animate-pulse bg-[#F8FAFC] pb-16 dark:bg-slate-950"
    >
      <span className="sr-only">Loading the problem…</span>
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-5 w-44 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="space-y-6 lg:col-span-3">
            <div className={`${CARD} space-y-4 p-6`}>
              <div className="h-6 w-32 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-24 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className={`${CARD} h-32`} />
          </div>
          <div className="space-y-6">
            <div className={`${CARD} h-48`} />
            <div className={`${CARD} h-28`} />
          </div>
        </div>
      </main>
    </div>
  );
}

function NotFound({
  title,
  body,
  onRetry,
}: {
  title: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 text-center text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
        <AlertCircle className="size-7" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-4 text-slate-500 dark:text-slate-400">{body}</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <RotateCcw className="size-4" />
            Try again
          </button>
        )}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="size-4" />
          Back to Community
        </Link>
      </div>
    </div>
  );
}

/** Pulls something readable out of an RTK Query error. */
function messageOf(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data) return data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message) return message;
    }
  }
  return fallback;
}
