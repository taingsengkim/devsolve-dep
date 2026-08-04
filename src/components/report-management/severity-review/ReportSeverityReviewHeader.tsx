import Link from "next/link";
import { ArrowLeft, ShieldAlert, UserCircle2 } from "lucide-react";

import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportSeverityReviewHeaderProps = {
  detail: ReportManagementDetail;
};

export function ReportSeverityReviewHeader({
  detail,
}: ReportSeverityReviewHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/dashboard" className="transition-colors hover:text-slate-700">
            Home
          </Link>
          <span>&gt;</span>
          <Link
            href="/dashboard/report-management"
            className="transition-colors hover:text-slate-700"
          >
            Report Management
          </Link>
          <span>&gt;</span>
          <Link
            href={`/dashboard/report-management/${detail.id}`}
            className="transition-colors hover:text-slate-700"
          >
            Report #{detail.reportId}
          </Link>
          <span>&gt;</span>
          <span className="text-slate-700">Severity Adjustment</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-blue-700"
              >
                Company decision
              </Badge>
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
              >
                Submitted {detail.severity} ({detail.cvssScore})
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Modify Submitted Severity
              </h1>
              <p className="max-w-3xl text-base text-slate-500">
                Company review can adjust the researcher-submitted severity before
                the final approval or rejection is shared back to the hacker.
              </p>
            </div>
          </div>

          <Link
            href={`/dashboard/report-management/${detail.id}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-xl border-slate-300 bg-white text-slate-700"
            )}
          >
            <ArrowLeft data-icon="inline-start" />
            Back to report detail
          </Link>
        </div>
      </div>

      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                <UserCircle2 className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Submitter
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {detail.submitter}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                <ShieldAlert className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  Current severity
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {detail.severity} ({detail.cvssScore})
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Reward estimate
            </span>
            <p className="mt-3 text-base font-semibold text-emerald-600">
              {detail.bountyRange}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
