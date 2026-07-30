"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface SubmitReportSeverityCardProps {
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
}

const SEVERITY_CONFIG = {
  CRITICAL: {
    label: "Critical",
    scoreRange: "9.0–10.0",
    description: "Full system compromise, data breach, or catastrophic impact",
    typicalBounty: "Typically $3,000–$10,000+",
    colorClass: "text-red-600 dark:text-red-400",
    bgClass: "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50",
  },
  HIGH: {
    label: "High",
    scoreRange: "7.0–8.9",
    description: "Significant access privilege escalation, data exposure, or server flaw",
    typicalBounty: "Typically $1,500–$3,000",
    colorClass: "text-orange-600 dark:text-orange-400",
    bgClass: "bg-orange-50/70 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/50",
  },
  MEDIUM: {
    label: "Medium",
    scoreRange: "4.0–6.9",
    description: "Partial vulnerability with limited impact or conditional exploit scenario",
    typicalBounty: "Typically $500–$1,500",
    colorClass: "text-amber-600 dark:text-amber-400",
    bgClass: "bg-amber-50/70 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50",
  },
  LOW: {
    label: "Low",
    scoreRange: "0.1–3.9",
    description: "Minor security weakness, non-sensitive data leak, or strict preconditions",
    typicalBounty: "Typically $100–$500",
    colorClass: "text-blue-600 dark:text-blue-400",
    bgClass: "bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50",
  },
  INFO: {
    label: "Info",
    scoreRange: "0.0",
    description: "Informational submission or best practice recommendation without direct risk",
    typicalBounty: "Swag or Reputation Points",
    colorClass: "text-slate-600 dark:text-slate-400",
    bgClass: "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800",
  },
};

export const SubmitReportSeverityCard: React.FC<SubmitReportSeverityCardProps> = ({ severity }) => {
  const config = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.CRITICAL;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={severity}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl border p-5 space-y-3 font-sans shadow-xs ${config.bgClass}`}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Severity
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-4 h-4 shrink-0 ${config.colorClass}`} />
            <span className={`text-base font-bold tracking-tight ${config.colorClass}`}>
              {config.label}
            </span>
          </div>
          <span className={`text-xs font-bold tracking-tight ${config.colorClass}`}>
            {config.scoreRange}
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
          {config.description}
        </p>

        <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70 text-xs font-medium text-slate-500 dark:text-slate-400">
          {config.typicalBounty}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
