import { AlertTriangle, Crosshair, Link2 } from "lucide-react";

import { ReportDetailSectionCard } from "@/components/report-management/ReportDetailSectionCard";
import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";

type ReportDetailTargetScopeProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailTargetScope({
  detail,
}: ReportDetailTargetScopeProps) {
  return (
    <ReportDetailSectionCard
      title="Target & Scope"
      icon={<Crosshair className="size-4.5" />}
      contentClassName="flex flex-col gap-5"
      headerRight={
        <>
          <Badge
            variant="outline"
            className="rounded-full border-emerald-200 bg-emerald-50 px-3 text-emerald-700"
          >
            In Scope
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-slate-200 bg-slate-100 px-3 text-slate-700"
          >
            CV
          </Badge>
        </>
      }
    >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_0.7fr_0.9fr]">
          <FieldBlock label="Affected URL">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700">
              <Link2 className="size-4 text-slate-400" />
              <code className="truncate font-mono">{detail.affectedUrl}</code>
            </div>
          </FieldBlock>

          <FieldBlock label="HTTP Method">
            <p className="text-lg font-semibold tracking-tight text-slate-900">
              {detail.httpMethod}
            </p>
          </FieldBlock>

          <FieldBlock label="Parameter">
            <code className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-sm text-slate-700">
              {detail.parameter}
            </code>
          </FieldBlock>
        </div>

        <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-900">
              Environment: {detail.environment}
            </p>
            <p className="text-sm leading-6 text-amber-800">
              {detail.environmentNote}
            </p>
          </div>
        </div>
    </ReportDetailSectionCard>
  );
}

function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}
