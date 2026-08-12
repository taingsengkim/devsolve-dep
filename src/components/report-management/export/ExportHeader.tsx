import Link from "next/link";
import { ArrowLeft, ChevronRight, FileSpreadsheet, Download } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExportHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Link
            href="/dashboard/report-management"
            className="flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span>Report Management</span>
          </Link>
          <span className="text-muted-foreground/60">/</span>
          <span className="font-semibold text-foreground">
            Export Center
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Export Center
            </h1>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-0.5 text-xs font-semibold"
            >
              <Download className="size-3" />
              4 Recent Downloads
            </Badge>
          </div>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Build structured report exports for moderation review, audits, and secure team handoffs.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto">
        <Link
          href="/dashboard/report-management"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 items-center justify-center gap-2 rounded-xl border-border bg-card px-4 font-semibold text-foreground shadow-none hover:bg-muted cursor-pointer"
          )}
        >
          <ArrowLeft className="size-4" />
          Back
        </Link>
      </div>
    </header>
  );
}
