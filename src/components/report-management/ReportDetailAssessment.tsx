import type { ReportManagementDetail } from "@/components/report-management/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReportDetailAssessmentProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailAssessment({
  detail,
}: ReportDetailAssessmentProps) {
  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Detailed Assessment
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        <article className="flex flex-col gap-3 rounded-3xl bg-slate-50/70 p-5 ring-1 ring-slate-200/70">
          <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
          <p className="text-base leading-relaxed text-slate-600">
            {detail.assessmentSummary}
          </p>
        </article>

        <article className="flex flex-col gap-3 rounded-3xl bg-slate-50/70 p-5 ring-1 ring-slate-200/70">
          <h3 className="text-lg font-semibold text-slate-900">Steps to Reproduce</h3>
          <ol className="flex list-decimal flex-col gap-3 pl-5 text-base leading-relaxed text-slate-600">
            {detail.reproductionSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </article>
      </CardContent>
    </Card>
  );
}
