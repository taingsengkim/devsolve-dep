"use client";

import React from "react";
import { Check } from "lucide-react";
import type { StepItem } from "./types";

interface CreateProgramStepperProps {
  steps: StepItem[];
  activeTab: number;
  setActiveTab: (step: number) => void;
}

export function CreateProgramStepper({
  steps,
  activeTab,
  setActiveTab,
}: CreateProgramStepperProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
      {steps.map((step) => {
        const Icon = step.icon;
        const isActive = activeTab === step.id;
        const isCompleted = activeTab > step.id;

        return (
          <button
            key={step.id}
            onClick={() => setActiveTab(step.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white dark:bg-blue-600 dark:text-white shadow-xs"
                : isCompleted
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100/70 dark:hover:bg-blue-500/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            }`}
          >
            {isCompleted ? (
              <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            ) : (
              <Icon className="w-4 h-4" />
            )}
            <span>{step.label}</span>
          </button>
        );
      })}
    </div>
  );
}
