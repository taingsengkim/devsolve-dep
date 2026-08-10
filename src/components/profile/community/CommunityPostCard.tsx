"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ChevronUp, Eye, MessageSquare } from "lucide-react";
import { CommunityPost } from "@/lib/types/profile/types";

interface CommunityPostCardProps {
  post: CommunityPost;
}

const TAG_STYLES: Record<CommunityPost["tag"], string> = {
  Problem: "border border-red-100 bg-red-50 text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300",
  Solutions: "border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
  Showcase: "border border-blue-100 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300",
};

const TAG_LABELS: Record<CommunityPost["tag"], string> = {
  Problem: "Problem",
  Solutions: "Solution",
  Showcase: "Showcase",
};

const STATUS_STYLES: Record<"positive" | "pending", string> = {
  positive: "border border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-300",
  pending: "border border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300",
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function CommunityPostCard({ post }: CommunityPostCardProps) {
  const body = (
    <div className="flex items-start gap-4">
      <div className="flex w-8 shrink-0 flex-col items-center gap-0.5 pt-1 text-blue-600">
        <ChevronUp size={18} />
        <span className="text-sm font-semibold tabular-nums">{post.votes}</span>
      </div>

      {/* Only a showcase carries a cover, and it is what makes it recognisable
          in a list of otherwise text-only posts. */}
      {post.thumbnailUrl && (
        <div className="relative hidden h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:block dark:border-neutral-700 dark:bg-neutral-800">
          <Image
            src={post.thumbnailUrl}
            alt=""
            fill
            quality={90}
            sizes="128px"
            className="object-cover"
          />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-slate-900 dark:text-neutral-100">
            {post.title}
          </h3>
          <span
            className={`shrink-0 rounded-lg px-2.5 py-0.5 text-xs font-semibold ${TAG_STYLES[post.tag]}`}
          >
            {TAG_LABELS[post.tag]}
          </span>
        </div>

        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
          {post.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-400 dark:text-neutral-500">
          {post.answers !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <MessageSquare size={14} />
              {post.answers} {post.answers === 1 ? "answer" : "answers"}
            </span>
          )}
          {post.views !== undefined && (
            <span className="inline-flex items-center gap-1.5">
              <Eye size={14} />
              {post.views.toLocaleString()}
            </span>
          )}
          {post.status && (
            <span
              className={`rounded-lg px-2 py-0.5 font-semibold ${STATUS_STYLES[post.status.tone]}`}
            >
              {post.status.label}
            </span>
          )}
          <span className="ml-auto">{formatDate(post.date)}</span>
        </div>
      </div>
    </div>
  );

  const surface =
    "block rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs dark:border-neutral-800 dark:bg-neutral-900";

  return (
    <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.15 }}>
      {post.href ? (
        <Link href={post.href} className={surface}>
          {body}
        </Link>
      ) : (
        <div className={surface}>{body}</div>
      )}
    </motion.div>
  );
}
