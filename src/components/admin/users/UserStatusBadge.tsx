"use client";

import React from "react";

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
    <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
      <span className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      {config.label}
    </div>
  );
}

