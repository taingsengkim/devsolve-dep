"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Globe } from "lucide-react";
import { useGetProgramsQuery } from "@/lib/redux/services/programsApi";
import { ProgramItem } from "@/lib/types/programs/types";
import { useProgramFilters } from "@/hooks/useProgramFilters";
import { ProgramHeader } from "@/components/programs/ProgramHeader";
import { ProgramQuickStats } from "@/components/programs/ProgramQuickStats";
import { ProgramFiltersBar } from "@/components/programs/ProgramFiltersBar";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { ProgramDetailsModal } from "@/components/programs/ProgramDetailsModal";
import { ProgramPagination } from "@/components/programs/ProgramPagination";
import { Button } from "@/components/ui/button";

export default function ProgramsPage() {
  const {
    searchTerm,
    setSearchTerm,
    quickFilter,
    selectedType,
    setSelectedType,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    showMoreFilters,
    setShowMoreFilters,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    handleSearchSubmit,
    handleClearSearch,
    handleQuickFilterClick,
    handleResetFilters,
    isFilterActive,
    queryProps,
  } = useProgramFilters();

  const [activeModalProgram, setActiveModalProgram] = useState<ProgramItem | null>(null);

  const { data: responseData, isLoading, isFetching } = useGetProgramsQuery(queryProps);

  const programs = responseData?.data || [];
  const counts = responseData?.counts || {
    all: 12,
    bounty: 10,
    response: 2,
    newCount: 3,
    privateCount: 2,
  };
  const totalPages = responseData?.totalPages || 1;
  const totalCount = responseData?.totalCount || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* HEADER SECTION */}
      <ProgramHeader
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={handleClearSearch}
      />

      {/* QUICK STAT COUNTER BUTTONS */}
      <ProgramQuickStats
        counts={counts}
        quickFilter={quickFilter}
        onQuickFilterClick={handleQuickFilterClick}
      />

      {/* DETAILED FILTER CONTROLS BAR */}
      <ProgramFiltersBar
        selectedType={selectedType}
        onTypeChange={(t) => {
          setSelectedType(t);
          setCurrentPage(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(c) => {
          setSelectedCategory(c);
          setCurrentPage(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(s) => {
          setSelectedStatus(s);
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
                className="h-[300px] bg-slate-100 rounded-2xl border border-slate-200 animate-pulse p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-slate-200 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-slate-200 rounded w-24" />
                      <div className="h-3 bg-slate-200 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 rounded w-full" />
                </div>
                <div className="h-10 bg-slate-200 rounded-xl" />
              </div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
              <Globe className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">No programs found</h3>
              <p className="text-sm text-slate-500 mt-1 max-w-md">
                We couldn&apos;t find any bug bounty or disclosure programs matching your current filter criteria.
              </p>
            </div>
            <Button
              onClick={handleResetFilters}
              variant="outline"
              className="rounded-xl border-slate-300 font-semibold"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((prog) => (
              <ProgramCard
                key={prog.id}
                program={prog}
                onSeeDetails={(p) => setActiveModalProgram(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* FOOTER PAGINATION */}
      <ProgramPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        displayedCount={programs.length}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
        onPageChange={setCurrentPage}
      />

      {/* DETAILS MODAL */}
      <ProgramDetailsModal
        program={activeModalProgram}
        onClose={() => setActiveModalProgram(null)}
      />
    </motion.div>
  );
}
