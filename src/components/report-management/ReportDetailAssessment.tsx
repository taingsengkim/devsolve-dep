import Link from "next/link";
import { ClipboardList, Lightbulb } from "lucide-react";

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
          <h3 className="text-lg font-bold tracking-tight text-foreground">Summary</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {detail.assessmentSummary}
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-lg font-bold tracking-tight text-foreground">
            Steps to Reproduce
          </h3>
          <ol className="space-y-3 pl-6 text-sm leading-relaxed text-muted-foreground">
            {detail.reproductionSteps.map((step) => (
              <li key={step} className="pl-1 list-decimal marker:font-semibold marker:text-muted-foreground">
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
          <h3 className="text-lg font-bold tracking-tight text-foreground">Remediation</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {detail.remediation}
          </p>
        </section>

        <div className="flex gap-3 rounded-2xl border border-blue-500/20 bg-blue-500/10 px-4 py-4">
          <Lightbulb className="mt-0.5 size-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <p className="text-sm leading-6 text-blue-600 dark:text-blue-400">{detail.analystTip}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              Continue to severity adjustment
            </p>
            <p className="text-sm text-muted-foreground">
              Move to company review when the assessment is confirmed.
            </p>
          </div>

          <div className="mt-4 border-t border-border pt-4">
            <div className="flex justify-end">
              <Link
                href={`/dashboard/report-management/${detail.id}/severity-review`}
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "h-11 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 dark:bg-blue-600 dark:text-white cursor-pointer"
                )}
              >
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
        "rounded-2xl px-4 py-4 border",
        tone === "red" && "border-red-500/20 bg-red-500/10",
        tone === "blue" && "border-blue-500/20 bg-blue-500/10"
      )}
    >
      <p
        className={cn(
          "text-sm font-semibold",
          tone === "red" && "text-red-600 dark:text-red-400",
          tone === "blue" && "text-blue-600 dark:text-blue-400"
        )}
      >
        {title}
      </p>
      <p
        className={cn(
          "mt-2 text-sm leading-6",
          tone === "red" && "text-red-600/90 dark:text-red-300",
          tone === "blue" && "text-blue-600/90 dark:text-blue-300"
        )}
      >
        {content}
      </p>
    </div>
  );
}
