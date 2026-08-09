"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface ProgramRejectDialogProps {
  open: boolean;
  programName?: string;
  onClose: () => void;
  onConfirmReject: (reason: string) => Promise<void>;
}

export const ProgramRejectDialog: React.FC<ProgramRejectDialogProps> = ({
  open,
  programName,
  onClose,
  onConfirmReject,
}) => {
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Please provide a rejection reason.");
      return;
    }
    try {
      setIsSubmitting(true);
      await onConfirmReject(reason.trim());
      toast.success(`Program "${programName || ""}" rejected.`);
      setReason("");
      onClose();
    } catch (err) {
      toast.error("Failed to reject program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
        <DialogHeader className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Reject Program Submission
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 font-normal">
            Please state the specific reason for rejecting{" "}
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              "{programName}"
            </span>
            . The organization manager will receive this feedback.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
            Rejection Feedback & Policy Violations *
          </label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Incomplete scope assets definition, non-compliant bounty rules, or invalid program handle..."
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm min-h-[96px] p-3 focus-visible:ring-1 focus-visible:ring-rose-500 shadow-none resize-none"
          />
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-2">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto text-sm border-slate-200 dark:border-slate-800"
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={isSubmitting || !reason.trim()}
            onClick={handleReject}
            className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto text-sm shadow-2xs"
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
