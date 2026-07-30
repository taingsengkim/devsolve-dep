"use client";

import { motion } from "motion/react";
import { SeverityStats } from "@/lib/types/profile/types";

interface SeverityBreakdownProps {
  severity: SeverityStats;
}

const SEVERITY_ROWS: { key: keyof Pick<SeverityStats, "critical" | "high" | "medium" | "low">; label: string; color: string }[] = [
  { key: "critical", label: "Critical", color: "bg-red-500" },
  { key: "high", label: "High", color: "bg-orange-500" },
  { key: "medium", label: "Medium", color: "bg-amber-400" },
  { key: "low", label: "Low", color: "bg-blue-500" },
];

export default function SeverityBreakdown({ severity }: SeverityBreakdownProps) {
  const max = Math.max(severity.critical, severity.high, severity.medium, severity.low, 1);

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Severity Breakdown</p>

      <div className="mt-4 space-y-3.5">
        {SEVERITY_ROWS.map((row) => {
          const value = severity[row.key];
          const pct = Math.max((value / max) * 100, 4);
          return (
            <div key={row.key} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-sm font-semibold text-slate-700">{row.label}</span>
              <div className="h-2.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className={`h-full rounded-full ${row.color}`}
                />
              </div>
              <span className="w-6 shrink-0 text-right text-sm font-bold text-slate-800">{value}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-center">
        <div>
          <p className="text-lg font-bold text-red-500">{severity.rejected}</p>
          <p className="text-xs font-medium text-slate-400">Rejected</p>
        </div>
        <div>
          <p className="text-lg font-bold text-amber-500">{severity.duplicate}</p>
          <p className="text-xs font-medium text-slate-400">Duplicate</p>
        </div>
        <div>
          <p className="text-lg font-bold text-emerald-600">{severity.retests}</p>
          <p className="text-xs font-medium text-slate-400">Retests</p>
        </div>
      </div>
    </div>
  );
}