import { Badge } from "@/components/ui/badge";
import { ReportDetailSectionCard } from "@/components/report-management/ReportDetailSectionCard";
import type { ReportManagementDetail } from "@/components/report-management/types";

type ReportDetailClassificationProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailClassification({
  detail,
}: ReportDetailClassificationProps) {
  const severityBadgeClass =
    detail.severity === "Critical"
      ? "border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
      : detail.severity === "High"
        ? "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20"
        : detail.severity === "Medium"
          ? "border-sky-200 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20"
          : "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";

  return (
    <ReportDetailSectionCard
      title="Vulnerability Classification"
      icon={
        <span className="grid grid-cols-2 gap-0.5">
          <span className="size-1.5 rounded-[2px] bg-current" />
          <span className="size-1.5 rounded-[2px] bg-current" />
          <span className="size-1.5 rounded-[2px] bg-current" />
          <span className="size-1.5 rounded-[2px] bg-current" />
        </span>
      }
      contentClassName="space-y-5"
    >
        <div className="grid gap-5 md:grid-cols-3">
          <InfoBlock label="Vulnerability Type">
            <p className="text-base font-semibold tracking-tight text-foreground">
              {detail.vulnerabilityType}
            </p>
          </InfoBlock>

          <InfoBlock label="CWE Identifier">
            <a
              href="#"
              className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {detail.cweIdentifier}
            </a>
          </InfoBlock>

          <InfoBlock label="CVSS Score">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-red-600 dark:text-red-400">
                {detail.cvssScore}
              </span>
              <Badge
                variant="outline"
                className={`rounded-full px-2.5 ${severityBadgeClass}`}
              >
                {detail.severity}
              </Badge>
            </div>
          </InfoBlock>
        </div>

        <InfoBlock label="Vector String">
          <code className="block overflow-x-auto rounded-xl border border-border bg-card px-3 py-3 font-mono text-xs text-foreground">
            {detail.vectorString}
          </code>
        </InfoBlock>
    </ReportDetailSectionCard>
  );
}

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  );
}
