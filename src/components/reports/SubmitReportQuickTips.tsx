"use client";

import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";

export const SubmitReportQuickTips: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3 font-sans">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span>Triage Quick Tips</span>
      </div>

      <ul className="space-y-2.5 text-sm text-slate-700 dark:text-slate-300 font-medium">
        <li className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <span>Include full HTTP request & response when applicable</span>
        </li>
        <li className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <span>Specific, clear titles get triaged up to 2x faster</span>
        </li>
        <li className="flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
          <span>Accurate CVSS scores assist faster bounty calculation</span>
        </li>
      </ul>
    </div>
  );
};

