"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Award, Clock, Target } from "lucide-react";
import { motion } from "motion/react";

interface SubmitReportProgramCardProps {
  programName?: string;
  companyName?: string;
  maxBounty?: string;
  avgResponse?: string;
  scopeItemsCount?: number;
}

export const SubmitReportProgramCard: React.FC<SubmitReportProgramCardProps> = ({
  programName = "CloudVault Security Program",
  companyName = "CloudVault Inc.",
  maxBounty = "$10,000",
  avgResponse = "2 days",
  scopeItemsCount = 3,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-[0_2px_12px_rgba(0,0,0,0.04)] space-y-4 font-sans"
    >
      {/* Program Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs">
          CV
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
            {programName}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{companyName}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-xs">
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            Max Bounty
          </span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{maxBounty}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            Avg Response
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{avgResponse}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            Scope Items
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {scopeItemsCount} targets
          </span>
        </div>
      </div>

      <div className="pt-1 text-center border-t border-slate-100 dark:border-slate-800/80">
        <Link
          href="#"
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors pt-2"
        >
          <span>View program rules</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
};
