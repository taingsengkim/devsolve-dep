"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useDiscussionFilters } from "@/hooks/useDiscussionFilters";
import { DiscussionHeader } from "@/components/discussions/DiscussionHeader";
import { DiscussionCategoryTabs } from "@/components/discussions/DiscussionCategoryTabs";
import { DiscussionCard } from "@/components/discussions/DiscussionCard";
import { DiscussionSidebar } from "@/components/discussions/DiscussionSidebar";
import { DiscussionPagination } from "@/components/discussions/DiscussionPagination";
import { DiscussionSkeleton } from "@/components/discussions/DiscussionSkeleton";
import { DiscussionEmptyState } from "@/components/discussions/DiscussionEmptyState";
import type { TopicFilter } from "@/lib/types/dicussion/types";

export default function DiscussionsPage() {
  const {
    category,
    topic,
    tag,
    searchQuery,
    page,
    limit,
    setCategory,
    setTopic,
    setTag,
    setSearchQuery,
    setPage,
    setLimit,
    resetFilters,
    discussionsResult,
    topicsResult,
    tagsResult,
    statsResult,
  } = useDiscussionFilters();

  const { data: discussions, isLoading: isLoadingFeed, isFetching } = discussionsResult;
  const { data: topics = [], isLoading: isLoadingTopics } = topicsResult;
  const { data: tags = [], isLoading: isLoadingTags } = tagsResult;
  const { data: stats, isLoading: isLoadingStats } = statsResult;

  const hasFilters = Boolean(
    category !== "All" || topic || tag || searchQuery.trim()
  );

  const isInitialLoading = isLoadingFeed && !discussions;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-[100dvh] bg-[#F8FAFC]"
    >
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-7">
        {/* ── Header (search + title + CTA) ─────────────────────────────── */}
        <DiscussionHeader
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        {/* ── Category tabs + result count ──────────────────────────────── */}
        <DiscussionCategoryTabs
          selected={category}
          onSelect={setCategory}
          totalCount={discussions?.totalCount ?? 0}
        />

        {/* ── Skeleton on initial load ───────────────────────────────────── */}
        {isInitialLoading ? (
          <DiscussionSkeleton />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* ── Feed Column ───────────────────────────────────────────── */}
            <div className="lg:col-span-3 space-y-4">
              {/* Subtle refetch overlay */}
              <div className={`transition-opacity duration-150 ${isFetching && !isInitialLoading ? "opacity-70" : "opacity-100"}`}>
                <AnimatePresence mode="wait" initial={false}>
                  {discussions?.data && discussions.data.length > 0 ? (
                    <motion.div
                      key={`${category}-${topic}-${tag}-${searchQuery}-${page}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="space-y-4"
                    >
                      {discussions.data.map((post, i) => (
                        <DiscussionCard key={post.id} post={post} index={i} />
                      ))}
                    </motion.div>
                  ) : (
                    <DiscussionEmptyState
                      onReset={resetFilters}
                      hasFilters={hasFilters}
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* ── Pagination ─────────────────────────────────────────── */}
              {discussions && discussions.totalPages > 1 && (
                <DiscussionPagination
                  page={page}
                  totalPages={discussions.totalPages}
                  limit={limit}
                  totalCount={discussions.totalCount}
                  onPageChange={setPage}
                  onLimitChange={setLimit}
                />
              )}
            </div>

            {/* ── Right Sidebar ─────────────────────────────────────────── */}
            <DiscussionSidebar
              topics={topics}
              tags={tags}
              stats={stats}
              selectedTopic={topic as TopicFilter | null}
              selectedTag={tag}
              onSelectTopic={(t) => setTopic(t as TopicFilter | null)}
              onSelectTag={setTag}
              isLoadingTopics={isLoadingTopics}
              isLoadingTags={isLoadingTags}
              isLoadingStats={isLoadingStats}
            />
          </div>
        )}
      </main>
    </motion.div>
  );
}
