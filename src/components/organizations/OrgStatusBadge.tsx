"use client";

import { OrganizationStatus } from "@/lib/redux/services/organizationsApi";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

interface OrgStatusBadgeProps {
  status: OrganizationStatus;
  className?: string;
}

export function OrgStatusBadge({ status, className }: OrgStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return (
        <Badge
          className={`bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 gap-1.5 px-2.5 py-1 text-xs font-semibold ${className ?? ""}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Active / Verified
        </Badge>
      );
    case "PENDING":
      return (
        <Badge
          className={`bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30 gap-1.5 px-2.5 py-1 text-xs font-semibold ${className ?? ""}`}
        >
          <Clock className="w-3.5 h-3.5" />
          Under Review
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          className={`bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30 gap-1.5 px-2.5 py-1 text-xs font-semibold ${className ?? ""}`}
        >
          <XCircle className="w-3.5 h-3.5" />
          Rejected
        </Badge>
      );
    case "SUSPENDED":
      return (
        <Badge
          className={`bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30 gap-1.5 px-2.5 py-1 text-xs font-semibold ${className ?? ""}`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          Suspended
        </Badge>
      );
    default:
      return (
        <Badge
          className={`bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-500/30 gap-1.5 px-2.5 py-1 text-xs font-semibold ${className ?? ""}`}
        >
          {status}
        </Badge>
      );
  }
}
