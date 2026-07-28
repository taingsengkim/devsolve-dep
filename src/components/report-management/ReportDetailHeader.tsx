import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldAlert, UserCircle2 } from "lucide-react";

import type { ReportManagementDetail } from "@/components/report-management/types";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportDetailHeaderProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailHeader({ detail }: ReportDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/dashboard" className="transition-colors hover:text-slate-700">
            Home
          </Link>
          <span>&gt;</span>
          <Link
            href="/dashboard/report-management"
            className="transition-colors hover:text-slate-700"
          >
            Report Management
          </Link>
          <span>&gt;</span>
          <span className="text-slate-700">Report #{detail.reportId}</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Report #{detail.reportId}
            </h1>
            <p className="text-base text-slate-500">
              Full vulnerability submission detail and assessment context.
            </p>
          </div>

          <Link
            href="/dashboard/report-management"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-full bg-white"
            )}
          >
            <ArrowLeft data-icon="inline-start" />
            Back to reports
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          { label: "Submitter", value: detail.submitter },
          { label: "Severity", value: `${detail.severity} (${detail.cvssScore})` },
          { label: "Date Submitted", value: detail.submittedDate },
        ].map((item) => (
          <Card key={item.label} className="border border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="gap-2">
              <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                {item.label}
              </CardDescription>
              <CardTitle className="text-xl font-bold text-slate-900">
                {item.value}
              </CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card className="border border-slate-200/80 bg-white shadow-sm">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                  {detail.type}
                </Badge>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                  {detail.status}
                </Badge>
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                  Report ID #{detail.reportId}
                </Badge>
              </div>

              <div className="flex flex-col gap-2">
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
                  {detail.title}
                </CardTitle>
                <CardDescription className="text-base text-slate-500">
                  by {detail.submitter}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 xl:min-w-[280px]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Reward range</p>
                  <p className="text-sm text-slate-500">Estimated bounty and reputation band</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <ShieldAlert className="size-5" />
                </div>
              </div>
              <p className="text-lg font-bold tracking-tight text-slate-900">
                {detail.bountyRange}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <p className="text-base leading-relaxed text-slate-600">
            {detail.summary}
          </p>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex items-center gap-3 rounded-3xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                <UserCircle2 className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-slate-900">Submitter</p>
                <p className="text-sm text-slate-500">{detail.submitter}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-3xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                <ShieldAlert className="size-5" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-slate-900">Severity assessment</p>
                <p className="text-sm text-slate-500">
                  {detail.severity} risk, CVSS {detail.cvssScore}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl bg-slate-50/80 p-4 ring-1 ring-slate-200/70">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                In-Scope Assets
              </span>
              <span className="text-sm text-slate-400">Verified target set</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {detail.assets.map((asset) => (
                <a
                  key={asset}
                  href="#"
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:text-blue-600"
                >
                  <span>{asset}</span>
                  <ArrowUpRight className="size-3.5" />
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
