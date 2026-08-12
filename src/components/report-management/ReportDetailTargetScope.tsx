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
            className="rounded-full border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
          >
            In Scope
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-border bg-muted text-muted-foreground"
          >
            CV
          </Badge>
        </>
      }
    >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_0.7fr_0.9fr]">
          <FieldBlock label="Affected URL">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-3 text-sm text-foreground">
              <Link2 className="size-4 text-muted-foreground" />
              <code className="truncate font-mono">{detail.affectedUrl}</code>
            </div>
          </FieldBlock>

          <FieldBlock label="HTTP Method">
            <p className="text-lg font-semibold tracking-tight text-foreground">
              {detail.httpMethod}
            </p>
          </FieldBlock>

          <FieldBlock label="Parameter">
            <code className="inline-flex rounded-lg bg-muted px-2.5 py-1 font-mono text-sm text-foreground">
              {detail.parameter}
            </code>
          </FieldBlock>
        </div>

        <div className="flex gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-4">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Environment: {detail.environment}
            </p>
            <p className="text-sm leading-relaxed text-amber-600 dark:text-amber-400">
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
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
