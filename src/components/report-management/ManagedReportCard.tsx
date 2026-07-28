import Link from "next/link";
import { ArrowRight, CircleDot, Mail } from "lucide-react";

import type { ManagedReport } from "@/components/report-management/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function severityBadgeClass(severity: ManagedReport["severity"]) {
  if (severity === "Critical") return "bg-red-50 text-red-700 ring-1 ring-red-200/80";
  if (severity === "High") return "bg-orange-50 text-orange-700 ring-1 ring-orange-200/80";
  if (severity === "Medium") return "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80";
  return "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80";
}

function statusBadgeClass(status: ManagedReport["status"]) {
  return status === "Open"
    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80"
    : "bg-slate-100 text-slate-600 ring-1 ring-slate-200/80";
}

function typeBadgeClass(type: ManagedReport["type"]) {
  return type === "Bounty"
    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80"
    : "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80";
}

function severityAccentClass(severity: ManagedReport["severity"]) {
  if (severity === "Critical") {
    return {
      shell: "border-l-red-200",
      avatar: "bg-red-50 text-red-700 ring-red-100",
    };
  }
  if (severity === "High") {
    return {
      shell: "border-l-orange-200",
      avatar: "bg-orange-50 text-orange-700 ring-orange-100",
    };
  }
  if (severity === "Medium") {
    return {
      shell: "border-l-amber-200",
      avatar: "bg-amber-50 text-amber-700 ring-amber-100",
    };
  }

  return {
    shell: "border-l-slate-200",
    avatar: "bg-slate-100 text-slate-700 ring-slate-200",
  };
}

type ManagedReportCardProps = {
  report: ManagedReport;
};

export function ManagedReportCard({ report }: ManagedReportCardProps) {
  const severityAccent = severityAccentClass(report.severity);

  return (
    <Card
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)]",
        severityAccent.shell
      )}
    >
      <CardContent className="flex h-full flex-col p-6">
        <div className="flex flex-1 flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-4">
            <Avatar size="lg" className={cn("ring-1", severityAccent.avatar)}>
              <AvatarFallback className={cn("font-semibold", severityAccent.avatar)}>
                {report.authorInitials}
              </AvatarFallback>
            </Avatar>

              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant="outline"
                    className="border-slate-200 bg-slate-100 text-slate-600"
                  >
                  Report #{report.id}
                  </Badge>
                  <Badge variant="outline" className={typeBadgeClass(report.type)}>
                    {report.type}
                  </Badge>
                  <Badge variant="outline" className={statusBadgeClass(report.status)}>
                    <CircleDot className="size-3" />
                    {report.status}
                  </Badge>
                  <Badge variant="outline" className={severityBadgeClass(report.severity)}>
                    {report.severity}
                  </Badge>
                </div>

                <div>
                  <CardTitle className="line-clamp-2 text-lg font-bold text-slate-900">
                    {report.title}
                  </CardTitle>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                    <span>by {report.author}</span>
                    <span className="text-slate-300">&bull;</span>
                    <span className="inline-flex items-center gap-1">
                      <Mail className="size-3.5" />
                      {report.authorEmail}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <Link
              href={`/dashboard/report-management/${report.id}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "rounded-full border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
              )}
              >
                Review details
                <ArrowRight data-icon="inline-end" />
            </Link>
          </div>

          <p className="text-sm leading-relaxed text-slate-600 line-clamp-3">
            {report.summary}
          </p>

          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
              In-Scope Assets
            </span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {report.assets.map((asset) => (
                <span
                  key={asset}
                  className="inline-flex max-w-[180px] truncate rounded-md border border-slate-200/80 bg-slate-100/90 px-2.5 py-1 text-xs font-medium text-slate-700"
                >
                  {asset}
                </span>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
