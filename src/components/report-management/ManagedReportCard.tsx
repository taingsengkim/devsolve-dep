import Link from "next/link";
import { CircleDot } from "lucide-react";
import { motion } from "motion/react";

import type { ManagedReport } from "@/components/report-management/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function severityBadgeClass(severity: ManagedReport["severity"]) {
  if (severity === "Critical") return "text-slate-800";
  if (severity === "High") return "text-blue-600";
  if (severity === "Medium") return "text-emerald-600";
  return "text-slate-400";
}

function statusBadgeClass(status: ManagedReport["status"]) {
  return status === "Open" ? "text-emerald-600" : "text-rose-500";
}

function typeBadgeClass(type: ManagedReport["type"]) {
  return type === "Bounty"
    ? "bg-blue-50 text-blue-700"
    : "bg-slate-100 text-slate-700";
}

type ManagedReportCardProps = {
  report: ManagedReport;
};

export function ManagedReportCard({ report }: ManagedReportCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)]">
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-slate-200/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <CardContent className="relative p-4">
        <div className="flex items-start gap-3">
          <Avatar size="sm" className="mt-0.5 border border-slate-200 bg-slate-100 text-slate-700 transition-colors duration-300 group-hover:border-slate-300 group-hover:bg-white">
            {report.programLogo ? (
              <AvatarImage src={report.programLogo} alt={`${report.title} logo`} />
            ) : null}
            <AvatarFallback className="bg-slate-100 text-xs font-semibold text-slate-700">
              {report.authorInitials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold text-slate-900">
                    {report.title}
                  </h3>
                  <span className="text-xs text-slate-400">by {report.author}</span>
                </div>

                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px] font-medium">
                  <Badge className={typeBadgeClass(report.type)}>{report.type}</Badge>
                  <span className={statusBadgeClass(report.status)}>
                    <span className="inline-flex items-center gap-1">
                      <CircleDot className="size-2.5 fill-current" />
                      {report.status}
                    </span>
                  </span>
                  <span className={severityBadgeClass(report.severity)}>
                    {report.severity}
                  </span>
                </div>
              </div>

              <motion.div whileHover={{ y: -1 }} whileTap={{ y: 0 }}>
                <Link
                  href={`/dashboard/report-management/${report.id}`}
                  className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all duration-200 hover:border-slate-800 hover:bg-slate-800 hover:text-white hover:shadow-[0_8px_18px_rgba(15,23,42,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:ring-offset-2 group-hover:border-slate-300"
                >
                  Review details
                </Link>
              </motion.div>
            </div>

            <p className="mt-3 line-clamp-2 text-xs leading-5 text-slate-500">
              {report.summary}
            </p>

            <div className="mt-3">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                In-scope assets
              </span>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {report.assets.map((asset) => (
                  <span
                    key={asset}
                    className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-500 transition-colors duration-300 group-hover:border-slate-300 group-hover:bg-white"
                  >
                    {asset}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
