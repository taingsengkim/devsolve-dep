import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ReportDetailTargetScopeProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailTargetScope({
  detail,
}: ReportDetailTargetScopeProps) {
  return (
    <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Target &amp; Scope
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Affected endpoint, method, and user-controlled parameter used during validation.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-slate-900 text-white hover:bg-slate-800">In Scope</Badge>
            <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
              CV
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Affected URL
            </span>
            <code className="mt-3 block overflow-x-auto rounded-xl bg-white px-3 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
              {detail.affectedUrl}
            </code>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              HTTP Method
            </span>
            <p className="mt-3 text-lg font-bold text-slate-900">{detail.httpMethod}</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Parameter
            </span>
            <code className="mt-3 inline-flex rounded-xl bg-white px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
              {detail.parameter}
            </code>
          </div>
        </div>

        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/80 p-4">
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
