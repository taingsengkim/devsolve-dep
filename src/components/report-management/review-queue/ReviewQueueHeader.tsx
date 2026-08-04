import Link from "next/link";
import { ArrowLeft, LayoutList, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReviewQueueHeader() {
  return (
    <header className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="h-8 rounded-full border-slate-200 bg-white px-3 text-slate-600"
          >
            <ShieldCheck />
            Moderation flow
          </Badge>
          <Badge
            variant="outline"
            className="h-8 rounded-full border-blue-200 bg-blue-50 px-3 text-blue-700"
          >
            3 active lanes
          </Badge>
        </div>

        <div className="space-y-1.5">
          <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-[#0F172A] sm:text-[36px]">
            Review Queue
          </h1>
          <p className="max-w-2xl text-[15px] leading-6 text-slate-500">
            Triage incoming reports, validate evidence, and move submissions toward final approval.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 self-start">
        <Link
          href="/dashboard/report-management"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 rounded-full border-slate-300 bg-white px-4 font-semibold text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-slate-700 hover:shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
          )}
        >
          <ArrowLeft data-icon="inline-start" />
          Back
        </Link>

        <div className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 shadow-[0_2px_10px_rgba(15,23,42,0.03)]">
          <LayoutList className="size-4 text-slate-500" />
          Queue overview
        </div>
      </div>
    </header>
  );
}
