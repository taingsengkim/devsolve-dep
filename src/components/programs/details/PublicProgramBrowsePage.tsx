"use client";

import React, { useMemo } from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { useGetProgramsQuery } from "@/lib/redux/services/program/programsApi";
import { useProgramFilters } from "@/hooks/useProgramFilters";
import { ProgramHeader } from "@/components/programs/ProgramHeader";
import { ProgramFiltersBar } from "@/components/programs/ProgramFiltersBar";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { ProgramPagination } from "@/components/programs/ProgramPagination";
import { Button } from "@/components/ui/button";
import { Program } from "@/lib/types/programs/types";

export default function MarketplacePage() {
  const {
    searchTerm,
    setSearchTerm,
    quickFilter,
    setQuickFilter,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    minReward,           // 👈 Restored from custom hook
    setMinReward,        // 👈 Restored from custom hook
    maxReward,           // 👈 Restored from custom hook
    setMaxReward,        // 👈 Restored from custom hook
    showMoreFilters,
    setShowMoreFilters,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    handleSearchSubmit,
    handleClearSearch,
    handleTypeChange,
    handleQuickFilterClick,
    handleResetFilters,
    isFilterActive,
    queryProps,
  } = useProgramFilters();

  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetProgramsQuery(queryProps);

  const rawPrograms: Program[] = responseData?.content || [];

  // CLIENT-SIDE FILTERING LOGIC
  const filteredPrograms = useMemo(() => {
    return rawPrograms.filter((program: Program) => {
      const isBounty =
        program.offersBounties ||

        program.engagementType === "BOUNTY";

      // 0. SEARCH FILTER
      if (searchTerm && searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase().trim();
        const nameMatch = program.name?.toLowerCase().includes(query);
        const handleMatch = program.handle?.toLowerCase().includes(query);
        const descMatch = program.description?.toLowerCase().includes(query);

        if (!nameMatch && !handleMatch && !descMatch) {
          return false;
        }
      }

      // 1. FILTER BY TYPE
      if (selectedType === "Bounty" && !isBounty) return false;
      if (selectedType === "Response" && isBounty) return false;

      // 2. FILTER BY QUICK STATS
      const normalizedQuickFilter = quickFilter?.toLowerCase?.() || "all";
      const effectiveQuickFilter =
        selectedType !== "All" &&
        (normalizedQuickFilter === "bounty" || normalizedQuickFilter === "response")
          ? "all"
          : normalizedQuickFilter;

      if (effectiveQuickFilter === "bounty" && !isBounty) return false;
      if (effectiveQuickFilter === "response" && isBounty) return false;
      if (effectiveQuickFilter === "private" && program.visibility !== "PRIVATE") return false;

      // 3. FILTER BY PROGRAM STATUS (All, Open, Done, Archived)
      if (selectedStatus && selectedStatus !== "All") {
        const programState = program.state?.toUpperCase() || "";
        if (programState !== selectedStatus.toUpperCase()) {
          return false;
        }
      }

      // 4. FILTER BY REWARD / POINTS RANGE
      // 4. FILTER BY REWARD / POINTS RANGE (Strict Minimum & Maximum)
      const userMin = minReward !== "" && minReward !== undefined ? Number(minReward) : null;
      const userMax = maxReward !== "" && maxReward !== undefined ? Number(maxReward) : null;

      if (userMin !== null || userMax !== null) {
        if (isBounty) {
          const progMin = program.minimumBounty ?? 0;
          const progMax = program.maximumBounty ?? 0;

          // Filter out if starting bounty is less than the user's min input
          if (userMin !== null && progMin < userMin) return false;

          // Filter out if maximum bounty is greater than the user's max input
          if (userMax !== null && progMax > userMax) return false;
        } else {
          // Response (Points) Programs
          const points = program.rewards?.map((r) => r.points ?? 0) || [];
          const minPts = points.length > 0 ? Math.min(...points) : 20;
          const maxPts = points.length > 0 ? Math.max(...points) : 80;

          if (userMin !== null && minPts < userMin) return false;
          if (userMax !== null && maxPts > userMax) return false;
        }
      }

      return true;
    });
  }, [
    rawPrograms,
    searchTerm,
    selectedType,
    quickFilter,
    selectedStatus,
    minReward,
    maxReward,
    selectedCategory,
  ]);

  const totalPages: number = responseData?.totalPages || 1;
  const totalCount: number =
    responseData?.totalElements || filteredPrograms.length;

  return (
    <div className="min-h-screen w-full   text-foreground font-sans ">
      <div className=" w-full py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className=" w-full space-y-6  pb-12 "
        >
          {/* HEADER SECTION */}
          <ProgramHeader
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={handleClearSearch}
          />

          {/* DETAILED FILTER CONTROLS BAR */}
          <ProgramFiltersBar
            selectedType={selectedType}
            onTypeChange={handleTypeChange}
            selectedStatus={selectedStatus}
            // onStatusChange={(s) => {
            //   setSelectedStatus(s);
            //   setCurrentPage(1);
            // }}
            minReward={minReward}
            maxReward={maxReward}
            onMinRewardChange={(val) => {
              setMinReward(val);
              setCurrentPage(1);
            }}
            onMaxRewardChange={(val) => {
              setMaxReward(val);
              setCurrentPage(1);
            }}
            showMoreFilters={showMoreFilters}
            onToggleMoreFilters={() => setShowMoreFilters(!showMoreFilters)}
            isFilterActive={isFilterActive}
            onResetFilters={handleResetFilters}
          />

          {/* MAIN CARDS GRID */}
          <main>
            {isLoading || isFetching ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="h-[300px] bg-card rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 animate-pulse p-6 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-muted rounded-xl" />
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-24" />
                          <div className="h-3 bg-muted rounded w-16" />
                        </div>
                      </div>
                      <div className="h-5 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-full" />
                    </div>
                    <div className="h-10 bg-muted rounded-xl" />
                  </div>
                ))}
              </div>
            ) : filteredPrograms.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 bg-card rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 text-center space-y-4">
                <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
                  <Globe className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    No programs found
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-md">
                    We couldn&apos;t find any bug bounty or disclosure programs
                    matching your current filter criteria.
                  </p>
                </div>
                <Button
                  onClick={handleResetFilters}
                  variant="outline"
                  className="rounded-xl font-semibold"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((prog: Program) => (
                  <ProgramCard key={prog.id} program={prog} />
                ))}
              </div>
            )}
          </main>

          {/* FOOTER PAGINATION */}
          <ProgramPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            displayedCount={filteredPrograms.length}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(rows) => {
              setRowsPerPage(rows);
              setCurrentPage(1);
            }}
            onPageChange={setCurrentPage}
          />
        </motion.div>
      </div>
    </div>
  );
}