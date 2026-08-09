"use client";

import React from "react";
import { motion } from "motion/react";
import { Check, ChevronUp, Network, Video } from "lucide-react";

import { MarkdownView } from "@/components/showcases/detail/MarkdownView";
import {
  useGetPublicProfileQuery,
  type SolutionResponse,
} from "@/lib/redux/services/solutionsApi";
import {
  useGetVoteSummaryQuery,
  useRemoveVoteMutation,
  useSetVoteMutation,
} from "@/lib/redux/services/votesApi";

/**
 * One answer on a problem, straight off `SolutionResponse`.
 *
 * That response is thin: a description, an optional video and diagram link,
 * and a review status. It carries no vote count and names its author by id
 * only, so both are fetched here — the score from the vote endpoint, the name
 * from the author's public profile.
 */

interface SolutionCardProps {
  solution: SolutionResponse;
  index: number;
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export const SolutionCard: React.FC<SolutionCardProps> = ({
  solution,
  index,
}) => {
  const { data: author } = useGetPublicProfileQuery(solution.authorId, {
    skip: !solution.authorId,
  });

  const { data: votes } = useGetVoteSummaryQuery({
    type: "SOLUTION",
    targetId: solution.id,
  });

  const [setVote, { isLoading: isSettingVote }] = useSetVoteMutation();
  const [removeVote, { isLoading: isRemovingVote }] = useRemoveVoteMutation();
  const isVoting = isSettingVote || isRemovingVote;

  const hasUpvoted = votes?.currentUserVote === 1;
  const isAccepted = solution.reviewStatus === "ACCEPTED";
  const name = author?.fullName || "Unknown author";

  const toggleVote = async () => {
    if (isVoting) return;
    const target = { type: "SOLUTION" as const, targetId: solution.id };
    // The summary is refetched by the mutation's tag, so nothing is held here.
    if (hasUpvoted) await removeVote(target);
    else await setVote({ ...target, value: 1 });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
      className={`rounded-2xl border bg-white p-5 shadow-xs dark:bg-slate-900 ${
        isAccepted
          ? "border-emerald-300 dark:border-emerald-500/40"
          : "border-slate-200/80 dark:border-slate-800"
      }`}
    >
      <div className="flex gap-4">
        {/* Vote rail */}
        <div className="flex shrink-0 flex-col items-center gap-1">
          <button
            type="button"
            onClick={() => void toggleVote()}
            disabled={isVoting}
            aria-pressed={hasUpvoted}
            aria-label={hasUpvoted ? "Remove upvote" : "Upvote this answer"}
            className={`cursor-pointer rounded-lg p-1.5 transition-colors disabled:opacity-50 ${
              hasUpvoted
                ? "bg-blue-600 text-white"
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <ChevronUp className="size-4" />
          </button>
          <span className="text-sm font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {votes?.score ?? 0}
          </span>
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {author?.avatarUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={author.avatarUrl}
                  alt=""
                  className="size-8 rounded-full border border-slate-200 bg-slate-100 object-cover dark:border-slate-700"
                />
              ) : (
                <span className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                  {initialsOf(name)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
                  {name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {author?.reputation !== undefined
                    ? `${author.reputation.toLocaleString()} reputation · `
                    : ""}
                  {formatDate(solution.createdAt)}
                </p>
              </div>
            </div>

            {isAccepted && (
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                <Check className="size-3.5" />
                Accepted
              </span>
            )}
          </div>

          <MarkdownView source={solution.description ?? ""} />

          {(solution.videoUrl || solution.diagramUrl) && (
            <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              {solution.videoUrl && (
                <SolutionLink
                  href={solution.videoUrl}
                  label="Walkthrough video"
                  icon={<Video className="size-3.5" />}
                />
              )}
              {solution.diagramUrl && (
                <SolutionLink
                  href={solution.diagramUrl}
                  label="Diagram"
                  icon={<Network className="size-3.5" />}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
};

function SolutionLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex h-8 items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
    >
      {icon}
      {label}
    </a>
  );
}
