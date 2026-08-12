import { ExternalLink, Link2 } from "lucide-react";

import { ReportDetailSectionCard } from "@/components/report-management/ReportDetailSectionCard";
import type { ReportManagementDetail } from "@/components/report-management/types";

type ReportDetailReferencesProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailReferences({
  detail,
}: ReportDetailReferencesProps) {
  return (
    <ReportDetailSectionCard
      title="Links & References"
      icon={<Link2 className="size-4.5" />}
      contentClassName="space-y-5"
    >
        <ReferenceBlock
          label="External Documentation"
          items={[detail.externalDocumentation]}
        />
        <ReferenceBlock
          label="Internal Reference"
          items={[detail.internalAssetLink]}
        />
        <ReferenceBlock
          label="Related Reports"
          items={[detail.relatedReport]}
        />
    </ReportDetailSectionCard>
  );
}

function ReferenceBlock({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>

      <div className="space-y-2">
        {items.map((item) => (
          <a
            key={item}
            href="#"
            className="flex items-start gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:underline"
          >
            <ExternalLink className="mt-0.5 size-4 shrink-0" />
            <span>{item}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
