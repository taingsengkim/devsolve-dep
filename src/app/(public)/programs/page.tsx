"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight, Mail } from "lucide-react";
import { ProgramItem, AssetCategory } from "@/lib/types/programs/types";
import { MOCK_PROGRAMSss } from "@/lib/types/programMockdata";
import { ProgramCard } from "@/components/programs/ProgramCard";

export default function MarketplacePage() {
  // --- State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("All"); // 'All', 'Bounty', 'Response'
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("All"); // 'All', 'Web', 'API', 'Mobile', 'Network', 'Cloud'

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [isRowsDropdownOpen, setIsRowsDropdownOpen] = useState(false);

  const handleSeeDetails = (program: ProgramItem) => {
    console.log("Viewing details for:", program.title);
  };

  // --- Filtering Logic ---
  const filteredPrograms = useMemo(() => {
    return MOCK_PROGRAMSss.filter((program) => {
      // 1. Search Query
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        program.title.toLowerCase().includes(query) ||
        program.companyName.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query) ||
        program.inScopeAssets.some((asset) => asset.toLowerCase().includes(query));

      // 2. Type Filter (Bounty / Response)
      const matchesType =
        selectedTypeFilter === "All" ||
        program.type.toLowerCase() === selectedTypeFilter.toLowerCase();

      // 3. Category Filter (Web / API / Mobile / Network / Cloud)
      const matchesCategory =
        selectedCategoryFilter === "All" ||
        program.assetCategories.some(
          (category) => category.toLowerCase() === selectedCategoryFilter.toLowerCase()
        );

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchQuery, selectedTypeFilter, selectedCategoryFilter]);

  // Reset page when filters change
  const handleTypeFilterChange = (type: string) => {
    setSelectedTypeFilter(type);
    setCurrentPage(1);
  };

  const handleCategoryFilterChange = (category: string) => {
    setSelectedCategoryFilter(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  // --- Dynamic Counter Badges ---
  const counts = useMemo(() => {
    return {
      all: MOCK_PROGRAMSss.length,
      bounty: MOCK_PROGRAMSss.filter((p) => p.type === "Bounty").length,
      response: MOCK_PROGRAMSss.filter((p) => p.type === "Response").length,
      open: MOCK_PROGRAMSss.filter((p) => p.status === "Open").length,
      archived: MOCK_PROGRAMSss.filter((p) => p.status === "Archived").length,
    };
  }, []);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredPrograms.length / itemsPerPage) || 1;
  const paginatedPrograms = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredPrograms.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredPrograms, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 flex flex-col justify-between font-sans">
      <div>
        {/* Main Section */}
        <main className="mx-auto max-w-7xl px-6 py-8">
          {/* Header Title & Search */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Program Marketplace</h1>
              <p className="text-xs text-slate-500 mt-1">
                Discover bug bounty programs and responsible disclosure opportunities worldwide.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search program, companies, keywords..."
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-5 pr-10 text-xs text-slate-700 placeholder-slate-400 focus:border-blue-500 focus:outline-none shadow-xs"
              />
              <Search className="absolute right-3.5 top-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          {/* Counters Bar (Clickable Quick Filters) */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold">
            <button
              onClick={() => handleTypeFilterChange("All")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                selectedTypeFilter === "All"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100/70 text-blue-700 hover:bg-blue-200"
              }`}
            >
              {counts.all} All Programs
            </button>
            <button
              onClick={() => handleTypeFilterChange("Bounty")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                selectedTypeFilter === "Bounty"
                  ? "bg-amber-600 text-white"
                  : "bg-amber-100/70 text-amber-700 hover:bg-amber-200"
              }`}
            >
              {counts.bounty} Bounty
            </button>
            <button
              onClick={() => handleTypeFilterChange("Response")}
              className={`rounded-md px-2.5 py-1 transition-all ${
                selectedTypeFilter === "Response"
                  ? "bg-slate-700 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {counts.response} Response
            </button>
            <span className="rounded-md bg-emerald-100/70 px-2.5 py-1 text-emerald-700">
              {counts.open} Open
            </span>
            <span className="rounded-md bg-purple-100/70 px-2.5 py-1 text-purple-700">
              {counts.archived} Archived
            </span>
          </div>

          {/* Filters Bar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600">
              {/* Type Filter Buttons */}
              {["All", "Bounty", "Response"].map((type) => (
                <button
                  key={type}
                  onClick={() => handleTypeFilterChange(type)}
                  className={`rounded-full px-4 py-1.5 transition-colors ${
                    selectedTypeFilter === type
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {type}
                </button>
              ))}

              <span className="mx-1 text-slate-300">|</span>

              {/* Category Filter Buttons */}
              {["All", "Web", "API", "Mobile", "Network", "Cloud"].map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryFilterChange(category)}
                  className={`rounded-full px-4 py-1.5 transition-colors ${
                    selectedCategoryFilter === category
                      ? "bg-blue-600 text-white font-semibold"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTypeFilter("All");
                setSelectedCategoryFilter("All");
                setCurrentPage(1);
              }}
              className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

          {/* Cards Grid */}
          {paginatedPrograms.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedPrograms.map((program) => (
                <ProgramCard
                  key={program.id}
                  program={program}
                  onSeeDetails={handleSeeDetails}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-slate-500 text-sm">No programs match your filter criteria.</p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTypeFilter("All");
                  setSelectedCategoryFilter("All");
                  setCurrentPage(1);
                }}
                className="mt-3 text-xs text-blue-600 font-semibold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600">
            {/* Items Per Page Dropdown */}
            <div className="flex items-center space-x-2 relative">
              <span>Rows per page</span>
              <button
                onClick={() => setIsRowsDropdownOpen(!isRowsDropdownOpen)}
                className="relative flex items-center rounded-lg border border-slate-200 bg-white px-3 py-1 cursor-pointer hover:bg-slate-50"
              >
                <span>{itemsPerPage}</span>
                <ChevronDown className="ml-2 h-3.5 w-3.5 text-slate-400" />
              </button>

              {isRowsDropdownOpen && (
                <div className="absolute top-8 right-0 bg-white border border-slate-200 rounded-lg shadow-md z-10 py-1">
                  {[3, 6, 10, 20].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setItemsPerPage(num);
                        setCurrentPage(1);
                        setIsRowsDropdownOpen(false);
                      }}
                      className="block w-full px-4 py-1 text-left hover:bg-slate-100 text-xs"
                    >
                      {num}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Page Navigation Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center space-x-1 hover:text-blue-600 disabled:opacity-40 disabled:hover:text-slate-600 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`flex h-7 w-7 items-center justify-center rounded font-medium transition-colors ${
                    currentPage === pageNum
                      ? "border border-slate-200 bg-white shadow-xs font-bold text-blue-600"
                      : "hover:bg-slate-100 text-slate-600"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="flex items-center space-x-1 hover:text-blue-600 disabled:opacity-40 disabled:hover:text-slate-600 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

  
    </div>
  );
}