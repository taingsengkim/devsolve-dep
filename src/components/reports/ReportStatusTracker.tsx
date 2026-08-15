import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export function ReportStatusTracker() {
  return (
    <div className="pt-3 flex flex-wrap items-center gap-2 sm:gap-4 border-t border-border">
      {/* Step 1: Submitted */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 text-sm font-bold">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Submitted</span>
      </div>
      <div className="hidden sm:block w-4 h-0.5 bg-border" />

      {/* Step 2: Accepted */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 text-sm font-bold">
        <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span>Accepted</span>
      </div>
      <div className="hidden sm:block w-4 h-0.5 bg-border" />

      {/* Step 3: Resolved */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-muted text-muted-foreground border border-border text-sm font-medium">
        <Circle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span>Resolved</span>
      </div>
    </div>
  );
}
