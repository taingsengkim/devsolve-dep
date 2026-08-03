"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, ShieldAlert } from "lucide-react";
import type { ContentReportItem } from "@/lib/redux/services/adminApi";

export type ModerationActionType = "WARN" | "REMOVE";

interface ModerationActionDialogProps {
  report: ContentReportItem | null;
  actionType: ModerationActionType | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string, action: ModerationActionType, note?: string) => void;
}

export function ModerationActionDialog({
  report,
  actionType,
  isOpen,
  onClose,
  onConfirm,
}: ModerationActionDialogProps) {
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report || !actionType) return null;

  const isRemove = actionType === "REMOVE";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      onConfirm(report.id, actionType, note);
      setNote("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div
              className={`size-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isRemove
                  ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                  : "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400"
              }`}
            >
              {isRemove ? (
                <Trash2 className="size-5.5" />
              ) : (
                <AlertTriangle className="size-5.5" />
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {isRemove ? "Remove Reported Content" : "Issue Warning to Author"}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target Author:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  @{report.author}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content Item Summary */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="uppercase tracking-wider font-extrabold">
              {report.type}
            </span>
            <span>{report.reportCount} reports</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
            {report.title}
          </p>
        </div>

        {/* Moderator Note Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Moderator Rationale / Warning Message (Optional)
            </Label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={
                isRemove
                  ? "Specify reason for removal (e.g. Terms of Service violation)..."
                  : "Enter warning message to send to the author..."
              }
              rows={3}
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl h-10 text-xs font-semibold border-slate-300 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-xl h-10 text-xs font-bold cursor-pointer text-white shadow-2xs ${
                isRemove
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-amber-600 hover:bg-amber-700"
              }`}
            >
              {isRemove ? (
                <>
                  <Trash2 className="size-4 mr-1.5" /> Confirm Removal
                </>
              ) : (
                <>
                  <ShieldAlert className="size-4 mr-1.5" /> Send Warning
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
