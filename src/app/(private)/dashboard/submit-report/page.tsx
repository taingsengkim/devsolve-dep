"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft } from "lucide-react";

import { useSubmitReportForm } from "@/components/reports/hooks/useSubmitReportForm";
import { SubmitReportProgressNav } from "@/components/reports/SubmitReportProgressNav";
import { SubmitReportProgramCard } from "@/components/reports/SubmitReportProgramCard";
import { SubmitReportSeverityCard } from "@/components/reports/SubmitReportSeverityCard";
import { SubmitReportQuickTips } from "@/components/reports/SubmitReportQuickTips";
import { SubmitReportFooterNav } from "@/components/reports/SubmitReportFooterNav";

import { SubmitReportTargetSection } from "@/components/reports/SubmitReportTargetSection";
import { SubmitReportClassificationSection } from "@/components/reports/SubmitReportClassificationSection";
import { SubmitReportDetailsStep } from "@/components/reports/SubmitReportDetailsStep";
import { SubmitReportPocStep } from "@/components/reports/SubmitReportPocStep";
import { SubmitReportReviewStep } from "@/components/reports/SubmitReportReviewStep";
import { ReportSuccessModal } from "@/components/reports/ReportSuccessModal";

function SubmitReportContent() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    currentStep,
    completedSteps,
    selectedSeverity,
    programs,
    isProgramsLoading,
    isSubmitting,
    attachedFiles,
    externalLinks,
    reproduceStepsList,
    submitError,
    isDraftSaved,
    successModalData,
    nextStep,
    prevStep,
    goToStep,
    handleAddFiles,
    handleRemoveFile,
    handleAddExternalLink,
    handleRemoveExternalLink,
    handleUpdateExternalLink,
    handleAddReproduceStep,
    handleRemoveReproduceStep,
    handleUpdateReproduceStep,
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

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 self-start sm:self-center">
            <span>5-Step Wizard</span>
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
                {/* STEP 1: TARGET & SCOPE */}
                {currentStep === 1 && (
                  <SubmitReportTargetSection
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                    programs={programs}
                    isLoading={isProgramsLoading}
                  />
                )}

                {/* STEP 2: VULNERABILITY CLASSIFICATION */}
                {currentStep === 2 && (
                  <SubmitReportClassificationSection
                    register={register}
                    errors={errors}
                    setValue={setValue}
                    watch={watch}
                  />
                )}

                {/* STEP 3: REPORT DETAILS */}
                {currentStep === 3 && (
                  <SubmitReportDetailsStep
                    register={register}
                    errors={errors}
                    reproduceStepsList={reproduceStepsList}
                    onAddReproduceStep={handleAddReproduceStep}
                    onRemoveReproduceStep={handleRemoveReproduceStep}
                    onUpdateReproduceStep={handleUpdateReproduceStep}
                    onInsertTemplate={handleInsertTemplate}
                  />
                )}

                {/* STEP 4: PROOF OF CONCEPT */}
                {currentStep === 4 && (
                  <SubmitReportPocStep
                    register={register}
                    errors={errors}
                    attachedFiles={attachedFiles}
                    externalLinks={externalLinks}
                    onAddFiles={handleAddFiles}
                    onRemoveFile={handleRemoveFile}
                    onAddExternalLink={handleAddExternalLink}
                    onRemoveExternalLink={handleRemoveExternalLink}
                    onUpdateExternalLink={handleUpdateExternalLink}
                  />
                )}

                {/* STEP 5: REVIEW & SUBMIT */}
                {currentStep === 5 && (
                  <SubmitReportReviewStep
                    register={register}
                    watch={watch}
                    attachedFiles={attachedFiles}
                    reproduceStepsList={reproduceStepsList}
                    isSubmitting={isSubmitting}
                    submitError={submitError}
                    isDraftSaved={isDraftSaved}
                    onGoToStep={goToStep}
                    onSaveDraft={handleSaveDraft}
                    onSubmitReport={handleSubmit(onSubmit)}
                  />
                )}

                {/* Step Bottom Footer Navigation Bar (For Steps 1-4) */}
                {currentStep < 5 && (
                  <SubmitReportFooterNav
                    currentStep={currentStep}
                    onPrevStep={prevStep}
                    onNextStep={nextStep}
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
          <SubmitReportProgramCard />

          {/* 3. Dynamic Severity Breakdown Card */}
          <SubmitReportSeverityCard severity={selectedSeverity as "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO"} />

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
