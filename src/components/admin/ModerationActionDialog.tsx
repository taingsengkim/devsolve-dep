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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Trash2,
  ShieldAlert,
  UserX,
  Ban,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useCreateModerationActionMutation } from "@/lib/redux/services/admin/moderationActionsApi";
import { useUpdateContentReportActionMutation } from "@/lib/redux/services/admin/moderationApi";
import type {
  ModerationActionType,
  ModerationActionTargetType,
  ContentReportItem,
} from "@/lib/types/admin/types";
import { DateTimePicker } from "@/components/ui/datetime-picker";

export interface TargetDetails {
  id: string;
  name: string;
  subtitle?: string;
  type?: string;
  status?: string;
}

interface ModerationActionDialogProps {
  report?: ContentReportItem | null;
  target?: TargetDetails | null;
  actionType?: ModerationActionType | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
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
  const targetId = report?.id || target?.id;
  if (!isOpen || !targetId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <ModerationActionForm
        key={`${targetId}-${initialActionType ?? "default"}`}
        report={report}
        target={target}
        initialActionType={initialActionType}
        onClose={onClose}
        onSuccess={onSuccess}
        onConfirm={onConfirm}
      />
    </Dialog>
  );
}

function ModerationActionForm({
  report,
  target,
  initialActionType,
  onClose,
  onSuccess,
  onConfirm,
}: {
  report?: ContentReportItem | null;
  target?: TargetDetails | null;
  initialActionType?: ModerationActionType | null;
  onClose: () => void;
  onSuccess?: () => void;
  onConfirm?: (id: string, action: ModerationActionType, note?: string) => void;
}) {
  const defaultAction = initialActionType || "WARN";
  const [action, setAction] = useState<ModerationActionType>(defaultAction);
  const [reason, setReason] = useState("");
  const [expiresAt, setExpiresAt] = useState(() => {
    if (defaultAction === "SUSPEND") {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      return d.toISOString().slice(0, 16);
    }
    return "";
  });

  const [createModerationAction, { isLoading: isCreatingAction }] =
    useCreateModerationActionMutation();
  const [updateContentReport, { isLoading: isUpdatingReport }] =
    useUpdateContentReportActionMutation();

  const isSubmitting = isCreatingAction || isUpdatingReport;

  const targetId = report?.id || target?.id || "";
  const targetName = report?.author || target?.name || "Target Entity";
  const targetTitle = report?.title || target?.subtitle || target?.type || "";

  const handleActionChange = (newAction: ModerationActionType) => {
    setAction(newAction);
    if (newAction === "SUSPEND" && !expiresAt) {
      const d = new Date();
      d.setDate(d.getDate() + 30);
      setExpiresAt(d.toISOString().slice(0, 16));
    }
  };

  const setPresetDays = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    setExpiresAt(d.toISOString().slice(0, 16));
  };

  const getActionColorClass = (act: ModerationActionType) => {
    switch (act) {
      case "WARN":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20";
      case "SUSPEND":
        return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20";
      case "REMOVE":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
      case "BAN":
        return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20";
      case "REINSTATE":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getActionIcon = (act: ModerationActionType) => {
    switch (act) {
      case "WARN":
        return <ShieldAlert className="size-5" />;
      case "SUSPEND":
        return <UserX className="size-5" />;
      case "REMOVE":
        return <Trash2 className="size-5" />;
      case "BAN":
        return <Ban className="size-5" />;
      case "REINSTATE":
        return <RotateCcw className="size-5" />;
    }
  };

  const getButtonBgClass = (act: ModerationActionType) => {
    switch (act) {
      case "WARN":
        return "bg-amber-600 hover:bg-amber-700 text-white";
      case "SUSPEND":
        return "bg-orange-600 hover:bg-orange-700 text-white";
      case "REMOVE":
        return "bg-rose-600 hover:bg-rose-700 text-white";
      case "BAN":
        return "bg-purple-600 hover:bg-purple-700 text-white";
      case "REINSTATE":
        return "bg-emerald-600 hover:bg-emerald-700 text-white";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error("Moderation reason is required.");
      return;
    }

    if (action === "SUSPEND" && !expiresAt) {
      toast.error("Action expiration date is required for suspension.");
      return;
    }

    try {
      const formattedExpiresAt =
        action === "SUSPEND" && expiresAt
          ? new Date(expiresAt).toISOString()
          : undefined;

      const targetType = report
        ? (report.type as ModerationActionTargetType)
        : (target?.type as ModerationActionTargetType) || "USER";

      // 1. Create moderation action audit log
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

      // 2. If this was triggered from a content report flag, resolve the flag too
      if (report) {
        await updateContentReport({
          id: report.id,
          action,
          resolutionNote: reason.trim(),
          removeContent: action === "REMOVE",
        }).unwrap();
      }

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
    <DialogContent className="sm:max-w-md rounded-2xl bg-card border border-border text-card-foreground p-6 shadow-xl space-y-4">
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
            <DialogTitle className="text-lg font-bold text-foreground">
              Apply Moderation Action
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
              Target:{" "}
              <span className="font-semibold text-foreground">
                {targetName}
              </span>
            </DialogDescription>
          </div>
        </div>
      </DialogHeader>

      {/* Content/Entity Item Summary */}
      {targetTitle && (
        <div className="p-3.5 rounded-xl bg-muted/50 border border-border space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
            <span className="uppercase tracking-wider font-extrabold">
              {report?.type || target?.type || "TARGET"}
            </span>
            {report?.reportCount && <span>{report.reportCount} reports</span>}
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2">
            {targetTitle}
          </p>
        </div>
      )}

      {/* Moderation Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Action Select */}
        {(() => {
          const isTargetRemoved =
            (report?.status as string) === "REMOVED" ||
            target?.status === "REMOVED";
          const isTargetSuspended =
            (report?.status as string) === "SUSPENDED" ||
            target?.status === "SUSPENDED";
          const isTargetActive =
            (report?.status as string) === "ACTIVE" ||
            target?.status === "ACTIVE";
          return (
            <div className="space-y-2">
              <Label className="text-xs font-bold text-foreground">
                Select Action Type
              </Label>
              <Select
                value={action}
                onValueChange={(val: string | null) => {
                  if (val) handleActionChange(val as ModerationActionType);
                }}
              >
                <SelectTrigger className="w-full h-10 rounded-xl bg-card border-border text-sm text-foreground">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="border-border bg-card text-card-foreground">
                  <SelectItem value="WARN" disabled={isTargetRemoved}>
                    {isTargetRemoved ? "WARN (User Removed)" : "WARN"}
                  </SelectItem>
                  <SelectItem
                    value="SUSPEND"
                    disabled={isTargetSuspended || isTargetRemoved}
                  >
                    {isTargetRemoved
                      ? "SUSPEND (User Removed)"
                      : isTargetSuspended
                      ? "SUSPEND (Already suspended)"
                      : "SUSPEND"}
                  </SelectItem>
                  <SelectItem value="REMOVE" disabled={isTargetRemoved}>
                    {isTargetRemoved ? "REMOVE (Already removed)" : "REMOVE"}
                  </SelectItem>
                  <SelectItem value="BAN" disabled={isTargetRemoved}>
                    {isTargetRemoved ? "BAN (User Removed)" : "BAN"}
                  </SelectItem>
                  <SelectItem value="REINSTATE" disabled={isTargetActive}>
                    {isTargetActive
                      ? "REINSTATE (User account is already active)"
                      : "REINSTATE"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          );
        })()}

        {/* Reason Input */}
        <div className="space-y-2">
          <Label className="text-xs font-bold text-foreground">
            Moderation Reason <span className="text-rose-500">*</span>
          </Label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Detailed reason for this moderation action..."
            rows={3}
            required
            maxLength={2000}
            className="w-full p-3 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Required Expiration Date (ONLY for SUSPEND) */}
        {action === "SUSPEND" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-foreground">
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
                    className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
            <DateTimePicker
              value={expiresAt}
              onChange={setExpiresAt}
              placeholder="Select expiration date & time"
            />
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-xl h-10 text-xs font-semibold border-border bg-card text-foreground cursor-pointer hover:bg-muted"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className={`rounded-xl h-10 text-xs font-bold cursor-pointer shadow-2xs ${getButtonBgClass(
              action
            )}`}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin mr-1.5" />
            ) : (
              getActionIcon(action)
            )}
            <span className="ml-1.5">Confirm {action}</span>
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}


