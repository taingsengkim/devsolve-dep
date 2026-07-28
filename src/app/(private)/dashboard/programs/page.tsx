"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  Globe,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useGetProgramsQuery } from "@/lib/redux/services/programsApi";
import { ProgramItem, ProgramType, AssetCategory, ProgramStatus } from "@/lib/types/programs/types";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { ProgramDetailsModal } from "@/components/programs/ProgramDetailsModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProgramsPage() {
  // Filter and pagination states
  const [searchTerm, setSearchTerm] = useState("");
  const [querySearch, setQuerySearch] = useState("");
  const [quickFilter, setQuickFilter] = useState<"all" | "bounty" | "response" | "new" | "private">("all");
  const [selectedType, setSelectedType] = useState<"All" | ProgramType>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | AssetCategory>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Selected program for details modal
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramItem | null>(null);

  // RTK Query hook
  const { data: responseData, isLoading, isFetching } = useGetProgramsQuery({
    search: querySearch,
    quickFilter,
    type: selectedType,
    category: selectedCategory,
    status: selectedStatus === "All" ? undefined : (selectedStatus as ProgramStatus),
    page: currentPage,
    limit: rowsPerPage,
  });

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

  // Search submit handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuerySearch(searchTerm);
    setCurrentPage(1);
  };

  // Quick stat badge click handler
  const handleQuickFilterClick = (filter: "all" | "bounty" | "response" | "new" | "private") => {
    setQuickFilter(filter);
    setCurrentPage(1);
    if (filter === "bounty") setSelectedType("Bounty");
    else if (filter === "response") setSelectedType("Response");
    else if (filter === "all") setSelectedType("All");
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchTerm("");
    setQuerySearch("");
    setQuickFilter("all");
    setSelectedType("All");
    setSelectedCategory("All");
    setSelectedStatus("All");
    setCurrentPage(1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            Program Marketplace
          </h1>
          <p className="text-slate-600 mt-1.5 text-base font-normal">
            Discover bug bounty programs and responsible disclosure opportunities worldwide.
          </p>
        </div>

        {/* Search Bar Form */}
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center gap-2 w-full md:w-[420px]"
        >
          <div className="relative flex-1">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search program , companies , keywords...."
              className="h-11 pl-4 pr-10 rounded-xl bg-white border-slate-300 text-sm shadow-2xs focus-visible:ring-blue-600 focus-visible:border-blue-600"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm("");
                  setQuerySearch("");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Clear
              </button>
            )}
          </div>
          <Button
            type="submit"
            className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs shrink-0 cursor-pointer font-semibold"
          >
            <Search className="w-4 h-4" />
            <span className="sr-only sm:not-sr-only sm:inline-block">Search</span>
          </Button>
        </form>
      </header>

      {/* QUICK STAT COUNTER BUTTONS */}
      <section className="flex flex-wrap items-center gap-2.5">
        <Button
          variant={quickFilter === "all" ? "default" : "outline"}
          onClick={() => handleQuickFilterClick("all")}
          className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
            quickFilter === "all"
              ? "bg-slate-900 text-white shadow-xs"
              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
          }`}
        >
          {counts.all} All Programs
        </Button>

        <Button
          variant={quickFilter === "bounty" ? "default" : "outline"}
          onClick={() => handleQuickFilterClick("bounty")}
          className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
            quickFilter === "bounty"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white border-slate-300 text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
          }`}
        >
          {counts.bounty} Bounty
        </Button>

        <Button
          variant={quickFilter === "response" ? "default" : "outline"}
          onClick={() => handleQuickFilterClick("response")}
          className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
            quickFilter === "response"
              ? "bg-indigo-600 text-white shadow-xs"
              : "bg-white border-slate-300 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
          }`}
        >
          {counts.response} Response
        </Button>

        <Button
          variant={quickFilter === "new" ? "default" : "outline"}
          onClick={() => handleQuickFilterClick("new")}
          className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
            quickFilter === "new"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-white border-slate-300 text-slate-700 hover:bg-amber-50 hover:text-amber-700"
          }`}
        >
          {counts.newCount} New
        </Button>

        <Button
          variant={quickFilter === "private" ? "default" : "outline"}
          onClick={() => handleQuickFilterClick("private")}
          className={`h-9 px-4 rounded-xl text-sm font-semibold cursor-pointer transition-all ${
            quickFilter === "private"
              ? "bg-slate-700 text-white shadow-xs"
              : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
          }`}
        >
          {counts.privateCount} Private
        </Button>
      </section>

      {/* DETAILED FILTER CONTROLS BAR */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80">
        <div className="flex flex-wrap items-center gap-4">
          {/* Program Type Filter Segment */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
            {(["All", "Bounty", "Response"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setSelectedType(t);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  selectedType === t
                    ? "bg-blue-600 text-white shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Asset Category Filter Segment */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
            {(["All", "Web", "API", "Mobile", "Network"] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-slate-900 text-white shadow-2xs font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* More Filters Toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className={`h-10 px-4 rounded-xl border-slate-300 text-sm font-semibold cursor-pointer gap-2 ${
              showMoreFilters || selectedStatus !== "All"
                ? "border-blue-600 bg-blue-50 text-blue-600"
                : "bg-white text-slate-700 hover:bg-slate-100"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            More Filters
          </Button>

          {(querySearch ||
            quickFilter !== "all" ||
            selectedType !== "All" ||
            selectedCategory !== "All" ||
            selectedStatus !== "All") && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleResetFilters}
              title="Reset all filters"
              className="h-10 w-10 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
        </div>
      </section>

      {/* EXPANDABLE MORE FILTERS PANEL */}
      <AnimatePresence>
        {showMoreFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
          >
            <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase">
              Filter by Program Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {(["All", "Open", "Done", "Archived"] as const).map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedStatus(status);
                    setCurrentPage(1);
                  }}
                  className={`rounded-lg text-sm font-medium ${
                    selectedStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-white border-slate-200 text-slate-700"
                  }`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200/80">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <label htmlFor="rows-per-page" className="font-medium">
            Rows per page
          </label>
          <select
            id="rows-per-page"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 px-3 rounded-lg bg-white border border-slate-300 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="6">6</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>

          <span className="text-xs text-slate-400 ml-2">
            Showing {programs.length} of {totalCount} programs
          </span>
        </div>

        <nav className="flex items-center gap-1.5" aria-label="Pagination Navigation">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="h-9 px-3 rounded-xl border-slate-300 text-sm font-medium gap-1 cursor-pointer disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(pageNum)}
              className={`h-9 w-9 rounded-xl text-sm font-semibold cursor-pointer ${
                currentPage === pageNum
                  ? "bg-blue-600 text-white shadow-2xs"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-100"
              }`}
            >
              {pageNum}
            </Button>
          ))}

          {totalPages > 3 && currentPage < totalPages - 1 && (
            <span className="px-1 text-slate-400 text-sm">...</span>
          )}

          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="h-9 px-3 rounded-xl border-slate-300 text-sm font-medium gap-1 cursor-pointer disabled:opacity-50"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </nav>
      </footer>

      {/* DETAILS MODAL */}
      <ProgramDetailsModal
        program={activeModalProgram}
        onClose={() => setActiveModalProgram(null)}
      />
    </motion.div>
  );
}
