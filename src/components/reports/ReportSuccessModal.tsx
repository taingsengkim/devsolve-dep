"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  PlusCircle,
  Copy,
  Check,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [copied, setCopied] = useState(false);

  const handleCopyReportId = () => {
    if (!reportId) return;
    navigator.clipboard.writeText(reportId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onReset()}>
      <DialogContent showCloseButton className="sm:max-w-md p-6 sm:p-7 rounded-2xl gap-6">
        {/* Success Checkmark Icon & Clean Header */}
        <DialogHeader className="text-center sm:text-center flex flex-col items-center gap-3">
          <div className="size-14 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-2xs">
            <CheckCircle2 className="size-8 stroke-[2]" />
          </div>

          <div className="space-y-1">
            <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Report Submitted Successfully
            </DialogTitle>

            <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-sm mx-auto">
              Your vulnerability report has been logged and queued for triaging by the security team.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Clean Info Summary Card */}
        <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200/80 dark:border-slate-800/80 text-left space-y-3">
          {/* Report ID */}
          <div className="grid grid-cols-3 gap-2 items-center">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Report ID
            </span>
            <div className="col-span-2 flex items-center gap-1.5">
              <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                {reportId || "RPT-2026-88192"}
              </span>
              <button
                type="button"
                onClick={handleCopyReportId}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 rounded-md cursor-pointer"
                title="Copy Report ID"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Program */}
          <div className="grid grid-cols-3 gap-2 items-center pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Program
            </span>
            <span className="col-span-2 text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
              {programName || "Security Program"}
            </span>
          </div>

          {/* Title */}
          <div className="grid grid-cols-3 gap-2 items-start pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 pt-0.5">
              Title
            </span>
            <span className="col-span-2 text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
              {title || "Vulnerability Report"}
            </span>
          </div>
        </div>

        {/* Dialog Actions */}
        <DialogFooter className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            className="w-full sm:w-1/2 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm h-10 rounded-xl cursor-pointer"
          >
            <PlusCircle className="size-4 mr-1.5 text-slate-500" />
            <span>Submit Another</span>
          </Button>

          <Link href="/dashboard/my-reports" className="w-full sm:w-1/2">
            <Button
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm h-10 rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>View My Reports</span>
              <ArrowRight className="size-4" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
