import Link from "next/link";
import { ArrowLeft, ChevronRight, FileSpreadsheet, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExportHeader() {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between pb-6 border-b border-slate-200/80">
      <div className="space-y-3">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-medium text-slate-500"
        >
          <span className="hover:text-slate-800 transition-colors cursor-pointer">Report Management</span>
          <ChevronRight className="size-3.5 text-slate-400" />
          <span className="font-semibold text-slate-900">Export Center</span>
        </nav>

        {/* Title & Description */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Export Center
            </h1>
            <Badge
              variant="secondary"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-blue-50/80 text-blue-700 border border-blue-200/60 px-3 py-0.5 text-xs font-medium"
            >
              <Download className="size-3" /> 4 recent downloads
            </Badge>
          </div>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-500">
            Build structured report exports for moderation review, audits, and secure team handoffs.
          </p>
        </div>
      </div>

      {/* Back Button */}
      <Link
        href="/dashboard/report-management"
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "inline-flex items-center gap-2 h-9 rounded-lg border-slate-200 bg-white/80 backdrop-blur-sm px-3.5 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
        )}
      >
        <ArrowLeft className="size-3.5" />
        Back
      </Link>
    </header>
  );
}