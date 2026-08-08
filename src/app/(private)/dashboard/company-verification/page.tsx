"use client";

export const dynamic = "force-dynamic";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useGetPendingOrganizationsQuery,
  useGetCompanyVerificationsQuery,
  useUpdateCompanyVerificationStatusMutation,
  CompanyVerificationItem,
} from "@/lib/redux/services/adminApi";
import { OrganizationStatCards } from "@/components/admin/organizations/OrganizationStatCards";
import { OrganizationFiltersBar } from "@/components/admin/organizations/OrganizationFiltersBar";
import { OrganizationDataTable } from "@/components/admin/organizations/OrganizationDataTable";
import { getOrganizationColumns } from "@/components/admin/organizations/organizationColumns";
import { OrganizationKycModal } from "@/components/admin/organizations/OrganizationKycModal";

type StatusFilter = "ALL" | "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";

export default function OrganizationVerificationPage() {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAuditCompany, setSelectedAuditCompany] = useState<CompanyVerificationItem | null>(null);

  // RTK Query hooks
  const {
    data: pendingData,
    isLoading: isPendingLoading,
    isFetching: isPendingFetching,
  } = useGetPendingOrganizationsQuery({ pageNumber: 0, pageSize: 100 });

  const {
    data: mockVerifications = [],
    isLoading: isMockLoading,
    isFetching: isMockFetching,
  } = useGetCompanyVerificationsQuery();

  const [updateStatus] = useUpdateCompanyVerificationStatusMutation();

  const isLoading = isPendingLoading || isMockLoading;
  const isFetching = isPendingFetching || isMockFetching;

  // Unify pending org items from backend and mock verifications
  const combinedVerifications = useMemo(() => {
    const pendingItems: CompanyVerificationItem[] = (pendingData?.content ?? []).map((p) => ({
      id: p.id,
      orgCode: p.slug,
      companyName: p.name,
      email: p.ownerEmail || "—",
      domain: p.websiteUrl ? p.websiteUrl.replace(/^https?:\/\//, "") : "—",
      taxId: "—",
      businessType: p.industry || "Technology",
      registrationDate: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—",
      submittedAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "—",
      status: "PENDING",
      documentsCount: 0,
      contactName: p.ownerFullName || "Owner",
      country: p.country,
      industry: p.industry,
      companySize: p.companySize,
      submissionVersion: p.submissionVersion,
    }));

    const pendingIds = new Set(pendingItems.map((p) => p.id));
    const remainingMocks = mockVerifications.filter((m) => !pendingIds.has(m.id));

    return [...pendingItems, ...remainingMocks];
  }, [pendingData, mockVerifications]);

  // Counts for summary metrics and status tabs
  const counts = useMemo(
    () => ({
      all: combinedVerifications.length,
      pending: combinedVerifications.filter((v) => v.status === "PENDING").length,
      underReview: combinedVerifications.filter((v) => v.status === "UNDER_REVIEW").length,
      approved: combinedVerifications.filter((v) => v.status === "APPROVED").length,
      rejected: combinedVerifications.filter((v) => v.status === "REJECTED").length,
    }),
    [combinedVerifications]
  );

  // Filtering by status & text query
  const filteredVerifications = useMemo(() => {
    return combinedVerifications.filter((v) => {
      const matchesStatus = statusFilter === "ALL" || v.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        v.companyName.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.domain?.toLowerCase().includes(q) ||
        v.contactName?.toLowerCase().includes(q) ||
        v.taxId?.toLowerCase().includes(q) ||
        v.industry?.toLowerCase().includes(q) ||
        v.orgCode?.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [combinedVerifications, statusFilter, searchQuery]);

  // Audit modal status updater callback
  const handleUpdateStatus = useCallback(
    async (id: string, status: "APPROVED" | "REJECTED", notes?: string) => {
      await updateStatus({ id, status, notes }).unwrap();
    },
    [updateStatus]
  );

  const columns = useMemo(
    () =>
      getOrganizationColumns({
        onQuickAudit: (company) => setSelectedAuditCompany(company),
      }),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* PAGE HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
            <Link
              href="/dashboard"
              className="flex items-center gap-1 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
            >
              <ArrowLeft className="size-3.5" />
              Dashboard
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Organization Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Organization Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review, audit, and manage pending and verified corporate KYB / KYC requests.
          </p>
        </div>

        {/* Pending badge count alert */}
        {counts.pending > 0 && (
          <Badge
            variant="outline"
            className="h-9 shrink-0 gap-2 rounded-xl border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          >
            <span className="size-2 rounded-full bg-amber-500" />
            <span>
              {counts.pending} pending review{counts.pending !== 1 ? "s" : ""}
            </span>
          </Badge>
        )}
      </header>

      {/* STAT CARDS */}
      {!isLoading && <OrganizationStatCards verifications={combinedVerifications} />}
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800"
            />
          ))}
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <OrganizationFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        counts={counts}
      />

      {/* DATA TABLE */}
      <main className="flex flex-col gap-3">
        {isLoading || isFetching ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-64 bg-slate-100 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800" />
          </div>
        ) : (
          <OrganizationDataTable columns={columns} data={filteredVerifications} />
        )}
      </main>

      {/* QUICK AUDIT MODAL */}
      <OrganizationKycModal
        selectedCompany={selectedAuditCompany}
        onClose={() => setSelectedAuditCompany(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </motion.div>
  );
}
