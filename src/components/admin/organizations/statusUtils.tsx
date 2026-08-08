import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type VerificationStatus = "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";

interface StatusConfig {
  label: string;
  dotClass: string;
}

const STATUS_CONFIG: Record<VerificationStatus, StatusConfig> = {
  APPROVED: {
    label: "Approved & Verified",
    dotClass: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    dotClass: "bg-rose-500",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    dotClass: "bg-sky-500",
  },
  PENDING: {
    label: "Pending KYC",
    dotClass: "bg-amber-500",
  },
};

export function getStatusConfig(status: string): StatusConfig {
  return STATUS_CONFIG[status as VerificationStatus] ?? STATUS_CONFIG.PENDING;
}

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export function StatusBadge({ status, size = "sm", showIcon = true }: StatusBadgeProps) {
  const config = getStatusConfig(status);
  const sizeClass = size === "md" ? "h-7 px-3" : "h-6 px-2.5";

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-2 rounded-lg border-slate-200 bg-white text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
        sizeClass,
      )}
    >
      {showIcon && (
        <span
          aria-hidden="true"
          className={cn("size-2 shrink-0 rounded-full", config.dotClass)}
        />
      )}
      {config.label}
    </Badge>
  );
}
