"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";

import { getReportDetailById } from "@/components/report-management/mock-data";
import { ReportSeverityAdjustmentForm } from "@/components/report-management/severity-review/ReportSeverityAdjustmentForm";
import { ReportSeverityReviewHeader } from "@/components/report-management/severity-review/ReportSeverityReviewHeader";
import { ReportSeverityReviewSidebar } from "@/components/report-management/severity-review/ReportSeverityReviewSidebar";

export default function ReportSeverityReviewPage() {
  const params = useParams<{ id: string }>();
  const detail = getReportDetailById(params.id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 pb-12"
    >
      <ReportSeverityReviewHeader detail={detail} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <ReportSeverityAdjustmentForm detail={detail} />
        <ReportSeverityReviewSidebar detail={detail} />
      </div>
    </motion.section>
  );
}
