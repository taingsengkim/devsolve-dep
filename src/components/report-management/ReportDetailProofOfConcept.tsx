import {
  CheckCircle2,
  Copy,
  FileCode2,
  FileImage,
  FileText,
  XCircle,
} from "lucide-react";

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
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Attachments
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {detail.attachments.length} supporting files included with this report.
              </p>
            </div>

            <span className="inline-flex h-7 items-center rounded-full border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-500">
              {detail.attachments.length} files
            </span>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {detail.attachments.map((attachment) => (
              <div
                key={attachment.name}
                className="group flex items-center justify-between gap-4 border-b border-slate-100 px-4 py-4 transition-colors last:border-b-0 hover:bg-slate-50/80"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={
                      attachment.kind === "image"
                        ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"
                        : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
                    }
                  >
                    {attachment.kind === "image" ? (
                      <FileImage className="size-5" />
                    ) : (
                      <FileText className="size-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900 group-hover:text-slate-950">
                      {attachment.name}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {attachment.kind === "image" ? "Image evidence" : "Supporting file"}
                    </p>
                  </div>
                </div>

                <span className="inline-flex shrink-0 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-500">
                  {attachment.kind === "image" ? "Preview" : "File"}
                </span>
              </div>
            ))}
          </div>

          {detail.attachments.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-6 text-center text-sm text-slate-500">
              No attachments were included with this submission.
            </div>
          ) : null}
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
