import React from "react";
import { Badge } from "@/components/ui/badge";
import type { ReportItem } from "@/lib/types/reports/types";

interface SeverityBadgeProps {
  severity: ReportItem["severity"] | string;
}

export default function SeverityBadge({ severity }: SeverityBadgeProps) {
  switch (severity) {
    case "CRITICAL":
      return (
        <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          CRITICAL
        </Badge>
      );
    case "HIGH":
      return (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          HIGH
        </Badge>
      );
    case "MEDIUM":
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          MEDIUM
        </Badge>
      );
    case "LOW":
      return (
        <Badge className="bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-white" />
          LOW
        </Badge>
      );
    default:
      return (
        <Badge className="bg-slate-500 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
          {severity}
        </Badge>
      );
  }
}
