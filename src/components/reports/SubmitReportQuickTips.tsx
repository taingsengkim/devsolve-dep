"use client";

import React from "react";
import { BookOpen } from "lucide-react";

export const SubmitReportQuickTips: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        <BookOpen className="w-3.5 h-3.5" />
        <span>Quick Tips</span>
      </div>

      <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <span>Include the full HTTP request/response when relevant</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <span>A specific title gets triaged up to 2x faster</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
          <span>CVSS score helps bounty negotiation — include it when confident</span>
        </li>
      </ul>
    </div>
  );
};
