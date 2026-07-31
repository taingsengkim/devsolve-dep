import React from "react";
import { CheckCircle2, XCircle, Clock, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";

interface StatusConfig {
  label: string;
  badgeClass: string;
  icon: React.ElementType;
}

const STATUS_CONFIG: Record<VerificationStatus, StatusConfig> = {
  APPROVED: {
    label: "Approved & Verified",
    icon: CheckCircle2,
    badgeClass:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    badgeClass:
      "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    icon: Eye,
    badgeClass:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  PENDING: {
    label: "Pending KYC",
    icon: Clock,
    badgeClass:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
};

export function getStatusConfig(status: string): StatusConfig {
  return STATUS_CONFIG[status as VerificationStatus] ?? STATUS_CONFIG.PENDING;
}

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const Icon = config.icon;
  const sizeClass = size === "md" ? "px-3 py-1 text-sm" : "px-2.5 py-0.5 text-xs";

  return (
    <Badge
      className={`rounded-full font-bold gap-1 ${sizeClass} ${config.badgeClass}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      {config.label}
    </Badge>
  );
}
