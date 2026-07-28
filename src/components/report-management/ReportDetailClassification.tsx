import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ReportDetailClassificationProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailClassification({
  detail,
}: ReportDetailClassificationProps) {
  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Vulnerability Classification
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-slate-50/80">
                <tr className="border-b border-slate-200/80 text-left text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-5 py-4">Vulnerability Type</th>
                  <th className="px-5 py-4">CWE Identifier</th>
                  <th className="px-5 py-4">CVSS Score</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 last:border-b-0">
                  <td className="px-5 py-4 text-sm font-medium text-slate-700">
                    {detail.vulnerabilityType}
                  </td>
                  <td className="px-5 py-4">
                    <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                      {detail.cweIdentifier}
                    </a>
                  </td>
                  <td className="px-5 py-4">
                    <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700">
                      {detail.cvssScore} High
                    </Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-3xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
          <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
            Vector String
          </span>
          <code className="overflow-x-auto rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
            {detail.vectorString}
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
