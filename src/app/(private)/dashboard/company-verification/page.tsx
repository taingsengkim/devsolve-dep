"use client";

export const dynamic = "force-dynamic";

import React, { useCallback, useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

import { OrganizationDataTable } from "@/components/admin/organizations/OrganizationDataTable";
import { OrganizationFiltersBar } from "@/components/admin/organizations/OrganizationFiltersBar";
import { OrganizationKycModal } from "@/components/admin/organizations/OrganizationKycModal";
import { OrganizationStatCards } from "@/components/admin/organizations/OrganizationStatCards";
import { getOrganizationColumns } from "@/components/admin/organizations/organizationColumns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  useApproveOrganizationMutation,
  useGetOrganizationsQuery,
  useRejectOrganizationMutation,
} from "@/lib/redux/services/adminApi";
import type {
  CompanyVerificationItem,
  OrganizationReviewStatus,
  OrganizationVerificationFilter,
} from "@/lib/types/admin/types";

const apiStatusByFilter: Record<
  Exclude<OrganizationVerificationFilter, "ALL">,
  OrganizationReviewStatus
> = {
  PENDING: "PENDING",
  APPROVED: "ACTIVE",
  REJECTED: "REJECTED",
};

const formatDate = (value?: string) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

function requestErrorMessage(error: unknown) {
  const value = error as
    | { data?: { message?: string }; error?: string }
    | undefined;
  return (
    value?.data?.message ??
    value?.error ??
    "The organization review queue could not be loaded."
  );
}

