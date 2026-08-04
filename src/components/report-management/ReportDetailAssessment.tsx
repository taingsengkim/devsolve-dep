import Link from "next/link";
import { ClipboardList, Lightbulb, Sparkles } from "lucide-react";

import { ReportDetailSectionCard } from "@/components/report-management/ReportDetailSectionCard";
import type { ReportManagementDetail } from "@/components/report-management/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReportDetailAssessmentProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailAssessment({
  detail,
}: ReportDetailAssessmentProps) {
  return (
    <ReportDetailSectionCard
      title="Detailed Assessment"
      icon={<ClipboardList className="size-4.5" />}
      contentClassName="space-y-6"
    >
        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
          <p className="text-sm leading-7 text-slate-600">
            {detail.assessmentSummary}
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">
            Steps to Reproduce
          </h3>
          <ol className="space-y-3 pl-6 text-sm leading-7 text-slate-600">
            {detail.reproductionSteps.map((step) => (
              <li key={step} className="pl-1 list-decimal marker:font-semibold marker:text-slate-500">
                {step}
              </li>
            ))}
          </ol>
        </section>

        <div className="grid gap-4 lg:grid-cols-2">
          <InsightCard
            title="Impact"
            tone="red"
            content={detail.impact}
          />
          <InsightCard
            title="Root Cause"
            tone="blue"
            content={detail.rootCause}
          />
        </div>

        <section className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">Remediation</h3>
          <p className="text-sm leading-7 text-slate-600">
            {detail.remediation}
          </p>
        </section>

        <div className="flex gap-3 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-blue-600" />
          <p className="text-sm leading-6 text-blue-700">{detail.analystTip}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
          <div className="space-y-1">
            <p className="text-base font-semibold text-slate-900">
              Continue to severity adjustment
            </p>
            <p className="text-sm text-slate-500">
              Move to company review when the assessment is confirmed.
            </p>
          </div>

          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex justify-end">
              <Link
                href={`/dashboard/report-management/${detail.id}/severity-review`}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "h-11 rounded-full bg-slate-950 px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(15,23,42,0.16)] transition-all hover:bg-slate-900 hover:shadow-[0_12px_28px_rgba(15,23,42,0.2)]"
                )}
              >
                <Sparkles data-icon="inline-start" className="size-4" />
                Next
              </Link>
            </div>
          </div>
        </div>
      </ReportDetailSectionCard>
  );
}

function InsightCard({
  title,
  content,
  tone,
}: {
  title: string;
  content: string;
  tone: "red" | "blue";
}) {
  return (
    <div
      className={cn(
        "rounded-2xl px-4 py-4",
        tone === "red" && "border border-red-100 bg-red-50",
        tone === "blue" && "border border-blue-100 bg-blue-50"
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold",
          tone === "red" && "text-red-700",
          tone === "blue" && "text-blue-700"
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-6",
          tone === "red" && "text-red-600/90",
          tone === "blue" && "text-blue-700/90"
        )}
      >
        {content}
      </p>
    </div>
  );
}
