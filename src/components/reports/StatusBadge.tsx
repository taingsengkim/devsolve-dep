import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle2,
  Award,
  AlertCircle,
  XCircle,
} from "lucide-react";
import type { ReportItem } from "@/lib/types/reports/types";

interface StatusBadgeProps {
  status: ReportItem["status"] | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "TRIAGING":
      return (
        <Badge
          variant="outline"
          className="bg-amber-500/10 text-amber-700 border-amber-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
        >
          <Clock className="w-3 h-3 text-amber-600" />
          TRIAGING
        </Badge>
      );
    case "RESOLVED":
      return (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-700 border-emerald-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
        >
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          RESOLVED
        </Badge>
      );
    case "ACCEPTED":
      return (
        <Badge
          variant="outline"
          className="bg-blue-500/10 text-blue-700 border-blue-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
        >
          <Award className="w-3 h-3 text-blue-600" />
          ACCEPTED
        </Badge>
      );
    case "SUBMITTED":
      return (
        <Badge
          variant="outline"
          className="bg-indigo-500/10 text-indigo-700 border-indigo-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
        >
          <AlertCircle className="w-3 h-3 text-indigo-600" />
          SUBMITTED
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge
          variant="outline"
          className="bg-rose-500/10 text-rose-700 border-rose-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
        >
          <XCircle className="w-3 h-3 text-rose-600" />
          REJECTED
        </Badge>
      );
    default:
      return (
        <Badge
          variant="outline"
          className="bg-slate-100 text-slate-700 border-slate-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit"
        >
          {status}
        </Badge>
      );
  }
}
