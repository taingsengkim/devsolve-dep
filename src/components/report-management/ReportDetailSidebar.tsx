import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Mail,
  XCircle,
} from "lucide-react";

import type { ReportManagementDetail } from "@/components/report-management/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReportDetailSidebarProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailSidebar({
  detail,
}: ReportDetailSidebarProps) {
  const contactEmail = `${detail.submitterInitials.toLowerCase()}@devsolve.io`;

  return (
    <aside className="space-y-5 xl:sticky xl:top-6">
      {/* Moderation actions */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-950">
          Moderation actions
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Review the submission and choose the appropriate moderation action.
        </p>

        <div className="mt-5 space-y-3">
          <Link
            href={`/dashboard/report-management/${detail.id}/severity-review`}
            className={cn(
              buttonVariants({
                size: "default",
              }),
              "w-full rounded-xl bg-blue-600 font-medium text-white shadow-none hover:bg-blue-700",
            )}
          >
            <CheckCircle2 className="mr-2 size-4" />
            Accept and adjust severity
          </Link>

          <a
            href={`mailto:${contactEmail}?subject=Information request - #${detail.reportId}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "default",
              }),
              "w-full rounded-xl border-slate-200 bg-white font-medium text-slate-700 shadow-none",
            )}
          >
            <AlertCircle className="mr-2 size-4 text-amber-500" />
            Request information
          </a>

          <Link
            href={`/dashboard/report-management/${detail.id}/severity-review?action=reject`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "default",
              }),
              "w-full rounded-xl border-red-200 bg-white font-medium text-red-600 shadow-none hover:bg-red-50 hover:text-red-700",
            )}
          >
            <XCircle className="mr-2 size-4" />
            Reject submission
          </Link>
        </div>
      </section>

      {/* Researcher information */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Researcher information
        </h2>

        <dl className="mt-5 space-y-4">
          <InfoRow label="Name" value={detail.submitter} />

          <div className="flex items-start justify-between gap-4">
            <dt className="text-sm text-slate-500">Contact</dt>

            <dd>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
              >
                <Mail className="size-4" />
                {contactEmail}
              </a>
            </dd>
          </div>

          <InfoRow label="Report type" value={detail.type} />
          <InfoRow label="Current status" value={detail.status} />
        </dl>
      </section>
    </aside>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-slate-900">
        {value}
      </dd>
    </div>
  );
}