export default function OrganizationVerificationPage() {
  const [statusFilter, setStatusFilter] =
    useState<OrganizationVerificationFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [selectedAuditCompany, setSelectedAuditCompany] =
    useState<CompanyVerificationItem | null>(null);

  const deferredSearchQuery = useDeferredValue(searchQuery.trim());
  const selectedApiStatus =
    statusFilter === "ALL" ? undefined : apiStatusByFilter[statusFilter];

  const {
    data: organizationsData,
    error,
    isLoading,
    isFetching,
    refetch,
  } = useGetOrganizationsQuery({
    query: deferredSearchQuery || undefined,
    status: selectedApiStatus,
    pageNumber,
    pageSize,
  });

  const {
    data: pendingSummary,
    isLoading: isPendingSummaryLoading,
    refetch: refetchPendingSummary,
  } = useGetOrganizationsQuery({
    status: "PENDING",
    pageNumber: 0,
    pageSize: 1,
  });
  const {
    data: activeSummary,
    isLoading: isActiveSummaryLoading,
    refetch: refetchActiveSummary,
  } = useGetOrganizationsQuery({
    status: "ACTIVE",
    pageNumber: 0,
    pageSize: 1,
  });
  const {
    data: rejectedSummary,
    isLoading: isRejectedSummaryLoading,
    refetch: refetchRejectedSummary,
  } = useGetOrganizationsQuery({
    status: "REJECTED",
    pageNumber: 0,
    pageSize: 1,
  });

  const [approveOrg] = useApproveOrganizationMutation();
  const [rejectOrg] = useRejectOrganizationMutation();

  const counts = useMemo(() => {
    const pending = pendingSummary?.totalElements ?? 0;
    const approved = activeSummary?.totalElements ?? 0;
    const rejected = rejectedSummary?.totalElements ?? 0;

    return {
      all: pending + approved + rejected,
      pending,
      approved,
      rejected,
    };
  }, [activeSummary, pendingSummary, rejectedSummary]);

  const verifications = useMemo<CompanyVerificationItem[]>(
    () =>
      (organizationsData?.content ?? []).map((organization) => ({
        id: organization.id,
        orgCode: organization.slug,
        companyName: organization.name,
        email: organization.ownerEmail || "—",
        domain: organization.websiteUrl || "—",
        businessType: organization.industry || "—",
        registrationDate: formatDate(organization.createdAt),
        submittedAt: formatDate(organization.createdAt),
        status:
          organization.status === "ACTIVE" ? "APPROVED" : organization.status,
        contactName: organization.ownerFullName || "—",
        country: organization.country,
        industry: organization.industry,
        companySize: organization.companySize,
        submissionVersion: organization.submissionVersion,
      })),
    [organizationsData],
  );

  const handleStatusFilterChange = useCallback(
    (status: OrganizationVerificationFilter) => {
      setStatusFilter(status);
      setPageNumber(0);
    },
    [],
  );

  const handleSearchQueryChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPageNumber(0);
  }, []);

  const handleUpdateStatus = useCallback(
    async (id: string, status: "APPROVED" | "REJECTED", notes?: string) => {
      if (status === "APPROVED") {
        await approveOrg({ id }).unwrap();
        return;
      }

      await rejectOrg({
        id,
        reason:
          notes?.trim() || "Rejected during organization verification audit.",
      }).unwrap();
    },
    [approveOrg, rejectOrg],
  );

  const columns = useMemo(
    () =>
      getOrganizationColumns({
        onQuickAudit: setSelectedAuditCompany,
      }),
    [],
  );

  const summaryIsLoading =
    isPendingSummaryLoading ||
    isActiveSummaryLoading ||
    isRejectedSummaryLoading;

  const refreshAll = () => {
    void Promise.all([
      refetch(),
      refetchPendingSummary(),
      refetchActiveSummary(),
      refetchRejectedSummary(),
    ]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
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
            <span aria-hidden="true">/</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Organization Verification
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Organization Verification
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Review pending applications and inspect approved or rejected
            organizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {counts.pending > 0 && (
            <Badge
              variant="outline"
              className="h-9 gap-2 rounded-xl border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            >
              <span
                aria-hidden="true"
                className="size-2 rounded-full bg-amber-500"
              />
              {counts.pending} pending review{counts.pending === 1 ? "" : "s"}
            </Badge>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={refreshAll}
            disabled={isFetching}
            className="rounded-xl"
          >
            <RefreshCw
              data-icon="inline-start"
              className={isFetching ? "animate-spin" : undefined}
            />
            Refresh
          </Button>
        </div>
      </header>

      {summaryIsLoading ? (
        <div className="grid animate-pulse grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-32 rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60"
            />
          ))}
        </div>
      ) : (
        <OrganizationStatCards counts={counts} />
      )}

      <OrganizationFiltersBar
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        searchQuery={searchQuery}
        onSearchQueryChange={handleSearchQueryChange}
        counts={counts}
      />

      <main className="flex flex-col gap-3">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-96 rounded-2xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-800/60" />
          </div>
        ) : error ? (
          <Card className="rounded-2xl border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <CardHeader className="items-center text-center">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <AlertCircle className="size-6" />
              </div>
              <CardTitle className="text-xl">
                Unable to load organizations
              </CardTitle>
              <CardDescription className="max-w-lg text-sm">
                {requestErrorMessage(error)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button
                type="button"
                onClick={() => void refetch()}
                className="rounded-xl"
              >
                <RefreshCw data-icon="inline-start" />
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : (
          <OrganizationDataTable
            columns={columns}
            data={verifications}
            pageIndex={organizationsData?.number ?? pageNumber}
            pageSize={organizationsData?.size ?? pageSize}
            pageCount={organizationsData?.totalPages ?? 0}
            totalRows={organizationsData?.totalElements ?? 0}
            isFetching={isFetching}
            onPageChange={setPageNumber}
            onPageSizeChange={(nextPageSize) => {
              setPageSize(nextPageSize);
              setPageNumber(0);
            }}
          />
        )}
      </main>

      <OrganizationKycModal
        selectedCompany={selectedAuditCompany}
        onClose={() => setSelectedAuditCompany(null)}
        onUpdateStatus={handleUpdateStatus}
      />
    </motion.div>
  );
}
