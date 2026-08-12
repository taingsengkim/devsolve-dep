"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

import { ReportDetailAssessment } from "@/components/report-management/ReportDetailAssessment";
import { ReportDetailClassification } from "@/components/report-management/ReportDetailClassification";
import { ReportDetailHeader } from "@/components/report-management/ReportDetailHeader";
import { ReportDetailProofOfConcept } from "@/components/report-management/ReportDetailProofOfConcept";
import { ReportDetailReferences } from "@/components/report-management/ReportDetailReferences";
import { ReportDetailTargetScope } from "@/components/report-management/ReportDetailTargetScope";
import { Button } from "@/components/ui/button";
import { useGetReportByIdQuery } from "@/lib/redux/services/reportsApi";

export default function ReportManagementDetailPage() {
  const params = useParams<{ id: string }>();
  const reportId = params?.id ?? "";

  const {
    data: detail,
    isLoading,
    isError,
    refetch,
  } = useGetReportByIdQuery(reportId, {
    skip: !reportId,
  });

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12"
      >
        <div className="space-y-4 rounded-2xl bg-card p-6 border border-border ring-1 ring-foreground/5 dark:ring-foreground/10 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 animate-pulse rounded bg-muted" />
            <div className="h-8 w-24 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
          <div className="flex gap-3">
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
            <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-48 animate-pulse rounded-2xl bg-card border border-border p-6" />
          <div className="h-48 animate-pulse rounded-2xl bg-card border border-border p-6" />
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-card border border-border p-6" />
      </motion.div>
    );
  }

  if (isError || !detail) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="space-y-6 w-full pb-12"
      >
        <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center shadow-xs">
          <h3 className="text-xl font-semibold text-foreground">
            Report not found or unavailable
          </h3>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            We couldn&apos;t retrieve details for report #{reportId}. Verify the report ID or try refreshing.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard/report-management">
              <Button variant="outline" className="rounded-xl gap-2">
                <ArrowLeft className="size-4" />
                Back to Report Management
              </Button>
            </Link>
            <Button
              variant="default"
              onClick={() => void refetch()}
              className="rounded-xl gap-2"
            >
              <RefreshCw className="size-4" />
              Retry
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <ReportDetailHeader detail={detail} />
      <ReportDetailTargetScope detail={detail} />
      <ReportDetailClassification detail={detail} />
      <ReportDetailAssessment detail={detail} />
      <ReportDetailProofOfConcept detail={detail} />
      <ReportDetailReferences detail={detail} />
    </motion.div>
  );
}

