"use client";

import React from "react";
import { ArrowLeft, ChevronRight } from "lucide-react";

interface SubmitReportFooterNavProps {
  currentStep: number;
  onPrevStep: () => void;
  onNextStep: () => void;
  nextButtonLabel?: string;
  isNextDisabled?: boolean;
}

export const SubmitReportFooterNav: React.FC<SubmitReportFooterNavProps> = ({
  currentStep,
  onPrevStep,
  onNextStep,
  nextButtonLabel,
  isNextDisabled = false,
}) => {
  const isFirstStep = currentStep === 1;
  const label = nextButtonLabel || (currentStep === 4 ? "Review Report" : "Continue");

  return (
    <div className="flex items-center justify-between pt-6 border-t border-slate-200 dark:border-slate-800">
      {/* Back Button */}
      <button
        type="button"
        disabled={isFirstStep}
        onClick={onPrevStep}
        className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
          isFirstStep
            ? "text-slate-300 dark:text-slate-700 cursor-not-allowed bg-slate-50 dark:bg-slate-900/50"
            : "text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Progress Dots Indicator */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((step) => {
          if (step < currentStep) {
            return (
              <span key={step} className="w-5 h-1.5 rounded-full bg-emerald-500 transition-all" />
            );
          }
          if (step === currentStep) {
            return (
              <span key={step} className="w-8 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 transition-all" />
            );
          }
          return (
            <span key={step} className="w-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 transition-all" />
          );
        })}
      </div>

      {/* Next/Continue Button */}
      <button
        type="button"
        disabled={isNextDisabled}
        onClick={onNextStep}
        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all ${
          isNextDisabled
            ? "bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed opacity-60"
            : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-xs"
        }`}
      >
        <span>{label}</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
};
