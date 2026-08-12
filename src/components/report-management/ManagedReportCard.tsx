"use client";

import Image from "next/image";
import Link from "next/link";

import type { ManagedReport } from "@/components/report-management/types";
import { reportListGridClass } from "@/components/report-management/report-list-layout";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

function getTypeBadgeClass(type: ManagedReport["type"]) {
  return type === "Bounty"
    ? "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20"
    : "border-violet-200 bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20";
}

function getStatusBadgeClass(status: ManagedReport["status"]) {
  return status === "Open"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
    : "border-border bg-muted text-muted-foreground";
}

function getSeverityBadgeClass(severity: ManagedReport["severity"]) {
  if (severity === "Critical") return "border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
  if (severity === "High") return "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20";
  if (severity === "Medium") return "border-sky-200 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20";
  return "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
}

const badgeBaseClass =
  "h-7 min-w-[84px] justify-center rounded-full px-3 text-[12px] font-medium";

type ManagedReportCardProps = {
  report: ManagedReport;
  isLast?: boolean;
};

function getDisplayReportId(report: ManagedReport) {
  if (report.reportId?.trim()) return report.reportId;

  const rawId = String(report.id);
  if (/^\d+$/.test(rawId)) {
    return `RPT-2026-${rawId.padStart(5, "0")}`;
  }

  return `RPT-${rawId.replace(/-/g, "").slice(0, 8).toUpperCase()}`;
}

export function ManagedReportCard({
  report,
  isLast = false,
}: ManagedReportCardProps) {
  const reportId = getDisplayReportId(report);
  const visibleAssets = report.assets.slice(0, 2);
  const hiddenAssetsCount = Math.max(0, report.assets.length - visibleAssets.length);

  return (
    <Link
      href={`/dashboard/report-management/${report.id}`}
      aria-label={`Open report ${report.title}`}
      className={cn(
        "group block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500/30",
        !isLast && "border-b border-border"
      )}
      onKeyDown={(event) => {
        if (event.key === " ") {
          event.preventDefault();
          event.currentTarget.click();
        }
      }}
    >
      <div className="px-6 py-5 transition-colors duration-200 group-hover:bg-muted/50">
        <div className={cn(reportListGridClass, "hidden lg:grid")}>
          <div className="min-w-0">
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted border border-border">
                {report.programLogo ? (
                  <Image
                    src={report.programLogo}
                    alt={`${report.title} logo`}
                    width={48}
                    height={48}
                    className="size-11 object-contain"
                  />
                ) : (
                  <span className="text-sm font-semibold text-foreground">
                    {report.authorInitials}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-2">
                <div className="space-y-1.5">
                  <h3 className="truncate text-base font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {report.title}
                  </h3>
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span>{reportId}</span>
                    <span className="text-muted-foreground/60">&bull;</span>
                    <span className="truncate">{report.author}</span>
                    <span className="text-muted-foreground/60">&bull;</span>
                    <span>{report.submittedAt}</span>
                  </p>
                </div>

                <p className="line-clamp-2 text-base leading-relaxed text-muted-foreground">
                  {report.summary}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {visibleAssets.map((asset) => (
              <span
                key={asset}
                className="inline-flex max-w-[165px] truncate rounded-full border border-border bg-muted px-3 py-1 text-[12px] font-medium text-foreground"
                title={asset}
              >
                {asset}
              </span>
            ))}
            {hiddenAssetsCount > 0 ? (
              <span className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-[12px] font-medium text-muted-foreground">
                +{hiddenAssetsCount} more
              </span>
            ) : null}
          </div>

          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className={cn(badgeBaseClass, getTypeBadgeClass(report.type))}
            >
              {report.type}
            </Badge>
          </div>

          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className={cn(badgeBaseClass, getStatusBadgeClass(report.status))}
            >
              {report.status}
            </Badge>
          </div>

          <div className="flex items-center justify-center">
            <Badge
              variant="outline"
              className={cn(badgeBaseClass, getSeverityBadgeClass(report.severity))}
            >
              {report.severity}
            </Badge>
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted border border-border">
              {report.programLogo ? (
                <Image
                  src={report.programLogo}
                  alt={`${report.title} logo`}
                  width={44}
                  height={44}
                  className="size-10 object-contain"
                />
              ) : (
                <span className="text-sm font-semibold text-foreground">
                  {report.authorInitials}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div className="space-y-1.5">
                <h3 className="truncate text-[16px] font-semibold leading-6 text-foreground">
                  {report.title}
                </h3>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-muted-foreground">
                  <span>{reportId}</span>
                  <span className="text-muted-foreground/60">&bull;</span>
                  <span className="truncate">{report.author}</span>
                  <span className="text-muted-foreground/60">&bull;</span>
                  <span>{report.submittedAt}</span>
                </p>
              </div>

              <p className="line-clamp-1 text-[13px] leading-6 text-muted-foreground">
                {report.summary}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  variant="outline"
                  className={cn(badgeBaseClass, getTypeBadgeClass(report.type))}
                >
                  {report.type}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(badgeBaseClass, getStatusBadgeClass(report.status))}
                >
                  {report.status}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(badgeBaseClass, getSeverityBadgeClass(report.severity))}
                >
                  {report.severity}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {visibleAssets.map((asset) => (
                  <span
                    key={asset}
                    className="inline-flex max-w-[165px] truncate rounded-full border border-border bg-muted px-3 py-1 text-[12px] font-medium text-foreground"
                    title={asset}
                  >
                    {asset}
                  </span>
                ))}
                {hiddenAssetsCount > 0 ? (
                  <span className="inline-flex rounded-full border border-border bg-muted px-3 py-1 text-[12px] font-medium text-muted-foreground">
                    +{hiddenAssetsCount} more
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
