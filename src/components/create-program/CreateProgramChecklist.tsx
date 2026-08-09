"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import type { StepItem } from "./types";

interface CreateProgramChecklistProps {
  steps: StepItem[];
  activeTab: number;
  setActiveTab: (step: number) => void;
}

export function CreateProgramChecklist({
  steps,
  activeTab,
  setActiveTab,
}: CreateProgramChecklistProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
      <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-200/80 dark:border-slate-800 pb-3">
        Setup Progress
      </h3>

      <div className="space-y-3">
        {steps.map((s) => {
          const isDone = activeTab > s.id;
          const isCurrent = activeTab === s.id;

          return (
            <div
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                isCurrent
                  ? "bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              <div className="flex items-center gap-3">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                      isCurrent
                        ? "border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400"
                        : "border-slate-300 dark:border-slate-700 text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    {s.id}
                  </div>
                )}
                <span
                  className={`text-sm font-semibold ${
                    isCurrent
                      ? "text-blue-700 dark:text-blue-300"
                      : isDone
                        ? "text-slate-800 dark:text-slate-200"
                        : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {s.label}
                </span>
              </div>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {isDone ? "Done" : isCurrent ? "In Progress" : "Pending"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
