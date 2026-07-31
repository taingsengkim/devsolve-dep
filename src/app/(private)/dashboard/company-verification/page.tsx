"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Building2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGetCompanyVerificationsQuery } from "@/lib/redux/services/adminApi";
import { OrganizationStatCards } from "@/components/admin/organizations/OrganizationStatCards";
import { OrganizationFiltersBar } from "@/components/admin/organizations/OrganizationFiltersBar";
import { OrganizationCard } from "@/components/admin/organizations/OrganizationCard";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";

export default function OrganizationVerificationPage() {
  const { data: verifications = [], isLoading, isFetching } =
    useGetCompanyVerificationsQuery();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = {
    all: verifications.length,
    pending: verifications.filter((v) => v.status === "PENDING").length,
    approved: verifications.filter((v) => v.status === "APPROVED").length,
    rejected: verifications.filter((v) => v.status === "REJECTED").length,
    underReview: verifications.filter((v) => v.status === "UNDER_REVIEW").length,
  };

  const filteredItems = verifications.filter((item) => {
    const matchesFilter = statusFilter === "ALL" || item.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.companyName.toLowerCase().includes(q) ||
      item.domain.toLowerCase().includes(q) ||
      item.taxId.toLowerCase().includes(q) ||
      item.businessType.toLowerCase().includes(q) ||
      item.email.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleResetFilters = () => {
    setStatusFilter("ALL");
    setSearchQuery("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Organization Verification
          </h1>
        </div>

        {/* Pending badge call-to-action */}
        {counts.pending > 0 && (
          <div className="shrink-0 flex items-center gap-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl px-4 py-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
              {counts.pending} pending review{counts.pending > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </header>

      {/* STAT CARDS */}
      <OrganizationStatCards verifications={verifications} />

      {/* FILTERS */}
      <OrganizationFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        counts={counts}
      />

      {/* LIST */}
      <main className="space-y-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800"
              />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No Organizations Found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                No records match your current filter or search criteria.
              </p>
            </div>
            {(statusFilter !== "ALL" || searchQuery) && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="rounded-xl border-slate-300 dark:border-slate-700 font-semibold gap-1.5 text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <OrganizationCard key={item.id} item={item} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </motion.div>
  );
}
