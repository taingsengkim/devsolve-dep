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
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4 font-sans"
    >
      {/* Program Header */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-xs">
          CV
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate tracking-tight">
            {programName}
          </h3>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{companyName}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium text-xs sm:text-sm">
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            Max Bounty
          </span>
          <span className="font-bold text-slate-900 dark:text-slate-100">{maxBounty}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium text-xs sm:text-sm">
            <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            Avg Response
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">{avgResponse}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium text-xs sm:text-sm">
            <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
            Scope Items
          </span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {scopeItemsCount} targets
          </span>
        </div>
      </div>

      <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800/80">
        <Link
          href="/dashboard/programs"
          className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span>View program details & rules</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};

