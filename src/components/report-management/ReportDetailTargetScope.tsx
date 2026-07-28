import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReportDetailTargetScopeProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailTargetScope({
  detail,
}: ReportDetailTargetScopeProps) {
  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Target &amp; Scope
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-slate-900 text-white hover:bg-slate-800">In Scope</Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
              CV
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/80 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-5 py-4">Affected URL</th>
                  <th className="px-5 py-4">HTTP Method</th>
                  <th className="px-5 py-4">Parameter</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-4">
                    <code className="rounded-2xl bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                      {detail.affectedUrl}
                    </code>
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                    {detail.httpMethod}
                  </td>
                  <td className="px-5 py-4">
                    <code className="rounded-2xl bg-slate-100 px-3 py-1.5 text-sm text-slate-700">
                      {detail.parameter}
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200/80 bg-amber-50/80 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-base font-semibold text-amber-900">
              Environment: {detail.environment}
            </p>
            <p className="text-sm leading-relaxed text-amber-800">
              {detail.environmentNote}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
