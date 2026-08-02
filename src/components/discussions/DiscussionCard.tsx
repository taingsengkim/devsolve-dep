"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { DiscussionPost } from "@/lib/types/dicussion/types";
import {
  ChevronUp,
  MessageSquare,
  Eye,
  Bookmark,
  CheckCircle2,
  CircleDot,
} from "lucide-react";
import {
  useVoteDiscussionMutation,
  useBookmarkDiscussionMutation,
} from "@/lib/redux/services/discussionsApi";

interface DiscussionCardProps {
  post: DiscussionPost;
  index?: number;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({ post, index = 0 }) => {
  const [voteDiscussion, { isLoading: isVoting }] = useVoteDiscussionMutation();
  const [bookmarkDiscussion] = useBookmarkDiscussionMutation();

  const [localVotes, setLocalVotes] = useState(post.votes);
  const [localUpvoted, setLocalUpvoted] = useState(post.isUpvoted ?? false);
  const [localBookmarked, setLocalBookmarked] = useState(post.isBookmarked ?? false);

  const handleVote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isVoting) return;
    // Optimistic update
    setLocalVotes((v) => (localUpvoted ? v - 1 : v + 1));
    setLocalUpvoted((v) => !v);
    await voteDiscussion({ id: post.id });
  };

  const handleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalBookmarked((v) => !v);
    await bookmarkDiscussion({ id: post.id });
  };

  const isShowcase = post.category === "Showcase";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.06 }}
      whileHover={{ y: -2 }}
    >
      <Link
        href={`/discussions/${post.id}`}
        className="block group"
        aria-label={post.title}
      >
        <article className="flex gap-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-xs transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md">

          {/* ── Vote Pillar ────────────────────────────────────────────────── */}
          <div className="flex flex-col items-center shrink-0">
            <button
              onClick={handleVote}
              disabled={isVoting}
              aria-label={localUpvoted ? "Remove upvote" : "Upvote"}
              className={`flex flex-col items-center justify-center rounded-xl px-3 py-2.5 transition-colors disabled:opacity-60 ${
                localUpvoted
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <ChevronUp className="size-4 stroke-[2.5]" />
              <span className="text-sm font-bold mt-0.5 tabular-nums">{localVotes}</span>
            </button>
          </div>

          {/* ── Main Content ───────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            {/* Title + topic badge */}
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {post.title}
              </h3>
              <span className="shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                {post.topic}
              </span>
            </div>

            {/* Showcase thumbnail + description */}
            {isShowcase && post.thumbnailUrl ? (
              <div className="mt-3 flex gap-4 items-start">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="h-28 w-40 object-cover rounded-xl border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <p className="text-base text-slate-700 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {post.description}
                </p>
              </div>
            ) : (
              <p className="mt-2 text-base text-slate-700 dark:text-slate-300 leading-relaxed line-clamp-2">
                {post.description}
              </p>
            )}

            {/* Tags / tech stack chips */}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {isShowcase && post.techStack
                ? post.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200/60 dark:border-purple-800/60 px-2.5 py-1 text-xs font-mono font-medium text-purple-800 dark:text-purple-300"
                    >
                      {tech}
                    </span>
                  ))
                : post.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 px-2.5 py-1 text-xs font-mono font-medium text-slate-700 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
            </div>

            {/* Footer metadata */}
            <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 gap-2">
              {/* Left: stats + status */}
              <div className="flex items-center gap-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="size-4 text-slate-500 dark:text-slate-400" />
                  <span>{post.answersCount} {isShowcase ? "comments" : "answers"}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="size-4 text-slate-500 dark:text-slate-400" />
                  <span>{post.viewsCount.toLocaleString()}</span>
                </span>
                {post.status && (
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      post.status === "Solved"
                        ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                        : "bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300"
                    }`}
                  >
                    {post.status === "Solved" ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <CircleDot className="size-3.5" />
                    )}
                    <span>{post.status}</span>
                  </span>
                )}
              </div>

              {/* Right: author + date + bookmark */}
              <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <img
                    src={post.author.avatarUrl}
                    alt={post.author.name}
                    className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  />
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {post.author.name}
                  </span>
                </div>
                <span>·</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{post.createdAt}</span>
                <button
                  onClick={handleBookmark}
                  aria-label={localBookmarked ? "Remove bookmark" : "Bookmark"}
                  className={`transition-colors p-1 ${
                    localBookmarked
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  }`}
                >
                  <Bookmark
                    className={`size-4 ${localBookmarked ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
};