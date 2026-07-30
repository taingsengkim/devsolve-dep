"use client";

import React from "react";
import { motion } from "motion/react";

import { useReportDetail } from "@/components/reports/hooks/useReportDetail";
import { ReportDetailHeader } from "@/components/reports/ReportDetailHeader";
import { RejectedReportView } from "@/components/reports/RejectedReportView";
import { ReportStatusTracker } from "@/components/reports/ReportStatusTracker";
import { ReportSummaryTab } from "@/components/reports/ReportSummaryTab";
import { ReportRetestTab } from "@/components/reports/ReportRetestTab";

export default function ReportDetailPage() {
  const {
    reportId,
    report,
    isLoading,
    isRejected,
    setIsForceRejected,
    activeTab,
    setActiveTab,
    commentText,
    setCommentText,
    isSubmitting,
    copiedPayload,
    retestHistory,
    handleBack,
    handleSendComment,
    handleInitiateRetest,
    handleResetRetest,
    handleCopyPayload,
  } = useReportDetail();

  if (isLoading || !report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-blue-200" />
          <span className="text-sm font-medium text-slate-500">Loading report details...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Header & Status Toggle Bar */}
      <ReportDetailHeader
        reportId={report.reportId}
        program={report.program}
        submittedAgo={report.submittedAgo}
        isRejected={isRejected}
        onBack={handleBack}
        onToggleDemoView={(rejected) => setIsForceRejected(rejected)}
      />

      {isRejected ? (
        /* REJECTED REPORT DETAIL VIEW */
        <RejectedReportView
          report={report}
          copiedPayload={copiedPayload}
          onCopyPayload={handleCopyPayload}
        />
      ) : (
        /* STANDARD ACCEPTED/TRIAGING REPORT DETAIL VIEW */
        <div className="space-y-6">
          {/* Report Title & Status Stepper Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {report.title}
            </h2>
            <ReportStatusTracker />
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl gap-1 border border-slate-200/50 w-full sm:w-auto self-start">
            <button
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-center ${
                activeTab === "summary"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Summary
            </button>
            <button
              onClick={() => setActiveTab("retest")}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-center ${
                activeTab === "retest"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              Retest History ({retestHistory.length})
            </button>
          </div>

          {/* Tab Content Render */}
          {activeTab === "summary" ? (
            <ReportSummaryTab
              severity={report.severity || "HIGH"}
              commentText={commentText}
              isSubmitting={isSubmitting}
              onCommentTextChange={setCommentText}
              onSendComment={handleSendComment}
            />
          ) : (
            <ReportRetestTab
              retestHistory={retestHistory}
              onInitiateRetest={handleInitiateRetest}
              onResetRetest={handleResetRetest}
            />
          )}
        </div>
      )}
    </motion.section>
  );
}
