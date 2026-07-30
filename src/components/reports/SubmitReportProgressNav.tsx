"use client";

import React from "react";
import { Check, Target, Shield, FileText, Terminal, Send, ChevronRight } from "lucide-react";
import { motion } from "motion/react";

export interface StepItem {
  id: number;
  label: string;
  icon: React.ElementType;
}

export const STEPS: StepItem[] = [
  { id: 1, label: "Target & Scope", icon: Target },
  { id: 2, label: "Classification", icon: Shield },
  { id: 3, label: "Report Details", icon: FileText },
  { id: 4, label: "Proof of Concept", icon: Terminal },
  { id: 5, label: "Review & Submit", icon: Send },
];

interface SubmitReportProgressNavProps {
  currentStep: number;
  completedSteps: number[];
  onSelectStep: (step: number) => void;
}

export const SubmitReportProgressNav: React.FC<SubmitReportProgressNavProps> = ({
  currentStep,
  completedSteps,
  onSelectStep,
}) => {
  const progressPercentage = Math.round((currentStep / STEPS.length) * 100);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3.5 font-sans shadow-xs">
      {/* Header & Monochromatic Micro Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span className="font-mono text-slate-900 dark:text-slate-100 font-bold">
            {currentStep}/5 ({progressPercentage}%)
          </span>
        </div>

        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-slate-900 dark:bg-slate-100 rounded-full"
            initial={{ width: "20%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Step List */}
      <div className="space-y-1">
        {STEPS.map((step) => {
          const IconComponent = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) || step.id < currentStep;
          const isClickable = completedSteps.includes(step.id) || step.id <= currentStep;

          return (
            <button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectStep(step.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                isActive
                  ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold shadow-xs"
                  : isCompleted
                  ? "text-slate-900 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer"
                  : "text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-50"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div
                  className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                      : isCompleted
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      : "text-slate-400 dark:text-slate-600"
                  }`}
                >
                  {isCompleted && !isActive ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <IconComponent className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="truncate tracking-tight">{step.label}</span>
              </div>

              {isActive && <ChevronRight className="w-4 h-4 opacity-70 shrink-0 ml-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
