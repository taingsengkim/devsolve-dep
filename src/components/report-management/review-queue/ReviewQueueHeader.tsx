import Link from "next/link";
import { ArrowLeft, ListChecks, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewQueueHeader() {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
            <ShieldCheck />
            Moderation flow
          </Badge>
          <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
            3 active lanes
          </Badge>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Review Queue
          </h1>
          <p className="mt-1.5 max-w-3xl text-base text-slate-600">
            Organize pending submissions, guide analysts through triage, and
            keep the review pipeline moving with a clearer queue view.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/dashboard/report-management"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "rounded-xl border-slate-300 bg-white font-semibold text-slate-700"
          )}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Link>
        <div
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-xs"
        >
          <ListChecks className="size-4 text-slate-500" />
          Queue overview
        </div>
      </div>
    </header>
  );
}
