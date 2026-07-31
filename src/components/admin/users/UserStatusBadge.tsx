"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

interface StatusConfig {
  label: string;
  className: string;
  icon: React.ElementType;
}

const STATUS_CONFIG: Record<UserStatus, StatusConfig> = {
  ACTIVE: {
    label: "Active",
    icon: CheckCircle2,
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  SUSPENDED: {
    label: "Suspended",
    icon: XCircle,
    className:
      "bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
  PENDING: {
    label: "Pending",
    icon: Clock,
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800",
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
  const Icon = config.icon;
  return (
    <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-bold gap-1 ${config.className}`}>
      <Icon className="w-3 h-3 shrink-0" />
      {config.label}
    </Badge>
  );
}
