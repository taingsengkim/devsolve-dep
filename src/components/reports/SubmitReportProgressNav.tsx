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
  const progressPercentage = (currentStep / 5) * 100;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4 font-sans">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          <span>Progress</span>
          <span className="text-blue-600 dark:text-blue-400 font-bold">
            Step {currentStep} of 5
          </span>
        </div>
        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-blue-600 dark:bg-blue-500 rounded-full"
            initial={{ width: "20%" }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Step List Items */}
      <div className="space-y-1.5 pt-1">
        {STEPS.map((step) => {
          const IconComponent = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = completedSteps.includes(step.id) && !isActive;
          const isClickable = completedSteps.includes(step.id) || step.id <= currentStep;

          return (
            <motion.button
              key={step.id}
              type="button"
              disabled={!isClickable}
              onClick={() => isClickable && onSelectStep(step.id)}
              whileHover={isClickable ? { x: 2 } : {}}
              whileTap={isClickable ? { scale: 0.99 } : {}}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all text-left ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : isCompleted
                  ? "bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  : "text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-70"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isCompleted
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <IconComponent className="w-3.5 h-3.5" />
                  )}
                </div>
                <span className="tracking-tight">{step.label}</span>
              </div>

              {isActive && <ChevronRight className="w-4 h-4 opacity-80 shrink-0" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
