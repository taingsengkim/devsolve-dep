"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Zap } from "lucide-react";

import { useSubmitReportForm } from "@/components/reports/hooks/useSubmitReportForm";
import { SubmitReportProgressNav } from "@/components/reports/SubmitReportProgressNav";
import { SubmitReportProgramCard } from "@/components/reports/SubmitReportProgramCard";
import { SubmitReportSeverityCard } from "@/components/reports/SubmitReportSeverityCard";
import { SubmitReportQuickTips } from "@/components/reports/SubmitReportQuickTips";
import { SubmitReportFooterNav } from "@/components/reports/SubmitReportFooterNav";

import { SubmitReportStep1Basics } from "@/components/reports/SubmitReportStep1Basics";
import { SubmitReportStep2Poc } from "@/components/reports/SubmitReportStep2Poc";
import { ReportSuccessModal } from "@/components/reports/ReportSuccessModal";

function SubmitReportContent() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    errors,
    currentStep,
    completedSteps,
    selectedSeverity,
    selectedProgram,
    programs,
    isProgramsLoading,
    isSubmitting,
    attachedFiles,
    submitError,
    isDraftSaved,
    successModalData,
    nextStep,
    prevStep,
    goToStep,
    handleAddFiles,
    handleRemoveFile,
    handleInsertTemplate,
    handleSaveDraft,
    handleResetForm,
    onSubmit,
  } = useSubmitReportForm();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8 w-full pb-12 font-sans"
    >
      {/* Back Navigation & Page Header */}
      <div className="space-y-4">
        <nav aria-label="Back Navigation">
          <Link
            href="/dashboard/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Programs</span>
          </Link>
        </nav>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Submit Vulnerability Report
              </h1>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl font-medium">
              Submit structured findings, technical evidence, and reproduction steps directly to the security triage team.
            </p>
          </div>

          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 self-start sm:self-center shadow-2xs">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Express 2-Step Workflow</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column (2/3 width - Step Content Area) */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs"
              >
                {/* STEP 1: TARGET & CLASSIFICATION */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <SubmitReportStep1Basics
                      register={register}
                      errors={errors}
                      setValue={setValue}
                      watch={watch}
                      programs={programs}
                      isLoading={isProgramsLoading}
                      selectedProgram={selectedProgram}
                    />

                    {/* Step 1 Footer Navigation */}
                    <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-xs cursor-pointer"
                      >
                        <span>Next: PoC & Submit</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: POC WRITE-UP & SUBMIT */}
                {currentStep === 2 && (
                  <SubmitReportStep2Poc
                    register={register}
                    control={control}
                    errors={errors}
                    watch={watch}
                    attachedFiles={attachedFiles}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    isDraftSaved={isDraftSaved}
                    onAddFiles={handleAddFiles}
                    onRemoveFile={handleRemoveFile}
                    onInsertTemplate={handleInsertTemplate}
                    onPrevStep={prevStep}
                    onSaveDraft={handleSaveDraft}
                    onSubmitReport={handleSubmit(onSubmit)}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>

        {/* Right Column (1/3 width - Sticky Sidebar) */}
        <div className="space-y-6 lg:sticky lg:top-8">
          {/* 1. Progress Step Tracker */}
          <SubmitReportProgressNav
            currentStep={currentStep}
            completedSteps={completedSteps}
            onSelectStep={goToStep}
          />

          {/* 2. Program Details Card */}
          <SubmitReportProgramCard program={selectedProgram} />

          {/* 3. Dynamic Severity Breakdown Card */}
          <SubmitReportSeverityCard
            severity={selectedSeverity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"}
            program={selectedProgram}
          />

          {/* 4. Quick Tips Card */}
          <SubmitReportQuickTips />
        </div>
      </div>

      {/* Success Modal */}
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
        <div className="p-12 text-center text-slate-500 animate-pulse font-medium">
          Loading vulnerability submission wizard...
        </div>
      }
    >
      <SubmitReportContent />
    </Suspense>
  );
}
