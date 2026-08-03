"use client";

import React from "react";
import { motion } from "motion/react";
import { Hash, TrendingUp, BarChart3, Tag } from "lucide-react";
import type { TopicCount } from "@/lib/types/dicussion/types";
import type { DiscussionStats } from "@/lib/redux/services/discussionsApi";
import type { TopicFilter } from "@/lib/types/dicussion/types";

// ── Topics Widget ─────────────────────────────────────────────────────────────

interface DiscussionTopicsWidgetProps {
  topics: TopicCount[];
  selectedTopic: TopicFilter | null;
  onSelectTopic: (t: TopicFilter | null) => void;
  isLoading?: boolean;
}

function DiscussionTopicsWidget({
  topics,
  selectedTopic,
  onSelectTopic,
  isLoading,
}: DiscussionTopicsWidgetProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <BarChart3 className="size-4 text-blue-600" />
          </div>
          <h3 className="text-base font-bold text-slate-900">All Topics</h3>
        </div>
        <span className="text-sm text-slate-600 font-bold">
          {topics.reduce((a, b) => a + b.count, 0)}
        </span>
      </div>
      <div className="space-y-1">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-9 rounded-xl bg-slate-100 animate-pulse" />
            ))
          : topics.map((topic) => {
              const isActive = selectedTopic === topic.name;
              const maxCount = Math.max(...topics.map((t) => t.count));
              const pct = Math.round((topic.count / maxCount) * 100);
              return (
                <button
                  key={topic.name}
                  id={`topic-${topic.name.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => onSelectTopic(isActive ? null : topic.name)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-base font-semibold transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <span>{topic.name}</span>
                  <div className="flex items-center gap-2">
                    {!isActive && (
                      <div className="w-12 h-1.5 rounded-full bg-slate-200 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-blue-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    )}
                    <span className={`text-sm font-bold tabular-nums ${isActive ? "text-blue-100" : "text-slate-600"}`}>
                      {topic.count}
                    </span>
                  </div>
                </button>
              );
            })}
      </div>
    </div>
  );
}

// ── Tags Widget ───────────────────────────────────────────────────────────────

interface DiscussionTagsWidgetProps {
  tags: string[];
  selectedTag: string | null;
  onSelectTag: (t: string | null) => void;
  isLoading?: boolean;
}

function DiscussionTagsWidget({
  tags,
  selectedTag,
  onSelectTag,
  isLoading,
}: DiscussionTagsWidgetProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-8 rounded-lg bg-violet-50 flex items-center justify-center">
          <TrendingUp className="size-4 text-violet-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Trending Tags</h3>
      </div>
      {isLoading ? (
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="h-7 w-16 rounded-lg bg-slate-100 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isActive = selectedTag === tag;
            return (
              <motion.button
                key={tag}
                id={`tag-${tag.replace("#", "")}`}
                onClick={() => onSelectTag(isActive ? null : tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-lg px-3 py-1 text-sm font-mono font-semibold transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs font-bold"
                    : "bg-slate-100 border border-slate-200/60 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                {tag}
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Stats Widget ──────────────────────────────────────────────────────────────

interface DiscussionStatsWidgetProps {
  stats?: DiscussionStats;
  isLoading?: boolean;
}

function DiscussionStatsWidget({ stats, isLoading }: DiscussionStatsWidgetProps) {
  const metrics = [
    { label: "Problems", value: stats?.problems ?? 0 },
    { label: "Solutions", value: stats?.solutions ?? 0 },
    { label: "Researchers", value: stats?.researchers ?? 0 },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center">
          <Hash className="size-4 text-emerald-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Platform Stats</h3>
      </div>
      <div className="space-y-3 divide-y divide-slate-100">
        {metrics.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center pt-3 first:pt-0">
            <span className="text-base text-slate-700 font-medium">{label}</span>
            {isLoading ? (
              <div className="h-5 w-14 rounded bg-slate-100 animate-pulse" />
            ) : (
              <span className="text-base font-extrabold text-blue-600 tabular-nums">
                {value.toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Exported Composite Sidebar ────────────────────────────────────────────────

interface DiscussionSidebarProps {
  topics: TopicCount[];
  tags: string[];
  stats?: DiscussionStats;
  selectedTopic: TopicFilter | null;
  selectedTag: string | null;
  onSelectTopic: (t: TopicFilter | null) => void;
  onSelectTag: (t: string | null) => void;
  isLoadingTopics?: boolean;
  isLoadingTags?: boolean;
  isLoadingStats?: boolean;
}

export function DiscussionSidebar({
  topics,
  tags,
  stats,
  selectedTopic,
  selectedTag,
  onSelectTopic,
  onSelectTag,
  isLoadingTopics,
  isLoadingTags,
  isLoadingStats,
}: DiscussionSidebarProps) {
  return (
    <aside className="space-y-5">
      <DiscussionTopicsWidget
        topics={topics}
        selectedTopic={selectedTopic}
        onSelectTopic={onSelectTopic}
        isLoading={isLoadingTopics}
      />
      <DiscussionTagsWidget
        tags={tags}
        selectedTag={selectedTag}
        onSelectTag={onSelectTag}
        isLoading={isLoadingTags}
      />
      <DiscussionStatsWidget stats={stats} isLoading={isLoadingStats} />

      {/* Dark CTA Card */}
      <div className="rounded-2xl bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 text-white p-5 shadow-md">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="size-4 text-blue-300" />
          <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">
            Contribute
          </span>
        </div>
        <p className="text-base font-bold text-white mb-1">
          Share your findings
        </p>
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          Post a problem, showcase a project, or help others solve security challenges.
        </p>
        <a
          href="/discussions/create"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2.5 text-sm font-bold text-white border border-white/20 transition-colors"
        >
          Start a post
        </a>
      </div>
    </aside>
  );
}
