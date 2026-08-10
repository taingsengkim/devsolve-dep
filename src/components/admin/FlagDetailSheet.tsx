"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  User,
  Calendar,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  FileText,
} from "lucide-react";
import { useGetFlagDetailQuery } from "@/lib/redux/services/admin/moderationApi";

interface FlagDetailSheetProps {
  flagId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onAction: (id: string, action: "DISMISS" | "WARN" | "REMOVE") => void;
}

export function FlagDetailSheet({
  flagId,
  isOpen,
  onClose,
  onAction,
}: FlagDetailSheetProps) {
  const { data: detail, isLoading, isError } = useGetFlagDetailQuery(
    flagId ?? "",
    { skip: !flagId || !isOpen }
  );

  if (!isOpen || !flagId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        {/* Header */}
        <DialogHeader className="space-y-2 pb-3 border-b border-slate-200/80 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold text-xs flex items-center gap-1">
              <Flag className="size-3" />
              Content Flag Detail
            </Badge>
            {detail?.status && (
              <Badge variant="outline" className="text-xs font-semibold">
                {detail.status}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Flag ID: #{flagId.slice(0, 8)}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            Detailed inspection of community content report.
          </DialogDescription>
        </DialogHeader>

        {/* Loading / Error / Data */}
        {isLoading ? (
          <div className="space-y-4 animate-pulse py-4">
            <div className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          </div>
        ) : isError ? (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400">
            Unable to load flag details from the server.
          </div>
        ) : detail ? (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
            {/* Reason & Type Card */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Reason
                </span>
                <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-xs">
                  {detail.reason}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Flaggable Type
                </span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">
                  {detail.flaggableType}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                  Flaggable ID
                </span>
                <span className="font-mono text-slate-600 dark:text-slate-400">
                  {detail.flaggableId}
                </span>
              </div>
            </div>

            {/* Reporter Info */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <User className="size-3.5 text-slate-400" />
                  Reporter
                </span>
                <span className="font-medium text-slate-600 dark:text-slate-400">
                  {detail.reporterName || detail.reporterId || "Anonymous"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
                  <Calendar className="size-3.5 text-slate-400" />
                  Reported At
                </span>
                <span className="text-slate-500">
                  {detail.createdAt
                    ? new Date(detail.createdAt).toLocaleString()
                    : "Recent"}
                </span>
              </div>
            </div>

            {/* Description / Snippet */}
            {detail.description && (
              <div className="space-y-1.5 p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <FileText className="size-3" /> Description / Note
                </span>
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {detail.description}
                </p>
              </div>
            )}
          </div>
        ) : null}

        {/* Footer Actions */}
        <DialogFooter className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              onAction(flagId, "DISMISS");
              onClose();
            }}
            className="flex-1 rounded-xl text-xs font-bold border-slate-300 dark:border-slate-700 cursor-pointer"
          >
            <XCircle className="size-3.5 mr-1 text-slate-500" />
            Dismiss
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onAction(flagId, "WARN");
              onClose();
            }}
            className="flex-1 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white cursor-pointer"
          >
            <AlertTriangle className="size-3.5 mr-1" />
            Warn Author
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              onAction(flagId, "REMOVE");
              onClose();
            }}
            className="flex-1 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
          >
            <ShieldAlert className="size-3.5 mr-1" />
            Remove Content
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
