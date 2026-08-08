"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Code2,
  ExternalLink,
  Eye,
  Flag,
  LayoutTemplate,
  MessageSquare,
  Network,
  Send,
  Share2,
  Terminal,
} from "lucide-react";

import { MarkdownView } from "@/components/showcases/detail/MarkdownView";
import {
  useCreateCommentMutation,
  useGetCommentsQuery,
} from "@/lib/redux/services/commentsApi";
import {
  useGetShowcaseByIdQuery,
  useGetShowcaseStepsQuery,
  useIncrementShowcaseViewsMutation,
  type ShowcaseStepResponse,
} from "@/lib/redux/services/showcasesApi";
import {
  useGetVoteSummaryQuery,
  useRemoveVoteMutation,
  useSetVoteMutation,
} from "@/lib/redux/services/votesApi";
import { cn } from "@/lib/utils";

/**
 * A showcase in full, laid out the way `ProblemDetailPage` lays out its
 * showcase view: the title card with the vote box, the three showcase tabs,
 * the comment thread, and the metadata / links / posted-by sidebar.
 *
 * The difference is the data. Everything here is the real record —
 * `GET /showcases/{id}` and its steps, `/votes/SHOWCASE/{id}` for the score,
 * `/comments` for the thread — where the problem page reads a mock store.
 */

interface ShowcaseDetailProps {
  id: string;
}

const CARD =
  "rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs";

const SIDEBAR_HEADING =
  "font-bold uppercase tracking-wider text-xs text-slate-400 dark:text-slate-500";

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

function relativeTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  const minutes = Math.round((Date.now() - date.getTime()) / 60_000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}h ago`;
  return formatDate(iso);
}

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

export function ShowcaseDetail({ id }: ShowcaseDetailProps) {
  const { data: showcase, isLoading } = useGetShowcaseByIdQuery(id);

  /* The showcase response carries its steps; the dedicated endpoint is the
     fallback for when it comes back without them. */
  const embeddedSteps = showcase?.steps;
  const { data: fetchedSteps } = useGetShowcaseStepsQuery(id, {
    skip: !showcase || (embeddedSteps?.length ?? 0) > 0,
  });

  const steps: ShowcaseStepResponse[] = [
    ...(embeddedSteps?.length ? embeddedSteps : (fetchedSteps ?? [])),
  ].sort((a, b) => a.stepNumber - b.stepNumber);

  const [showcaseTab, setShowcaseTab] = useState<
    "overview" | "diagram" | "code"
  >("overview");

  /* ── Votes ── */
  const { data: votes } = useGetVoteSummaryQuery({
    type: "SHOWCASE",
    targetId: id,
  });
  const [setVote] = useSetVoteMutation();
  const [removeVote] = useRemoveVoteMutation();

  const score = votes?.score ?? 0;
  const myVote = votes?.currentUserVote ?? 0;

  const vote = async (value: 1 | -1) => {
    try {
      if (myVote === value) {
        await removeVote({ type: "SHOWCASE", targetId: id }).unwrap();
      } else {
        await setVote({ type: "SHOWCASE", targetId: id, value }).unwrap();
      }
    } catch {
      /* Signed out, or the vote was rejected. The count stays as the server
         last reported it rather than drifting to an optimistic value. */
    }
  };

  /* ── Comments ── */
  const { data: commentPage } = useGetCommentsQuery({
    commentableType: "SHOWCASE",
    commentableId: id,
    pageSize: 50,
  });
  const [createComment, { isLoading: isPosting }] = useCreateCommentMutation();
  const [draft, setDraft] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);

  const comments = commentPage?.content ?? [];

  const submitComment = async (event: React.FormEvent) => {
    event.preventDefault();
    const content = draft.trim();
    if (!content || isPosting) return;

    try {
      await createComment({
        commentableType: "SHOWCASE",
        commentableId: id,
        content,
      }).unwrap();
      setDraft("");
      setCommentError(null);
    } catch (error) {
      setCommentError(
        messageOf(
          error,
          "Your comment could not be posted. Are you signed in?",
        ),
      );
    }
  };

  /* Counted once per mount, not per render. */
  const [incrementViews] = useIncrementShowcaseViewsMutation();
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    void incrementViews(id);
  }, [id, incrementViews]);

  if (isLoading) return <DetailSkeleton />;

  if (!showcase) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center text-slate-800 dark:text-slate-100">
        <h1 className="text-2xl font-bold mb-2">Showcase Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          It may have been removed, or it is still waiting on review.
        </p>
        <Link
          href="/showcases"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Showcases</span>
        </Link>
      </div>
    );
  }

  const diagrams = steps.filter((step) => step.diagramUrl);
  const snippets = steps.filter((step) => step.codeSnippet);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-16"
    >
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/showcases"
          className="inline-flex items-center space-x-2 text-base font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Showcases</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Main Title Header Card */}
            <div className={`${CARD} p-6`}>
              <div className="flex items-center space-x-2 mb-3">
                <span className="inline-flex items-center space-x-1.5 rounded-full bg-blue-100 dark:bg-blue-500/15 px-3 py-1 text-xs font-bold text-blue-700 dark:text-blue-300">
                  <LayoutTemplate className="h-3.5 w-3.5" />
                  <span>Showcase</span>
                </span>

                {showcase.categoryName && (
                  <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {showcase.categoryName}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                  {showcase.title}
                </h1>

                {/* Real votes: `PUT`/`DELETE /votes/SHOWCASE/{id}`, with the
                    caller's own vote lighting the arrow it belongs to. */}
                <div className="flex items-center space-x-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => void vote(1)}
                    aria-label={myVote === 1 ? "Remove upvote" : "Upvote"}
                    aria-pressed={myVote === 1}
                    className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                      myVote === 1
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 px-1.5 tabular-nums">
                    {score}
                  </span>
                  <button
                    type="button"
                    onClick={() => void vote(-1)}
                    aria-label={myVote === -1 ? "Remove downvote" : "Downvote"}
                    aria-pressed={myVote === -1}
                    className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                      myVote === -1
                        ? "bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900"
                        : "text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700"
                    }`}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {showcase.coverImageUrl && (
                <div className="mt-5">
                  {/* Contained, not cropped to fill: covers arrive at whatever
                      size the author uploaded — often small and square — and
                      stretching one across a banner is what makes it look
                      soft. The frame caps the height so a tall upload cannot
                      push the overview and tabs off the screen. */}
                  <ShowcaseImage
                    url={showcase.coverImageUrl}
                    alt={`${showcase.title} cover`}
                    heightClassName="h-52 sm:h-64 lg:h-72"
                  />
                </div>
              )}

              <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  Project Overview
                </h3>
                <MarkdownView source={showcase.overview} />
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    className="flex items-center space-x-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                  >
                    <Bookmark className="h-4 w-4" />
                    <span>Bookmark</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-1.5 rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg"
                  >
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs for Showcase Features */}
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              <TabButton
                active={showcaseTab === "overview"}
                onClick={() => setShowcaseTab("overview")}
              >
                <Terminal className="h-4 w-4" />
                <span>Steps &amp; Implementation</span>
              </TabButton>
              <TabButton
                active={showcaseTab === "diagram"}
                onClick={() => setShowcaseTab("diagram")}
              >
                <Network className="h-4 w-4" />
                <span>Architecture Diagram</span>
              </TabButton>
              <TabButton
                active={showcaseTab === "code"}
                onClick={() => setShowcaseTab("code")}
              >
                <Code2 className="h-4 w-4" />
                <span>Key Code Snippet</span>
              </TabButton>
            </div>

            {/* Tab 1: Steps & Implementation */}
            {showcaseTab === "overview" && (
              <div className={`${CARD} p-6 space-y-4`}>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                  <Terminal className="h-4 w-4 text-blue-600" />
                  <span>Implementation Flow</span>
                </h3>

                {steps.length === 0 ? (
                  <EmptyTab>This showcase has no build steps yet.</EmptyTab>
                ) : (
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div
                        key={step.id}
                        className="flex gap-3 items-start bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-sm"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                          {index + 1}
                        </span>
                        <div className="min-w-0 flex-1 space-y-2">
                          <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                            {step.title}
                          </p>
                          <MarkdownView source={step.description} />
                          {step.imageUrl && (
                            <ShowcaseImage
                              url={step.imageUrl}
                              alt={`${step.title} screenshot`}
                              heightClassName="h-48 sm:h-56"
                              sizes="(max-width: 1024px) 90vw, 720px"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Architecture Diagram */}
            {showcaseTab === "diagram" && (
              <div className={`${CARD} p-6`}>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                  <Network className="h-4 w-4 text-blue-600" />
                  <span>Architecture &amp; Flow Diagrams</span>
                </h3>

                {diagrams.length === 0 ? (
                  <EmptyTab>
                    No diagrams were attached to this build guide.
                  </EmptyTab>
                ) : (
                  <div className="space-y-5">
                    {diagrams.map((step) => (
                      <figure key={step.id} className="space-y-2">
                        <figcaption className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Step {steps.indexOf(step) + 1} · {step.title}
                        </figcaption>
                        <div className="rounded-xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-3">
                          {/* Taller than a screenshot: a diagram is the thing
                              being read, and its labels have to stay legible. */}
                          <ShowcaseImage
                            url={step.diagramUrl as string}
                            alt={`${step.title} diagram`}
                            heightClassName="h-64 sm:h-80"
                            framed={false}
                          />
                        </div>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Code Snippet */}
            {showcaseTab === "code" && (
              <div className={`${CARD} p-6`}>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                  <Code2 className="h-4 w-4 text-blue-600" />
                  <span>Core Logic / Implementation Code</span>
                </h3>

                {snippets.length === 0 ? (
                  <EmptyTab>
                    No code snippets were attached to this build guide.
                  </EmptyTab>
                ) : (
                  <div className="space-y-5">
                    {snippets.map((step) => (
                      <div key={step.id} className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Step {steps.indexOf(step) + 1} · {step.title}
                        </p>
                        <pre className="rounded-xl bg-slate-900 p-4 text-sm font-mono text-blue-300 overflow-x-auto leading-relaxed">
                          {step.codeSnippet}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Comments Thread */}
            <div className={`${CARD} p-6`}>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
                <MessageSquare className="h-4 w-4 text-slate-500" />
                <span>Comments ({commentPage?.totalElements ?? 0})</span>
              </h3>

              <div className="space-y-3 mb-4">
                {comments.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No comments yet — be the first to give the author feedback.
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="text-sm text-slate-600 dark:text-slate-300 flex items-start space-x-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800"
                    >
                      <CommentAvatar
                        name={comment.authorName}
                        url={comment.authorAvatarUrl}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3 mb-1">
                          <span className="font-bold text-slate-800 dark:text-slate-100 truncate">
                            {comment.authorName}
                          </span>
                          <span className="text-xs text-slate-400 shrink-0">
                            {relativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <form
                onSubmit={(event) => void submitComment(event)}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={draft}
                  maxLength={5000}
                  onChange={(event) => {
                    setDraft(event.target.value);
                    if (commentError) setCommentError(null);
                  }}
                  placeholder="Share feedback on this showcase..."
                  className="flex-1 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isPosting || !draft.trim()}
                  className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {commentError && (
                <p className="mt-2 text-sm font-medium text-rose-600">
                  {commentError}
                </p>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className={`${CARD} p-5 space-y-3.5 text-sm`}>
              <h3
                className={`${SIDEBAR_HEADING} border-b border-slate-100 dark:border-slate-800 pb-2`}
              >
                Showcase Metadata
              </h3>
              <SidebarRow
                label="Category"
                value={showcase.categoryName ?? "—"}
              />
              <SidebarRow
                label="Views"
                value={showcase.viewCount.toLocaleString()}
              />
              <SidebarRow label="Steps" value={String(steps.length)} />
              <SidebarRow
                label="Posted"
                value={formatDate(showcase.createdAt)}
              />
            </div>

            {(showcase.repoUrl || showcase.liveUrl || showcase.videoUrl) && (
              <div className={`${CARD} p-5 text-sm space-y-3`}>
                <h3 className={SIDEBAR_HEADING}>Project Links</h3>
                {showcase.repoUrl && (
                  <ProjectLink href={showcase.repoUrl} label="Repository" />
                )}
                {showcase.liveUrl && (
                  <ProjectLink href={showcase.liveUrl} label="Live Demo" />
                )}
                {showcase.videoUrl && (
                  <ProjectLink href={showcase.videoUrl} label="Walkthrough" />
                )}
              </div>
            )}

            <div className={`${CARD} p-5 text-sm`}>
              <h3 className={`${SIDEBAR_HEADING} mb-3`}>Posted By</h3>
              <div className="flex items-center space-x-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  {initialsOf(showcase.authorName)}
                </span>
                <div className="min-w-0">
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                    {showcase.authorName}
                  </p>
                  <p className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <Eye className="h-3 w-3" />
                    {showcase.viewCount.toLocaleString()} views on this project
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
        active
          ? "bg-blue-600 text-white shadow-xs"
          : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyTab({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800/40 dark:text-slate-400">
      {children}
    </p>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-slate-500 dark:text-slate-400">
        {label}
      </span>
      <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
        {value}
      </span>
    </div>
  );
}

function ProjectLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/60 dark:hover:bg-slate-800"
    >
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <ExternalLink className="h-4 w-4 text-slate-400" />
    </a>
  );
}

/**
 * `next/image` only accepts hosts allowed in `next.config.ts`, which covers
 * every `https` host. An author who pasted an `http` or `data:` URL would make
 * the component throw during render, so those keep the plain tag.
 */
function isOptimizable(url: string) {
  return url.startsWith("https://") || url.startsWith("/");
}

/**
 * One bounded, uncropped image.
 *
 * `object-contain` inside a fixed-height box rather than `object-cover`: a
 * screenshot or a diagram is read, and cropping one to fill a frame cuts off
 * the part being explained. The height cap keeps a tall portrait screenshot
 * from running the page, and `sizes` tells the optimizer to serve roughly what
 * is on screen — twice that on a retina display — so nothing looks soft.
 */
function ShowcaseImage({
  url,
  alt,
  /** Tailwind height classes for the frame. */
  heightClassName = "h-64 sm:h-72",
  sizes = "(max-width: 1024px) 100vw, 860px",
  framed = true,
}: {
  url: string;
  alt: string;
  heightClassName?: string;
  sizes?: string;
  framed?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  const frame = cn(
    "relative w-full overflow-hidden",
    heightClassName,
    framed &&
      "rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900",
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      title="Open the full-size image"
      className={cn(frame, "block transition-opacity hover:opacity-95")}
    >
      {isOptimizable(url) ? (
        /* q=90 rather than the default 75: these are screenshots and diagrams,
           where compression artefacts land on text. `next.config.ts` has to
           list the quality or the optimizer answers 400. */
        <Image
          src={url}
          alt={alt}
          fill
          sizes={sizes}
          quality={90}
          onError={() => setFailed(true)}
          className="object-contain"
        />
      ) : (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={url}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-contain"
        />
      )}
    </a>
  );
}

function CommentAvatar({ name, url }: { name: string; url?: string }) {
  const [failed, setFailed] = useState(false);

  if (url && !failed && isOptimizable(url)) {
    return (
      <Image
        src={url}
        alt={name}
        width={32}
        height={32}
        onError={() => setFailed(true)}
        className="h-8 w-8 shrink-0 rounded-full bg-slate-200 object-cover dark:bg-slate-700"
      />
    );
  }

  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-200">
      {initialsOf(name)}
    </span>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16 dark:bg-slate-950">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div
          role="status"
          aria-label="Loading showcase"
          className="grid animate-pulse grid-cols-1 gap-8 lg:grid-cols-4"
        >
          <span className="sr-only">Loading showcase…</span>
          <div className="space-y-6 lg:col-span-3">
            <div className={`${CARD} space-y-4 p-6`}>
              <div className="h-6 w-28 rounded-full bg-slate-200 dark:bg-slate-800" />
              <div className="h-8 w-3/4 rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="aspect-[16/7] w-full rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
              <div className="h-4 w-4/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="flex gap-2">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-10 w-44 rounded-xl bg-slate-200 dark:bg-slate-800"
                />
              ))}
            </div>
            <div className={`${CARD} space-y-3 p-6`}>
              <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-16 rounded-xl bg-slate-200 dark:bg-slate-800" />
            </div>
          </div>
          <div className="space-y-6">
            {[0, 1].map((index) => (
              <div key={index} className={`${CARD} space-y-3 p-5`}>
                <div className="h-4 w-32 rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-full rounded bg-slate-200 dark:bg-slate-800" />
                <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-slate-800" />
              </div>
            ))}
          </div>
        </div>
      </main>
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
