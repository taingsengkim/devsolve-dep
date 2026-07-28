import type { ReportManagementDetail } from "@/components/report-management/types";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportDetailAssessmentProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailAssessment({
  detail,
}: ReportDetailAssessmentProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Detailed Assessment
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <article className="flex flex-col gap-3 rounded-2xl bg-slate-50/70 p-5 ring-1 ring-slate-200/70">
          <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
          <p className="text-base leading-relaxed text-slate-600">
            {detail.assessmentSummary}
          </p>
        </article>

        <article className="flex flex-col gap-3 rounded-2xl bg-slate-50/70 p-5 ring-1 ring-slate-200/70">
          <h3 className="text-lg font-semibold text-slate-900">Steps to Reproduce</h3>
          <ol className="flex list-decimal flex-col gap-3 pl-5 text-base leading-relaxed text-slate-600">
            {detail.reproductionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>

        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-slate-900">
              Continue to severity adjustment
            </p>
            <p className="text-sm text-slate-500">
              Move to the company review step to confirm or modify the submitted severity.
            </p>
          </div>

          <Link
            href={`/dashboard/report-management/${detail.id}/severity-review`}
            className={cn(buttonVariants({ variant: "default" }), "rounded-xl")}
          >
            Next
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
