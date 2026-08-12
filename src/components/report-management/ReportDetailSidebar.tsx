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
  const contactEmail =
    detail.submitterEmail?.trim() ||
    `${detail.submitterInitials.toLowerCase()}@devsolve.io`;

  return (
    <aside className="space-y-5 xl:sticky xl:top-6">
      {/* Moderation actions */}
      <section className="rounded-2xl bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 p-5 shadow-xs">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Moderation Actions
        </h2>

        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Review the submission and choose the appropriate moderation action.
        </p>

        <div className="mt-5 space-y-3">
          <Link
            href={`/dashboard/report-management/${detail.id}/severity-review`}
            className={cn(
              buttonVariants({
                size: "default",
              }),
              "w-full rounded-xl bg-blue-600 font-semibold text-white hover:bg-blue-700 dark:bg-blue-600 dark:text-white cursor-pointer",
            )}
          >
            <CheckCircle2 className="mr-2 size-4" />
            Accept & Adjust Severity
          </Link>

          <a
            href={`mailto:${contactEmail}?subject=Information request - #${detail.reportId}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "default",
              }),
              "w-full rounded-xl border-border bg-card font-semibold text-foreground hover:bg-muted cursor-pointer",
            )}
          >
            <AlertCircle className="mr-2 size-4 text-amber-500" />
            Request Information
          </a>

          <Link
            href={`/dashboard/report-management/${detail.id}/severity-review?action=reject`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "default",
              }),
              "w-full rounded-xl border-red-500/20 bg-red-500/10 font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/20 cursor-pointer",
            )}
          >
            <XCircle className="mr-2 size-4" />
            Reject Submission
          </Link>
        </div>
      </section>

      {/* Researcher information */}
      <section className="rounded-2xl bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 p-5 shadow-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Researcher Information
        </h2>

        <dl className="mt-5 space-y-4">
          <InfoRow label="Name" value={detail.submitter} />

          <div className="flex items-start justify-between gap-4">
            <dt className="text-sm text-muted-foreground">Contact</dt>

            <dd>
              <a
                href={`mailto:${contactEmail}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
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
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}
