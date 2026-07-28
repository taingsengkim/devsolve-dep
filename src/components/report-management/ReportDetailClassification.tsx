import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ReportDetailClassificationProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailClassification({
  detail,
}: ReportDetailClassificationProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <CardHeader className="gap-3">
        <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
          Vulnerability Classification
        </CardTitle>
        <CardDescription className="text-base text-slate-500">
          Reference taxonomy, weakness identifier, and severity vector used during triage.
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Vulnerability Type
            </span>
            <p className="mt-3 text-base font-semibold text-slate-900">
              {detail.vulnerabilityType}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                CWE Identifier
              </span>
              <a
                href="#"
                className="mt-3 inline-flex text-base font-semibold text-blue-600 hover:text-blue-700"
              >
                {detail.cweIdentifier}
              </a>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                CVSS Score
              </span>
              <div className="mt-3">
                <Badge
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-700"
                >
                  {detail.cvssScore} High
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-2xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
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
