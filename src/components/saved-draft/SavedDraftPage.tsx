"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import { SavedDraftEmptyState } from "@/components/saved-draft/SavedDraftEmptyState";
import { SavedDraftGrid } from "@/components/saved-draft/SavedDraftGrid";
import { SavedDraftHeader } from "@/components/saved-draft/SavedDraftHeader";
import {
  SAVED_DRAFT_ITEMS,
  SAVED_DRAFT_TAB_ORDER,
} from "@/components/saved-draft/mock-data";
import { SavedDraftPagination } from "@/components/saved-draft/SavedDraftPagination";
import { SavedDraftSearch } from "@/components/saved-draft/SavedDraftSearch";
import { SavedDraftTabs } from "@/components/saved-draft/SavedDraftTabs";
import {
  pageEnterContainer,
  pageEnterItem,
} from "@/components/ui/page-enter-motion";
import type { DraftCategory, SavedDraftItem } from "@/components/saved-draft/types";

const ITEMS_PER_PAGE = 6;

const SEARCH_PLACEHOLDERS: Record<DraftCategory, string> = {
  problem: "Search saved drafts...",
  solution: "Search saved drafts...",
  program: "Search saved drafts...",
  report: "Search saved drafts...",
};

function getUpdatedRank(updatedAt: string) {
  if (updatedAt === "Today") return 0;
  if (updatedAt === "Yesterday") return 1;

  const hourMatch = updatedAt.match(/(\d+)\s+hour/);
  if (hourMatch) {
    return Number(hourMatch[1]) / 24;
  }

  const dayMatch = updatedAt.match(/(\d+)\s+day/);
  if (dayMatch) {
    return Number(dayMatch[1]);
  }

  return 30;
}

export function SavedDraftPage() {
  const [draftItems, setDraftItems] = useState<SavedDraftItem[]>(SAVED_DRAFT_ITEMS);
  const [activeTab, setActiveTab] = useState<DraftCategory>("problem");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "title">("recent");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, 320);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const counts = useMemo(() => {
    return SAVED_DRAFT_TAB_ORDER.reduce(
      (accumulator, category) => {
        accumulator[category] = draftItems.filter(
          (item) => item.category === category
        ).length;
        return accumulator;
      },
      {
        problem: 0,
        solution: 0,
        program: 0,
        report: 0,
      } as Record<DraftCategory, number>
    );
  }, [draftItems]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return draftItems
      .filter((item) => {
        if (item.category !== activeTab) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        return [item.title, item.description, item.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(normalizedSearch);
      })
      .sort((a, b) => {
        if (sortBy === "title") {
          return a.title.localeCompare(b.title);
        }

        const diff = getUpdatedRank(a.updatedAt) - getUpdatedRank(b.updatedAt);
        return sortBy === "recent" ? diff : -diff;
      });
  }, [activeTab, draftItems, searchTerm, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = filteredItems.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageEnterContainer}
      className="mx-auto w-full max-w-[1400px] space-y-5 pb-12"
    >
      <motion.div variants={pageEnterItem}>
        <SavedDraftHeader totalDrafts={draftItems.length} />
      </motion.div>

      <motion.div variants={pageEnterItem} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="space-y-4">
          <SavedDraftTabs
            activeTab={activeTab}
            counts={counts}
            onChange={(category) => {
              setActiveTab(category);
              setCurrentPage(1);
            }}
          />
          <SavedDraftSearch
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
            placeholder={SEARCH_PLACEHOLDERS[activeTab]}
            sortBy={sortBy}
            onSortChange={setSortBy}
            resultCount={filteredItems.length}
          />
        </div>
      </motion.div>

      {isLoading ? (
        <motion.div variants={pageEnterItem}>
          <SavedDraftGrid items={[]} isLoading />
        </motion.div>
      ) : paginatedItems.length > 0 ? (
        <motion.div variants={pageEnterItem} className="space-y-5">
          <SavedDraftGrid
            items={paginatedItems}
            onDelete={(itemId) => {
              setDraftItems((current) => current.filter((item) => item.id !== itemId));
              setCurrentPage(1);
            }}
          />

          <SavedDraftPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      ) : (
        <motion.div variants={pageEnterItem}>
          <SavedDraftEmptyState
            activeTab={activeTab}
            searchTerm={searchTerm}
            onClear={() => setSearchTerm("")}
          />
        </motion.div>
      )}
    </motion.section>
  );
}
