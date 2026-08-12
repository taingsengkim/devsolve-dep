import Link from "next/link";
import { ArrowLeft, LayoutList, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewQueueHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
      <div className="space-y-2">
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
            Review Queue
          </span>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Review Queue
          </h1>
          <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
            Triage incoming reports, validate evidence, and move submissions toward final approval.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
        <Badge
          variant="outline"
          className="h-9 rounded-xl border-border bg-card px-3 text-muted-foreground font-semibold"
        >
          <ShieldCheck className="size-4 mr-1 text-emerald-500" />
          Moderation Flow
        </Badge>
        <Badge
          variant="outline"
          className="h-9 rounded-xl border-blue-500/20 bg-blue-500/10 px-3 text-blue-600 dark:text-blue-400 font-semibold"
        >
          3 Active Lanes
        </Badge>
      </div>
    </header>
  );
}
