"use client";

import { motion } from "motion/react";
import { useParams } from "next/navigation";

import { ReportDetailAssessment } from "@/components/report-management/ReportDetailAssessment";
import { ReportDetailClassification } from "@/components/report-management/ReportDetailClassification";
import { ReportDetailHeader } from "@/components/report-management/ReportDetailHeader";
import { ReportDetailProofOfConcept } from "@/components/report-management/ReportDetailProofOfConcept";
import { ReportDetailReferences } from "@/components/report-management/ReportDetailReferences";
import {
  buildReportDetailFromManagedReport,
  findManagedReportByRouteId,
  getReportDetailById,
} from "@/components/report-management/mock-data";
import { ReportDetailTargetScope } from "@/components/report-management/ReportDetailTargetScope";
import { useGetManagedReportsQuery } from "@/lib/redux/services/reportsApi";

export default function ReportManagementDetailPage() {
  const params = useParams<{ id: string }>();
  const { data: managedReports = [] } = useGetManagedReportsQuery();

  const liveReport = findManagedReportByRouteId(managedReports, params.id);
  const detail = liveReport
    ? buildReportDetailFromManagedReport(liveReport)
    : getReportDetailById(params.id);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 pb-12"
    >
      <ReportDetailHeader detail={detail} />
      <ReportDetailTargetScope detail={detail} />
      <ReportDetailClassification detail={detail} />
      <ReportDetailAssessment detail={detail} />
      <ReportDetailProofOfConcept detail={detail} />
      <ReportDetailReferences detail={detail} />
    </motion.section>
  );
}
