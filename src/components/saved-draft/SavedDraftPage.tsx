"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";

import { SavedDraftEmptyState } from "@/components/saved-draft/SavedDraftEmptyState";
import { SavedDraftGrid } from "@/components/saved-draft/SavedDraftGrid";
import { SavedDraftHeader } from "@/components/saved-draft/SavedDraftHeader";
import { SavedDraftPagination } from "@/components/saved-draft/SavedDraftPagination";
import { SavedDraftSearch } from "@/components/saved-draft/SavedDraftSearch";
import { SavedDraftTabs } from "@/components/saved-draft/SavedDraftTabs";
import {
  pageEnterContainer,
  pageEnterItem,
} from "@/components/ui/page-enter-motion";
import type { DraftCategory, SavedDraftItem } from "@/components/saved-draft/types";
import { useSidebarAuth } from "@/hooks/useSidebarAuth";
import { useGetMyCompanyProgramsQuery, useDeleteProgramMutation } from "@/lib/redux/services/program/programsApi";
import { toast } from "sonner";

const ITEMS_PER_PAGE = 6;

const SEARCH_PLACEHOLDERS: Record<DraftCategory, string> = {
  all: "Search all saved drafts...",
  program: "Search program drafts...",
  response: "Search response drafts...",
  report: "Search report drafts...",
};

function getUpdatedRank(updatedAt: string) {
  if (updatedAt === "Today" || updatedAt === "Recently") return 0;
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
  const { user } = useSidebarAuth();
  const userRoles = (
    user?.roles ??
    (user?.role ? user.role.split(",") : ["USER"])
  ).map((r) => r.trim().toUpperCase());

  const isCompany = userRoles.includes("COMPANY");
  const isUser = userRoles.includes("USER");

  const ALL_TABS: DraftCategory[] = ["all", "program", "response", "report"];
  const visibleTabs: DraftCategory[] = ALL_TABS.filter((tab) => {
    if ((tab === "program" || tab === "response") && isUser && !isCompany) return false;
    if (tab === "report" && isCompany && !isUser) return false;
    return true;
  });

  const [activeTab, setActiveTab] = useState<DraftCategory>(visibleTabs[0] ?? "all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"recent" | "oldest" | "title">("recent");

  // Fetch real company programs (filter by state: DRAFT)
  const { data: companyProgramsData, isLoading } =
    useGetMyCompanyProgramsQuery({ size: 100 }, { skip: !isCompany });

  const [deleteProgram] = useDeleteProgramMutation();

  // Convert real backend DRAFT items to SavedDraftItem format
  const draftItems = useMemo<SavedDraftItem[]>(() => {
    const items: SavedDraftItem[] = [];

    if (companyProgramsData?.content) {
      companyProgramsData.content
        .filter((p) => p.state === "DRAFT")
        .forEach((p) => {
          const isResponse = p.engagementType === "RESPONSE";
          const inScopeTags = p.assets
            ? p.assets
                .filter((a) => a.isInScope === true)
                .map((a) => a.identifier || "")
                .filter(Boolean)
            : p.inScopeAssets
                ?.map((a: { identifier?: string; target?: string }) => a.identifier || a.target || "")
                .filter(Boolean) ?? [];

          items.push({
            id: p.id,
            title: p.name || "Untitled Program Draft",
            description: p.description || "No description provided for this draft.",
            category: isResponse ? "response" : "program",
            programDraftKind: isResponse ? "response" : "bounty",
            updatedAt: p.updatedAt
              ? new Date(p.updatedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "Recently",
            tags: inScopeTags,
            initials: (p.name || "PR").slice(0, 2).toUpperCase(),
            logoSrc: "https://media.wired.com/photos/5926ffe47034dc5f91bed4e8/3:2/w_2560%2Cc_limit/google-logo.jpg",
            logoAlt: p.name || "Program Logo",
          });
        });
    }

    return items;
  }, [companyProgramsData]);

  // Reset activeTab if it is no longer visible
  useEffect(() => {
    if (!visibleTabs.includes(activeTab)) {
      setActiveTab(visibleTabs[0] ?? "all");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isCompany, isUser]);

  const counts = useMemo(() => {
    return {
      all: draftItems.length,
      program: draftItems.filter(
        (item) => item.category === "program" || item.programDraftKind === "bounty"
      ).length,
      response: draftItems.filter(
        (item) => item.category === "response" || item.programDraftKind === "response"
      ).length,
      report: draftItems.filter((item) => item.category === "report").length,
    };
  }, [draftItems]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return draftItems
      .filter((item) => {
        if (activeTab === "all") return true;
        if (activeTab === "program")
          return item.category === "program" || item.programDraftKind === "bounty";
        if (activeTab === "response")
          return item.category === "response" || item.programDraftKind === "response";
        if (activeTab === "report") return item.category === "report";
        return true;
      })
      .filter((item) => {
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

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteProgram(itemId).unwrap();
      toast.success("Draft deleted successfully");
    } catch {
      toast.error("Failed to delete draft");
    }
  };

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={pageEnterContainer}
      className="mx-auto w-full space-y-5 pb-12"
    >
      <motion.div variants={pageEnterItem}>
        <SavedDraftHeader totalDrafts={draftItems.length} />
      </motion.div>

      <motion.div variants={pageEnterItem} className="rounded-[24px] bg-card ring-1 ring-foreground/5 dark:ring-foreground/10 p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-6">
        <div className="space-y-4">
          <SavedDraftTabs
            activeTab={activeTab}
            counts={counts}
            onChange={(category) => {
              setActiveTab(category);
              setCurrentPage(1);
            }}
            visibleTabs={visibleTabs}
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
            onDelete={handleDeleteItem}
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
