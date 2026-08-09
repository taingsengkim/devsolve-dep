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
import { SolutionResponse, SolutionReviewStatus } from "@/lib/types/admin/solutionAdminTypes";
import { ClipboardList, CheckCircle2, XCircle, Video, FileCode, ExternalLink, Calendar } from "lucide-react";
import { toast } from "sonner";

interface SolutionReviewModalProps {
  selectedSolution: SolutionResponse | null;
  onClose: () => void;
  onUpdateReviewStatus: (
    id: string,
    status: SolutionReviewStatus,
    reason?: string
  ) => Promise<void>;
}

export const SolutionReviewModal: React.FC<SolutionReviewModalProps> = ({
  selectedSolution,
  onClose,
  onUpdateReviewStatus,
}) => {
  const [rejectionReason, setRejectionReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!selectedSolution) return null;

  const handleAction = async (status: SolutionReviewStatus) => {
    try {
      setIsSubmitting(true);
      await onUpdateReviewStatus(
        selectedSolution.id,
        status,
        status === "REJECTED" ? rejectionReason : undefined
      );
      toast.success(
        status === "APPROVED" || status === "ACCEPTED"
          ? `Solution approved!`
          : `Solution rejected.`
      );
      setRejectionReason("");
      onClose();
    } catch (err) {
      toast.error("Failed to update solution review status.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={!!selectedSolution} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl rounded-2xl bg-white dark:bg-slate-900 p-6 border border-slate-200 dark:border-slate-800 shadow-xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pt-1">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Solution Review — ID: {selectedSolution.id}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
            Problem ID: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{selectedSolution.problemId}</span>
          </DialogDescription>
        </DialogHeader>

        {/* METADATA GRID */}
        <div className="space-y-4 my-2 text-xs">
          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Submitted:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {selectedSolution.createdAt
                  ? new Date(selectedSolution.createdAt).toLocaleDateString()
                  : "—"}
              </span>
            </div>
            {selectedSolution.authorId && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">Author ID:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">
                  {selectedSolution.authorId}
                </span>
              </div>
            )}
          </div>

          {/* MEDIA LINKS */}
          {(selectedSolution.videoUrl || selectedSolution.diagramUrl) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {selectedSolution.videoUrl && (
                <a
                  href={selectedSolution.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-semibold text-xs hover:underline"
                >
                  <Video className="w-4 h-4" /> Watch Video Explanation
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
              {selectedSolution.diagramUrl && (
                <a
                  href={selectedSolution.diagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-semibold text-xs hover:underline"
                >
                  <FileCode className="w-4 h-4" /> View Architecture Diagram
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              )}
            </div>
          )}

          {/* DESCRIPTION */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
              Solution Description & Technical Explanation
            </h4>
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto font-mono text-xs">
              {selectedSolution.description || "No description provided."}
            </div>
          </div>

          {/* REJECTION REASON FIELD */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Rejection Reason (Required if rejecting)
            </label>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Incomplete code snippet, invalid approach, or non-reproducible fix..."
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs min-h-[70px] p-2.5 shadow-none resize-none"
            />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row justify-end items-center gap-2 pt-2">
          <Button
            variant="destructive"
            disabled={isSubmitting}
            onClick={() => handleAction("REJECTED")}
            className="rounded-xl font-semibold h-10 cursor-pointer w-full sm:w-auto text-sm"
          >
            <XCircle className="w-4 h-4 mr-1.5" />
            Reject Solution
          </Button>

          <Button
            disabled={isSubmitting}
            onClick={() => handleAction("APPROVED")}
            className="rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-700 text-white h-10 cursor-pointer w-full sm:w-auto text-sm shadow-2xs"
          >
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            Approve Solution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
