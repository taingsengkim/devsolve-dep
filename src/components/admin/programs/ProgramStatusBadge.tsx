"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * A program carries two independent statuses: where its submission stands with
 * an admin, and where the program itself stands in its own lifecycle. Both
 * read as the users dashboard's badge does — a neutral chip with one coloured
 * dot — so a row's colour comes from meaning rather than from decoration.
 */

interface StatusConfig {
  label: string;
  dotColor: string;
}

const SUBMISSION_CONFIG: Record<string, StatusConfig> = {
  PENDING_REVIEW: { label: "Pending Review", dotColor: "bg-amber-500" },
  APPROVED: { label: "Approved", dotColor: "bg-emerald-500" },
  REJECTED: { label: "Rejected", dotColor: "bg-rose-500" },
};

const STATE_CONFIG: Record<string, StatusConfig> = {
  ACTIVE: { label: "Active", dotColor: "bg-emerald-500" },
  PAUSED: { label: "Paused", dotColor: "bg-amber-500" },
  CLOSED: { label: "Closed", dotColor: "bg-rose-500" },
  DRAFT: { label: "Draft", dotColor: "bg-slate-400" },
};

const CHIP =
  "gap-2 rounded-lg border-slate-200 bg-white font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300";

function StatusChip({ config }: { config: StatusConfig }) {
  return (
    <Badge variant="outline" className={CHIP}>
      <span className={cn("size-2 rounded-full", config.dotColor)} />
      {config.label}
    </Badge>
  );
}

/** Where the submission stands with an admin. */
export function ProgramReviewBadge({ status }: { status: string }) {
  const config = SUBMISSION_CONFIG[status] ?? {
    label: status,
    dotColor: "bg-slate-400",
  };
  return <StatusChip config={config} />;
}

/** Where the program stands in its own lifecycle. */
export function ProgramStateBadge({ state }: { state: string }) {
  const config = STATE_CONFIG[state] ?? STATE_CONFIG.DRAFT;
  return <StatusChip config={config} />;
}
