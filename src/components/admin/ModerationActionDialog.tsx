"use client";

import React, { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { AlertTriangle, Trash2, ShieldAlert, UserX, Ban, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateModerationActionMutation } from "@/lib/redux/services/admin/moderationActionsApi";
import type { ModerationActionType, ModerationActionTargetType } from "@/lib/types/admin/types";
import type { ContentReportItem } from "@/lib/redux/services/adminApi";

export interface TargetDetails {
  id: string;
  name: string;
  subtitle?: string;
  type?: string;
}

interface ModerationActionDialogProps {
  report?: ContentReportItem | null;
  target?: TargetDetails | null;
  actionType?: ModerationActionType | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  // Backward compatibility callback if needed
  onConfirm?: (id: string, action: ModerationActionType, note?: string) => void;
}

export function ModerationActionDialog({
  report,
  target,
  actionType: initialActionType,
  isOpen,
  onClose,
  onSuccess,
  onConfirm,
}: ModerationActionDialogProps) {
  const [action, setAction] = useState<ModerationActionType>(
    initialActionType || "WARN"
  );
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [createModerationAction, { isLoading }] =
    useCreateModerationActionMutation();

  useEffect(() => {
    if (initialActionType) {
      setAction(initialActionType);
    }
  }, [initialActionType]);

  useEffect(() => {
    if (isOpen && !expiresAt) {
      const defaultDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      setExpiresAt(defaultDate.toISOString().slice(0, 16));
    }
  }, [isOpen]);

  const targetId = report?.id || target?.id;
  const targetName = report?.author || target?.name || "Target Entity";
  const targetTitle = report?.title || target?.subtitle || target?.type || "";

  if (!isOpen || !targetId) return null;

  const setPresetDays = (days: number) => {
    const date = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
    setExpiresAt(date.toISOString().slice(0, 16));
  };

  const getActionColorClass = (act: ModerationActionType) => {
    switch (act) {
      case "WARN":
        return "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
      case "SUSPEND":
        return "bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800";
      case "REMOVE":
        return "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
      case "BAN":
        return "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getActionIcon = (act: ModerationActionType) => {
    switch (act) {
      case "WARN":
        return <ShieldAlert className="size-5.5" />;
      case "SUSPEND":
        return <UserX className="size-5.5" />;
      case "REMOVE":
        return <Trash2 className="size-5.5" />;
      case "BAN":
        return <Ban className="size-5.5" />;
    }
  };

  const getButtonBgClass = (act: ModerationActionType) => {
    switch (act) {
      case "WARN":
        return "bg-amber-600 hover:bg-amber-700";
      case "SUSPEND":
        return "bg-orange-600 hover:bg-orange-700";
      case "REMOVE":
        return "bg-rose-600 hover:bg-rose-700";
      case "BAN":
        return "bg-purple-600 hover:bg-purple-700";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Moderation reason is required.");
      return;
    }

    if (!expiresAt) {
      toast.error("Action expiration date is required.");
      return;
    }

    try {
      const formattedExpiresAt = new Date(expiresAt).toISOString();

      const targetType = report
        ? (report.type as ModerationActionTargetType)
        : (target?.type as ModerationActionTargetType) || "USER";

      await createModerationAction({
        id: targetId,
        body: {
          targetType,
          targetId,
          action,
          reason: reason.trim(),
          expiresAt: formattedExpiresAt,
        },
      }).unwrap();

      toast.success(`Moderation action '${action}' applied successfully.`);
      if (onConfirm) {
        onConfirm(targetId, action, reason);
      }
      if (onSuccess) {
        onSuccess();
      }
      setReason("");
      setExpiresAt("");
      onClose();
    } catch (err: unknown) {
      const message =
        (err as { data?: { message?: string } })?.data?.message ||
        "Failed to apply moderation action.";
      toast.error(message);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-xl space-y-4">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div
              className={`size-11 rounded-2xl flex items-center justify-center shrink-0 ${getActionColorClass(
                action
              )}`}
            >
              {getActionIcon(action)}
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Apply Moderation Action
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Target:{" "}
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  {targetName}
                </span>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Content/Entity Item Summary */}
        {targetTitle && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="uppercase tracking-wider font-extrabold">
                {report?.type || target?.type || "TARGET"}
              </span>
              {report?.reportCount && <span>{report.reportCount} reports</span>}
            </div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
              {targetTitle}
            </p>
          </div>
        )}

        {/* Moderation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Action Select */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Select Action Type
            </Label>
            <Select
              value={action}
              onValueChange={(val) => setAction(val as ModerationActionType)}
            >
              <SelectTrigger className="w-full h-10 rounded-xl bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm">
                <SelectValue placeholder="Select action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WARN">WARN — Issue official warning</SelectItem>
                <SelectItem value="SUSPEND">SUSPEND — Temporarily suspend</SelectItem>
                <SelectItem value="REMOVE">REMOVE — Hide or delete content/account</SelectItem>
                <SelectItem value="BAN">BAN — Permanently ban entity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Moderation Reason <span className="text-rose-500">*</span>
            </Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detailed reason for this moderation action..."
              rows={3}
              required
              className="w-full p-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>

          {/* Required Expiration Date */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Action Expiration Date <span className="text-rose-500">*</span>
              </Label>
              <div className="flex items-center gap-1">
                {[
                  { label: "+1D", days: 1 },
                  { label: "+7D", days: 7 },
                  { label: "+30D", days: 30 },
                  { label: "+90D", days: 90 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setPresetDays(preset.days)}
                    className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950 dark:hover:text-blue-400 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <Input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
              className="h-10 rounded-xl bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-blue-500"
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
              disabled={isLoading}
              className={`rounded-xl h-10 text-xs font-bold cursor-pointer text-white shadow-2xs ${getButtonBgClass(
                action
              )}`}
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin mr-1.5" />
              ) : (
                getActionIcon(action)
              )}
              <span className="ml-1.5">Confirm {action}</span>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
