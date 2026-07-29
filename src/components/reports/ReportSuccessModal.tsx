"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, ShieldCheck, ArrowRight, PlusCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportSuccessModalProps {
  isOpen: boolean;
  reportId: string;
  programName: string;
  title: string;
  onReset: () => void;
}

export const ReportSuccessModal: React.FC<ReportSuccessModalProps> = ({
  isOpen,
  reportId,
  programName,
  title,
  onReset,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 text-center space-y-6 relative overflow-hidden"
        >
          {/* Accent Header Glow */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Success Check Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1.5 shadow-none">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>TRIAGING IN PROGRESS</span>
            </Badge>

            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Report Submitted Successfully!
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Your vulnerability report has been logged and queued for triaging by the program security team.
            </p>
          </div>

          {/* Report Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Report ID:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100 text-sm">
                {reportId}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-medium">Target Program:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                {programName}
              </span>
            </div>
            <div className="flex items-start justify-between gap-2 pt-1 border-t border-slate-200/60 dark:border-slate-700/60">
              <span className="text-slate-400 font-medium shrink-0">Title:</span>
              <span className="font-medium text-slate-700 dark:text-slate-300 text-right line-clamp-2">
                {title}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="w-full sm:w-1/2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs h-10 rounded-xl cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Submit Another</span>
            </Button>

            <Link href="/dashboard/my-reports" className="w-full sm:w-1/2">
              <Button
                type="button"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs h-10 rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                <span>View My Reports</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
