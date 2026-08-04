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
      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-semibold text-slate-900">
            Current submission
          </CardTitle>
          <p className="text-sm leading-6 text-slate-500">
            Snapshot of the researcher-submitted severity before the company decision.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Submitted severity
            </span>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
              >
                {detail.severity} ({detail.cvssScore})
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-200 bg-white text-slate-600"
              >
                {detail.status}
              </Badge>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Reward estimate
            </span>
            <p className="mt-3 text-lg font-bold text-emerald-600">
              {detail.bountyRange}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-semibold text-slate-900">
            Review checklist
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
                className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-sm leading-6 text-slate-500">{item.description}</p>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
