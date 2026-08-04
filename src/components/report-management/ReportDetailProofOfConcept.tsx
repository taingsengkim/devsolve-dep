import { CheckCircle2, Copy, FileCode2, FileText, XCircle } from "lucide-react";

import { ReportDetailSectionCard } from "@/components/report-management/ReportDetailSectionCard";
import type { ReportManagementDetail } from "@/components/report-management/types";

type ReportDetailProofOfConceptProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailProofOfConcept({
  detail,
}: ReportDetailProofOfConceptProps) {
  return (
    <ReportDetailSectionCard
      title="Proof of Concept"
      icon={<FileCode2 className="size-4.5" />}
      contentClassName="space-y-5"
    >
        <div className="space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            HTTP Request
          </p>
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#0F172A]">
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-3">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <span className="size-2 rounded-full bg-red-400" />
                  <span className="size-2 rounded-full bg-amber-400" />
                  <span className="size-2 rounded-full bg-emerald-400" />
                </span>
                <span>{detail.proofRequestLanguage}</span>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
              >
                <Copy className="size-3.5" />
                Copy
              </button>
            </div>

            <pre className="overflow-x-auto px-4 py-4 text-xs leading-7 whitespace-pre-wrap text-slate-200">
              <code>{detail.proofRequest}</code>
            </pre>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <ResultCard
            icon={<CheckCircle2 className="size-4.5" />}
            title="Expected Result"
            value={detail.expectedResult}
            tone="green"
          />
          <ResultCard
            icon={<XCircle className="size-4.5" />}
            title="Actual Result"
            value={detail.actualResult}
            tone="red"
          />
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Attachments ({detail.attachments.length})
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {detail.attachments.map((attachment) => (
              <div
                key={attachment.name}
                className="flex min-h-[104px] items-end overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
              >
                <div className="flex h-full w-full flex-col justify-between p-4">
                  <div className="flex size-12 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-slate-400">
                    <FileText className="size-5" />
                  </div>
                  <p className="truncate text-sm font-medium text-slate-600">
                    {attachment.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
    </ReportDetailSectionCard>
  );
}

function ResultCard({
  icon,
  title,
  value,
  tone,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  tone: "green" | "red";
}) {
  return (
    <div
      className={
        tone === "green"
          ? "rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-4"
          : "rounded-2xl border border-red-100 bg-red-50 px-4 py-4"
      }
    >
      <div className="flex items-center gap-2">
        <span
          className={
            tone === "green" ? "text-emerald-600" : "text-red-500"
          }
        >
          {icon}
        </span>
        <p
          className={
            tone === "green"
              ? "text-sm font-semibold text-emerald-700"
              : "text-sm font-semibold text-red-700"
          }
        >
          {title}
        </p>
      </div>
      <p
        className={
          tone === "green"
            ? "mt-3 text-sm font-medium text-emerald-700/90"
            : "mt-3 text-sm font-medium text-red-700/90"
        }
      >
        {value}
      </p>
    </div>
  );
}
