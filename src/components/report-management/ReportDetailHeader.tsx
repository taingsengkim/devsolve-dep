import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Mail,
  ShieldAlert,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import type { ReportManagementDetail } from "@/components/report-management/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportDetailHeaderProps = {
  detail: ReportManagementDetail;
};

export function ReportDetailHeader({ detail }: ReportDetailHeaderProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4">
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
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                {detail.type}
              </Badge>
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                {detail.status}
              </Badge>
              <Badge
                variant="outline"
                className="border-slate-200 bg-white text-slate-600"
              >
                <ShieldCheck />
                Verified submission
              </Badge>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Avatar
                  size="lg"
                  className="border border-slate-200 bg-white text-slate-700 shadow-xs"
                >
                  {detail.programLogo ? (
                    <AvatarImage src={detail.programLogo} alt={`${detail.title} logo`} />
                  ) : null}
                  <AvatarFallback className="bg-slate-100 text-sm font-semibold text-slate-700">
                    TT
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {detail.title}
                  </h1>
                  <p className="max-w-3xl text-base text-slate-500">
                    Full vulnerability submission detail, target context, and internal
                    assessment notes for Report #{detail.reportId}.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard/report-management"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "rounded-xl border-slate-300 bg-white text-slate-700"
            )}
          >
            <ArrowLeft data-icon="inline-start" />
            Back to reports
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[
          {
            label: "Submitter",
            value: detail.submitter,
            icon: UserCircle2,
          },
          {
            label: "Severity",
            value: `${detail.severity} (${detail.cvssScore})`,
            icon: ShieldAlert,
          },
          {
            label: "Date Submitted",
            value: detail.submittedDate,
            icon: CalendarDays,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <Card key={item.label} className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {item.label}
                  </CardDescription>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {item.value}
                  </CardTitle>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
        <CardContent className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1fr)_300px]">
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-slate-200 bg-slate-100 text-slate-600"
              >
                Report ID #{detail.reportId}
              </Badge>
              <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
              >
                CVSS {detail.cvssScore}
              </Badge>
            </div>

            <p className="text-base leading-7 text-slate-600">{detail.summary}</p>

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-500">
                  In-Scope Assets
                </span>
                <span className="text-sm text-slate-400">Verified target set</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {detail.assets.map((asset) => (
                  <span
                    key={asset}
                    className="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Reward range</p>
                  <p className="text-sm text-slate-500">Estimated bounty and reputation band</p>
                </div>
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <ShieldAlert className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-lg font-bold tracking-tight text-emerald-600">
                {detail.bountyRange}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                  <UserCircle2 className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-slate-900">Submitter</p>
                  <p className="text-sm text-slate-500">{detail.submitter}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                  <Mail className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-sm font-semibold text-slate-900">Researcher contact</p>
                  <p className="text-sm text-slate-500">
                    {detail.submitterInitials.toLowerCase()}@devsolve.io
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
