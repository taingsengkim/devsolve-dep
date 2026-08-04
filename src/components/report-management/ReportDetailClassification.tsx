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
      ? "border-red-200 bg-red-50 text-red-700"
      : detail.severity === "High"
        ? "border-orange-200 bg-orange-50 text-orange-700"
        : detail.severity === "Medium"
          ? "border-amber-200 bg-amber-50 text-amber-700"
          : "border-blue-200 bg-blue-50 text-blue-700";

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
            <p className="text-base font-semibold tracking-tight text-slate-900">
              {detail.vulnerabilityType}
            </p>
          </InfoBlock>

          <InfoBlock label="CWE Identifier">
            <a
              href="#"
              className="text-base font-semibold text-blue-600 hover:text-blue-700"
            >
              {detail.cweIdentifier}
            </a>
          </InfoBlock>

          <InfoBlock label="CVSS Score">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-red-600">
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
          <code className="block overflow-x-auto rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 font-mono text-xs text-slate-700">
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
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      {children}
    </div>
  );
}
