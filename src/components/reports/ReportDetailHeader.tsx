import React from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportDetailHeaderProps {
  reportId: string;
  program: string;
  submittedAgo: string;
  isRejected: boolean;
  onBack: () => void;
  onToggleDemoView: (rejected: boolean) => void;
}

export function ReportDetailHeader({
  reportId,
  program,
  submittedAgo,
  isRejected,
  onBack,
  onToggleDemoView,
}: ReportDetailHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              My Reports
            </h1>
            <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200/80 font-bold text-xs px-2.5 py-0.5 rounded-md">
              {reportId}
            </Badge>
          </div>
          <p className="text-base text-slate-500 font-medium">
            {program} &bull; Submitted {submittedAgo}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="self-start sm:self-auto cursor-pointer rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all gap-2 px-4 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
      </header>

      {/* Demo View Toggle Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Report Status Demo View:</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleDemoView(false)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
              !isRejected
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
            }`}
          >
            Accepted View
          </button>
          <button
            onClick={() => onToggleDemoView(true)}
            className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs transition-all cursor-pointer ${
              isRejected
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200/70"
            }`}
          >
            Rejected View
          </button>
        </div>
      </div>
    </div>
  );
}
