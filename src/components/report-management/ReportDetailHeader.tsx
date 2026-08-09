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
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-slate-200 bg-slate-100 text-slate-600";
}

function getSeverityTone(severity: ReportManagementDetail["severity"]) {
  switch (severity) {
    case "Critical":
      return {
        card: "bg-red-50 text-red-500",
        text: "text-red-600",
        badge: "border-red-200 bg-red-50 text-red-700",
      };
    case "High":
      return {
        card: "bg-orange-50 text-orange-500",
        text: "text-orange-600",
        badge: "border-orange-200 bg-orange-50 text-orange-700",
      };
    case "Medium":
      return {
        card: "bg-amber-50 text-amber-500",
        text: "text-amber-600",
        badge: "border-amber-200 bg-amber-50 text-amber-700",
      };
    default:
      return {
        card: "bg-blue-50 text-blue-500",
        text: "text-blue-600",
        badge: "border-blue-200 bg-blue-50 text-blue-700",
      };
  }
}

export function ReportDetailHeader({ detail }: ReportDetailHeaderProps) {
  const severityTone = getSeverityTone(detail.severity);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <Link href="/dashboard" className="transition-colors hover:text-slate-800">
            Home
          </Link>
          <span>&gt;</span>
          <Link
            href="/dashboard/report-management"
            className="transition-colors hover:text-slate-800"
          >
            Report Management
          </Link>
          <span>&gt;</span>
          <span className="font-medium text-slate-700">Report #{detail.reportId}</span>
        </nav>

        <Link
          href="/dashboard/report-management"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-10 items-center justify-center gap-2.5 rounded-full border-slate-300 bg-white px-4 font-semibold text-slate-700 shadow-[0_2px_10px_rgba(15,23,42,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-slate-700 hover:shadow-[0_8px_18px_rgba(15,23,42,0.06)]"
          )}
        >
          <span className="flex size-4 items-center justify-center">
            <ArrowLeft className="size-4" />
          </span>
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

      <Card className="rounded-[24px] border border-slate-200 bg-white py-0 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
        <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
                  {detail.programLogo ? (
                    <Image
                      src={detail.programLogo}
                      alt={`${detail.title} logo`}
                      width={48}
                      height={48}
                      className="size-11 object-contain"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-slate-700">
                      {detail.submitterInitials}
                    </span>
                  )}
                </div>

                <div className="min-w-0 space-y-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-[13px] text-slate-500">
                      <span className="font-medium text-slate-900">{detail.title}</span>
                      <span className="text-slate-300">by</span>
                      <span>{detail.submitter}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="h-6 rounded-full bg-blue-600 px-2.5 text-[11px] font-medium text-white hover:bg-blue-600">
                        {detail.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "h-6 rounded-full px-2.5 text-[11px] font-medium",
                          getStatusBadgeClass(detail.status)
                        )}
                      >
                        <ShieldCheck className="size-3.5" />
                        {detail.status}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="h-6 rounded-full border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-500"
                      >
                        Report ID: #{detail.reportId}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm leading-7 text-slate-500">
                    {detail.summary}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-left lg:text-right">
                <p className="text-base font-semibold tracking-tight text-emerald-600">
                  {detail.bountyRange}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                In-scope assets
              </p>
              <div className="flex flex-wrap gap-2">
                {detail.assets.map((asset) => (
                  <span
                    key={asset}
                    className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-600"
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
              ? "bg-blue-50 text-blue-600"
              : "bg-slate-100 text-slate-600",
          text: "text-slate-900",
        }
      : tone;

  return (
    <Card className="rounded-[20px] border border-slate-200 bg-white py-0 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
      <CardContent className="flex items-center gap-4 px-5 py-5">
        <div className={cn("flex size-11 items-center justify-center rounded-2xl", toneClass.card)}>
          {icon}
        </div>

        <div className="space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
            {label}
          </p>
          <p className={cn("text-lg font-semibold tracking-tight", toneClass.text)}>{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
