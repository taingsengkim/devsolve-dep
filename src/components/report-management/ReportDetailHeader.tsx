import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportDetailHeaderProps = {
  detail: ReportManagementDetail;
};

function getStatusBadgeClass(status: ReportManagementDetail["status"]) {
  return status === "Open"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
    : "border-border bg-muted text-muted-foreground";
}

function getSeverityTone(severity: ReportManagementDetail["severity"]) {
  switch (severity) {
    case "Critical":
      return {
        card: "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400",
        text: "text-red-600 dark:text-red-400",
        badge: "border-red-200 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
      };
    case "High":
      return {
        card: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
        text: "text-amber-600 dark:text-amber-400",
        badge: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
      };
    case "Medium":
      return {
        card: "bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
        text: "text-sky-600 dark:text-sky-400",
        badge: "border-sky-200 bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
      };
    default:
      return {
        card: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
        text: "text-blue-600 dark:text-blue-400",
        badge: "border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
      };
  }
}

export function ReportDetailHeader({ detail }: ReportDetailHeaderProps) {
  const severityTone = getSeverityTone(detail.severity);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="transition-colors hover:text-foreground">
            Home
          </Link>
          <span className="text-muted-foreground/60">&gt;</span>
          <Link
            href="/dashboard/report-management"
            className="transition-colors hover:text-foreground"
          >
            Report Management
          </Link>
          <span className="text-muted-foreground/60">&gt;</span>
          <span className="font-semibold text-foreground">Report #{detail.reportId}</span>
        </nav>

        <Link
          href="/dashboard/report-management"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 items-center justify-center gap-2.5 rounded-xl border-border bg-card px-4 font-semibold text-foreground shadow-none hover:bg-muted cursor-pointer"
          )}
        >
          <ArrowLeft className="size-4" />
          Back to reports
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          icon={<UserRound className="size-5" />}
          label="Submitter"
          value={detail.submitter}
          tone="blue"
        />
        <MetricCard
          icon={<CircleAlert className="size-5" />}
          label="Severity"
          value={`${detail.severity} (${detail.cvssScore})`}
          tone={severityTone}
        />
        <MetricCard
          icon={<CalendarDays className="size-5" />}
          label="Date submitted"
          value={detail.submittedDate}
          tone="slate"
        />
      </div>

      <Card className="rounded-[24px] bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none py-0 shadow-xs">
        <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-muted">
                  {detail.programLogo ? (
                    <Image
                      src={detail.programLogo}
                      alt={`${detail.title} logo`}
                      width={48}
                      height={48}
                      className="size-11 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {detail.submitterInitials}
                    </span>
                  )}
                </div>

                <div className="min-w-0 space-y-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted-foreground">
                      <span className="font-semibold text-foreground">{detail.title}</span>
                      <span className="text-muted-foreground/60">by</span>
                      <span className="font-medium text-foreground">{detail.submitter}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="h-6 rounded-full bg-blue-600 px-2.5 text-[11px] font-medium text-white hover:bg-blue-600 dark:bg-blue-600 dark:text-white">
                        {detail.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-6 rounded-full px-2.5 text-[11px] font-medium",
                          getStatusBadgeClass(detail.status)
                        )}
                      >
                        <ShieldCheck className="size-3.5 mr-1" />
                        {detail.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="h-6 rounded-full border-border bg-muted px-2.5 text-[11px] font-medium text-muted-foreground"
                      >
                        Report ID: #{detail.reportId}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {detail.summary}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left lg:text-right">
                <p className="text-base font-semibold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {detail.bountyRange}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                In-scope assets
              </p>
              <div className="flex flex-wrap gap-2">
                {detail.assets.map((asset) => (
                  <span
                    key={asset}
                    className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-[12px] font-medium text-foreground"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone:
    | "blue"
    | "slate"
    | {
        card: string;
        text: string;
      };
}) {
  const toneClass =
    typeof tone === "string"
      ? {
          card:
            tone === "blue"
              ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
              : "bg-muted text-foreground",
          text: "text-foreground",
        }
      : tone;

  return (
    <Card className="rounded-[20px] bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none py-0 shadow-xs">
      <CardContent className="flex items-center gap-4 px-5 py-5">
        <div className={cn("flex size-11 items-center justify-center rounded-2xl", toneClass.card)}>
          {icon}
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {label}
          </p>
          <p className={cn("text-lg font-semibold tracking-tight", toneClass.text)}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
