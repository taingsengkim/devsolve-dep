import { FileText, ShieldCheck, TimerReset } from "lucide-react";

import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReportSeverityReviewSidebarProps = {
  detail: ReportManagementDetail;
};

export function ReportSeverityReviewSidebar({
  detail,
}: ReportSeverityReviewSidebarProps) {
  return (
    <div className="flex flex-col gap-5">
      <Card className="rounded-2xl bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none shadow-xs">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-bold text-foreground">
            Current Submission
          </CardTitle>
          <p className="text-sm leading-6 text-muted-foreground">
            Snapshot of the researcher-submitted severity before the company decision.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="rounded-2xl border border-border bg-muted/50 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Submitted severity
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400"
              >
                {detail.severity} ({detail.cvssScore})
              </Badge>
              <Badge
                variant="outline"
                className="border-border bg-card text-muted-foreground"
              >
                {detail.status}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-muted/50 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Reward estimate
            </span>
            <p className="mt-3 text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {detail.bountyRange}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none shadow-xs">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-bold text-foreground">
            Review Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {[
            {
              icon: ShieldCheck,
              title: "Confirm real impact",
              description: "Validate whether the exploit changes actual business risk or data exposure.",
            },
            {
              icon: TimerReset,
              title: "Compare with policy",
              description: "Align the final severity with your bounty rubric and triage conventions.",
            },
            {
              icon: FileText,
              title: "Leave clear feedback",
              description: "Explain why the final decision changed so the researcher understands it.",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex gap-3 rounded-2xl border border-border bg-muted/50 p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-card text-foreground ring-1 ring-border">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
