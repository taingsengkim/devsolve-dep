import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export function ReportStatusTracker() {
  return (
    <div className="pt-3 flex flex-wrap items-center gap-2 sm:gap-4 border-t border-slate-100">
      {/* Step 1: Submitted */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-sm font-bold">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>Submitted</span>
      </div>
      <div className="hidden sm:block w-4 h-0.5 bg-slate-200" />

      {/* Step 2: Accepted */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 text-sm font-bold">
        <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
        <span>Accepted</span>
      </div>
      <div className="hidden sm:block w-4 h-0.5 bg-slate-200" />

      {/* Step 3: Resolved */}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 text-sm font-medium">
        <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span>Resolved</span>
      </div>
    </div>
  );
}
