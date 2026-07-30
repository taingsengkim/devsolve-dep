"use client";

import { useMemo, useState } from "react";
import { motion } from "motion/react";

import { SavedDraftEmptyState } from "@/components/saved-draft/SavedDraftEmptyState";
import { SavedDraftGrid } from "@/components/saved-draft/SavedDraftGrid";
import { SavedDraftHeader } from "@/components/saved-draft/SavedDraftHeader";
import { SAVED_DRAFT_ITEMS, SAVED_DRAFT_TAB_ORDER } from "@/components/saved-draft/mock-data";
import { SavedDraftPagination } from "@/components/saved-draft/SavedDraftPagination";
import { SavedDraftSearch } from "@/components/saved-draft/SavedDraftSearch";
import { SavedDraftTabs } from "@/components/saved-draft/SavedDraftTabs";
import type { DraftCategory } from "@/components/saved-draft/types";

const ITEMS_PER_PAGE = 6;

const SEARCH_PLACEHOLDERS: Record<DraftCategory, string> = {
  problem: "Search problem draft...",
  solution: "Search solution draft...",
  program: "Search program solve draft...",
};

export function SavedDraftPage() {
  const [activeTab, setActiveTab] = useState<DraftCategory>("problem");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const counts = useMemo(() => {
    return SAVED_DRAFT_TAB_ORDER.reduce(
      (accumulator, category) => {
        accumulator[category] = SAVED_DRAFT_ITEMS.filter((item) => item.category === category).length;
        return accumulator;
      },
      {
        problem: 0,
        solution: 0,
        program: 0,
      } as Record<DraftCategory, number>
    );
  }, []);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return SAVED_DRAFT_ITEMS.filter((item) => {
      if (item.category !== activeTab) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        item.title,
        item.description,
        item.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch);
    });
  }, [activeTab, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = filteredItems.slice(
    (safeCurrentPage - 1) * ITEMS_PER_PAGE,
    safeCurrentPage * ITEMS_PER_PAGE
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="space-y-6 pb-12"
    >
      <SavedDraftHeader />

      <div className="space-y-4 rounded-[32px] border border-slate-200 bg-slate-50/40 p-4 shadow-2xs sm:p-5">
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
        />
      </div>

      {paginatedItems.length > 0 ? (
        <>
          <SavedDraftGrid items={paginatedItems} />
          <SavedDraftPagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <SavedDraftEmptyState searchTerm={searchTerm} onClear={() => setSearchTerm("")} />
      )}
    </motion.section>
  );
}
