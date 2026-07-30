import Link from "next/link";
import { ArrowLeft, FileSpreadsheet } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExportHeader() {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
            <FileSpreadsheet />
            Report exports
          </Badge>
          <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
            4 recent downloads
          </Badge>
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Export Center
          </h1>
          <p className="mt-1.5 max-w-3xl text-base text-slate-600">
            Prepare structured exports for finance, moderation audits, and
            leadership review without leaving the report management workspace.
          </p>
        </div>
      </div>

      <Link
        href="/dashboard/report-management"
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "w-fit rounded-xl border-slate-300 bg-white font-semibold text-slate-700"
        )}
      >
        <ArrowLeft data-icon="inline-start" />
        Back
      </Link>
    </header>
  );
}
