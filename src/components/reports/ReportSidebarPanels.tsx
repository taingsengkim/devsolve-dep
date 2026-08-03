import React from "react";
import { Info, ExternalLink } from "lucide-react";
import SeverityBadge from "@/components/reports/SeverityBadge";

interface ReportSidebarPanelsProps {
  severity: string;
}

export function ReportSidebarPanels({ severity }: ReportSidebarPanelsProps) {
  return (
    <aside className="space-y-6">
      {/* Severity Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          SEVERITY
        </h4>
        <div>
          <SeverityBadge severity={severity || "HIGH"} />
        </div>
        <div className="space-y-2.5 pt-2 border-t border-slate-100 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Confirmed Severity</span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
              High (8.1)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Claimed Severity</span>
            <span className="font-semibold text-slate-700">Critical (9.0)</span>
          </div>
        </div>
      </div>

      {/* Reward Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          REWARD
        </h4>
        <div className="text-2xl font-black text-slate-900 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200/80 inline-block">
          $1,500.00
        </div>
        <div className="text-sm font-bold text-slate-500">
          Status: <span className="text-amber-600">Pending Transfer</span>
        </div>
        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-amber-800">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Payment is handled off-platform via corporate payroll. Please ensure your wallet details are up to date.
          </p>
        </div>
      </div>

      {/* Program Details Panel */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
          PROGRAM DETAILS
        </h4>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
            B
          </div>
          <div className="flex flex-col min-w-0">
            <strong className="text-base font-bold text-slate-900 truncate">
              Global Enterprise VDP
            </strong>
            <a
              href="#"
              className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-semibold"
            >
              <span>View Policy</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        <div className="space-y-2 pt-3 border-t border-slate-100 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Asset Type</span>
            <span className="font-semibold text-slate-800">REST API</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Environment</span>
            <span className="font-semibold text-slate-800">Production</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
