"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING" | "REMOVED";

interface StatusConfig {
  label: string;
  dotColor: string;
}

const STATUS_CONFIG: Record<UserStatus, StatusConfig> = {
  ACTIVE: {
    label: "Active",
    dotColor: "bg-emerald-500",
  },
  SUSPENDED: {
    label: "Suspended",
    dotColor: "bg-rose-500",
  },
  PENDING: {
    label: "Pending",
    dotColor: "bg-amber-500",
  },
  REMOVED: {
    label: "Removed",
    dotColor: "bg-slate-400",
  },
};

export function getUserStatusConfig(status: string): StatusConfig {
  return STATUS_CONFIG[status as UserStatus] ?? STATUS_CONFIG.PENDING;
}

interface UserStatusBadgeProps {
  status: string;
}

export function UserStatusBadge({ status }: UserStatusBadgeProps) {
  const config = getUserStatusConfig(status);
  return (
    <Badge
      variant="outline"
      className="gap-2 rounded-lg border-slate-200 bg-white font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
    >
      <span className={cn("size-2 rounded-full", config.dotColor)} />
      {config.label}
    </Badge>
  );
}

