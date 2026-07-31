"use client";

export const dynamic = "force-dynamic";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, Building2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useGetCompanyVerificationsQuery,
  useUpdateCompanyVerificationStatusMutation,
  CompanyVerificationItem,
} from "@/lib/redux/services/adminApi";
import { OrganizationStatCards } from "@/components/admin/organizations/OrganizationStatCards";
import { OrganizationFiltersBar } from "@/components/admin/organizations/OrganizationFiltersBar";
import { OrganizationCard } from "@/components/admin/organizations/OrganizationCard";
import { OrganizationKycModal } from "@/components/admin/organizations/OrganizationKycModal";

export default function OrganizationVerificationPage() {
  const { data: verifications = [], isLoading, isFetching } = useGetCompanyVerificationsQuery();
  const [updateStatus] = useUpdateCompanyVerificationStatusMutation();

  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompany, setSelectedCompany] = useState<CompanyVerificationItem | null>(null);

  const counts = {
    all: verifications.length,
    pending: verifications.filter((v) => v.status === "PENDING").length,
    approved: verifications.filter((v) => v.status === "APPROVED").length,
    rejected: verifications.filter((v) => v.status === "REJECTED").length,
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

  const handleUpdateStatus = async (id: string, status: "APPROVED" | "REJECTED", notes?: string) => {
    await updateStatus({ id, status, notes });
  };

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
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Organization Verification
          </h1>
        </div>
      </header>

      {/* QUICK METRIC STAT CARDS */}
      <OrganizationStatCards verifications={verifications} />

      {/* FILTERS & SEARCH BAR */}
      <OrganizationFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        counts={counts}
      />

      {/* ORGANIZATION CARDS LIST */}
      <main className="space-y-4">
        {isLoading || isFetching ? (
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-2xs">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                No Organizations Found
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
                There are no organization verification records matching your current filter or search criteria.
              </p>
            </div>
            {(statusFilter !== "ALL" || searchQuery) && (
              <Button
                variant="outline"
                onClick={handleResetFilters}
                className="rounded-xl border-slate-300 dark:border-slate-700 font-semibold gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <OrganizationCard
                  key={item.id}
                  item={item}
                  onSelect={setSelectedCompany}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* KYC AUDIT MODAL */}
      <OrganizationKycModal
        selectedCompany={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </motion.div>
  );
}
