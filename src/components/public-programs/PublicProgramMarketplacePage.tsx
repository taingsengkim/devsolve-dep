"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { LayoutGrid } from "lucide-react";
import { motion } from "motion/react";

import { PublicProgramCard } from "@/components/public-programs/PublicProgramCard";
import { PublicProgramFilters } from "@/components/public-programs/PublicProgramFilters";
import { PublicProgramFooter } from "@/components/public-programs/PublicProgramFooter";
import { PublicProgramPagination } from "@/components/public-programs/PublicProgramPagination";
import { ProgramDetailsModal } from "@/components/programs/ProgramDetailsModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_PROGRAMS } from "@/lib/types/programs/mock-data";
import type { AssetCategory, ProgramItem, ProgramStatus, ProgramType } from "@/lib/types/programs/types";

type TypeFilter = "All" | ProgramType;
type AssetFilter = "All" | AssetCategory;
type StatusFilter = "All" | ProgramStatus;

export function PublicProgramMarketplacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All");
  const [assetFilter, setAssetFilter] = useState<AssetFilter>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalProgram, setActiveModalProgram] = useState<ProgramItem | null>(null);

  const deferredSearchTerm = useDeferredValue(searchTerm);

  const filteredPrograms = useMemo(() => {
    const query = deferredSearchTerm.trim().toLowerCase();

    return MOCK_PROGRAMS.filter((program) => {
      const matchesSearch =
        query.length === 0 ||
        program.companyName.toLowerCase().includes(query) ||
        program.title.toLowerCase().includes(query) ||
        program.description.toLowerCase().includes(query) ||
        program.inScopeAssets.some((asset) => asset.toLowerCase().includes(query));

      const matchesType = typeFilter === "All" || program.type === typeFilter;
      const matchesAsset =
        assetFilter === "All" || program.assetCategories.includes(assetFilter);
      const matchesStatus =
        statusFilter === "All" || program.status === statusFilter;

      return matchesSearch && matchesType && matchesAsset && matchesStatus;
    });
  }, [assetFilter, deferredSearchTerm, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredPrograms.length / rowsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPrograms = filteredPrograms.slice(
    (safeCurrentPage - 1) * rowsPerPage,
    safeCurrentPage * rowsPerPage
  );

  const counts = useMemo(() => {
    return {
      total: MOCK_PROGRAMS.length,
      bounty: MOCK_PROGRAMS.filter((program) => program.type === "Bounty").length,
      response: MOCK_PROGRAMS.filter((program) => program.type === "Response").length,
      private: MOCK_PROGRAMS.filter((program) => program.isPrivate).length,
    };
  }, []);

  return (
    <>
      <section className="bg-slate-50">
        <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-8 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-6"
          >
            <PublicProgramFilters
              totalCount={counts.total}
              bountyCount={counts.bounty}
              responseCount={counts.response}
              privateCount={counts.private}
              searchTerm={searchTerm}
              onSearchTermChange={(value) => {
                setSearchTerm(value);
                setCurrentPage(1);
              }}
              typeFilter={typeFilter}
              onTypeFilterChange={(value) => {
                setTypeFilter(value);
                setCurrentPage(1);
              }}
              assetFilter={assetFilter}
              onAssetFilterChange={(value) => {
                setAssetFilter(value);
                setCurrentPage(1);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
              showMoreFilters={showMoreFilters}
              onToggleMoreFilters={() => setShowMoreFilters((current) => !current)}
            />

            <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.04)] sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Explore active programs
                </h2>
                <p className="mt-1 text-sm text-slate-500 sm:text-base">
                  Showing {paginatedPrograms.length} of {filteredPrograms.length} matching opportunities.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-600">
                  <LayoutGrid className="size-3" />
                  Public marketplace
                </Badge>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setTypeFilter("All");
                    setAssetFilter("All");
                    setStatusFilter("All");
                    setCurrentPage(1);
                  }}
                  className="rounded-full border-slate-200 bg-white text-slate-600"
                >
                  Reset filters
                </Button>
              </div>
            </div>

            {paginatedPrograms.length === 0 ? (
              <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-[0_2px_10px_rgba(15,23,42,0.04)]">
                <h3 className="text-xl font-semibold text-slate-900">No programs found</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try changing the search term or filter chips to discover more bug bounty and disclosure programs.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                {paginatedPrograms.map((program, index) => (
                  <motion.div
                    key={program.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
                  >
                    <PublicProgramCard
                      program={program}
                      onSeeDetails={setActiveModalProgram}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            <PublicProgramPagination
              currentPage={safeCurrentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(value) => {
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        </div>
      </section>

      <PublicProgramFooter />
      <ProgramDetailsModal
        program={activeModalProgram}
        onClose={() => setActiveModalProgram(null)}
      />
    </>
  );
}
