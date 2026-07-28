"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";

import { getReportDetailById } from "@/components/report-management/mock-data";
import { ReportDetailAssessment } from "@/components/report-management/ReportDetailAssessment";
import { ReportDetailClassification } from "@/components/report-management/ReportDetailClassification";
import { ReportDetailHeader } from "@/components/report-management/ReportDetailHeader";
import { ReportDetailTargetScope } from "@/components/report-management/ReportDetailTargetScope";

export default function ReportManagementDetailPage() {
  const params = useParams<{ id: string }>();
  const detail = getReportDetailById(params.id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 pb-12"
    >
      <ReportDetailHeader detail={detail} />
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <ReportDetailTargetScope detail={detail} />
        <ReportDetailClassification detail={detail} />
      </div>
      <ReportDetailAssessment detail={detail} />
    </motion.section>
  );
}
