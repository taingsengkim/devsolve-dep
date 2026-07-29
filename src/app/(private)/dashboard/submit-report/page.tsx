"use client";

import React, { Suspense } from "react";
import { Controller } from "react-hook-form";
import { motion } from "motion/react";
import { AlertTriangle } from "lucide-react";

import { SubmitReportHeader } from "@/components/reports/SubmitReportHeader";
import { SeveritySelector, SeverityValue } from "@/components/reports/SeveritySelector";
import { ReportSuccessModal } from "@/components/reports/ReportSuccessModal";
import { SubmitReportTargetSection } from "@/components/reports/SubmitReportTargetSection";
import { SubmitReportDetailsSection } from "@/components/reports/SubmitReportDetailsSection";
import { SubmitReportAttachmentsSection } from "@/components/reports/SubmitReportAttachmentsSection";
import { SubmitReportActions } from "@/components/reports/SubmitReportActions";
import { useSubmitReportForm } from "@/components/reports/hooks/useSubmitReportForm";

function SubmitReportContent() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    programs,
    isProgramsLoading,
    isSubmitting,
    attachedFiles,
    submitError,
    successModalData,
    handleAddFiles,
    handleRemoveFile,
    handleInsertTemplate,
    handleResetForm,
    onSubmit,
  } = useSubmitReportForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full max-w-5xl mx-auto pb-16"
    >
      {/* Header */}
      <SubmitReportHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* SECTION 1: TARGET PROGRAM & SCOPE */}
        <SubmitReportTargetSection
          register={register}
          errors={errors}
          programs={programs}
          isLoading={isProgramsLoading}
        />

        {/* SECTION 2: SEVERITY SELECTION */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              2. Vulnerability Severity Rating
            </h2>
          </div>

          <Controller
            name="severity"
            control={control}
            render={({ field }) => (
              <SeveritySelector
                value={field.value as SeverityValue}
                onChange={(val) => field.onChange(val)}
              />
            )}
          />
        </div>

        {/* SECTION 3: REPORT DETAILS & POC */}
        <SubmitReportDetailsSection
          register={register}
          errors={errors}
          onInsertTemplate={handleInsertTemplate}
        />

        {/* SECTION 4: FILE ATTACHMENTS & COMPLIANCE */}
        <SubmitReportAttachmentsSection
          register={register}
          errors={errors}
          attachedFiles={attachedFiles}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
        />

        {/* FORM ACTIONS */}
        <SubmitReportActions
          isSubmitting={isSubmitting}
          submitError={submitError}
          onReset={handleResetForm}
        />
      </form>

      {/* Success Modal Dialog */}
      <ReportSuccessModal
        isOpen={successModalData.isOpen}
        reportId={successModalData.reportId}
        programName={successModalData.programName}
        title={successModalData.title}
        onReset={handleResetForm}
      />
    </motion.div>
  );
}

export default function SubmitReportPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-slate-500 animate-pulse">
          Loading submit report form...
        </div>
      }
    >
      <SubmitReportContent />
    </Suspense>
  );
}
