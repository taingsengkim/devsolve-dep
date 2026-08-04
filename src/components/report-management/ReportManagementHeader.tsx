import Link from "next/link";
import { Download, ListChecks } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReportManagementHeader() {
  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h1 className="text-[32px] font-semibold tracking-[-0.04em] text-[#0F172A] sm:text-[38px]">
          Report Management
        </h1>
      </div>

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:justify-end">
        <Link
          href="/dashboard/report-management/review-queue"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-none hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <ListChecks data-icon="inline-start" />
          Review queue
        </Link>

        <Link
          href="/dashboard/report-management/export"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-700 shadow-none hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <Download data-icon="inline-start" />
          Export
        </Link>
      </div>
    </header>
  );
}
