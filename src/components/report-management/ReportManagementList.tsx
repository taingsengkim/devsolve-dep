import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import type { ManagedReport } from "@/components/report-management/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ReportManagementListProps = {
  reports: ManagedReport[];
  filteredCount: number;
};

function typeBadgeClass(type: ManagedReport["type"]) {
  return type === "Bounty"
    ? "border-blue-200 bg-blue-600 text-white"
    : "border-slate-200 bg-slate-900 text-white";
}

function statusBadgeClass(status: ManagedReport["status"]) {
  return status === "Open"
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-slate-200 bg-slate-100 text-slate-600";
}

function severityBadgeClass(severity: ManagedReport["severity"]) {
  if (severity === "Critical") return "border-rose-200 bg-rose-50 text-rose-700";
  if (severity === "High") return "border-amber-200 bg-amber-50 text-amber-700";
  if (severity === "Medium") return "border-blue-200 bg-blue-50 text-blue-700";
  return "border-slate-200 bg-slate-100 text-slate-600";
}

export function ReportManagementList({
  reports,
  filteredCount,
}: ReportManagementListProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-600">
              <th className="px-4 py-3.5 sm:px-6">Report</th>
              <th className="px-4 py-3.5 sm:px-6">Type</th>
              <th className="px-4 py-3.5 sm:px-6">Status</th>
              <th className="px-4 py-3.5 sm:px-6">Severity</th>
              <th className="px-4 py-3.5 sm:px-6">Submitted</th>
              <th className="px-4 py-3.5 text-right sm:px-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reports.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-slate-400"
                >
                  No reports match the current filters.
                </td>
              </tr>
            ) : (
              reports.map((report, index) => (
                <motion.tr
                  key={report.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.04 }}
                  className="group transition-colors hover:bg-slate-50/70"
                >
                  <td className="px-4 py-4 sm:px-6">
                    <div className="flex items-start gap-3">
                      <Avatar
                        size="lg"
                        className="rounded-xl border border-slate-200 bg-slate-100 text-slate-700"
                      >
                        <AvatarFallback className="rounded-xl bg-slate-100 font-semibold text-slate-700">
                          {report.authorInitials}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                          {report.title}
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
                          <span>{report.authorEmail}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span>Report #{report.id}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {report.assets.slice(0, 2).map((asset) => (
                            <span
                              key={asset}
                              className="inline-flex max-w-[150px] truncate rounded-md border border-slate-200/80 bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              {asset}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                    <Badge
                      variant="outline"
                      className={cn("rounded-lg px-2.5 py-1 text-sm font-semibold", typeBadgeClass(report.type))}
                    >
                      {report.type}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                    <Badge
                      variant="outline"
                      className={cn("rounded-lg px-2.5 py-1 text-sm font-semibold", statusBadgeClass(report.status))}
                    >
                      {report.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap sm:px-6">
                    <Badge
                      variant="outline"
                      className={cn("rounded-lg px-2.5 py-1 text-sm font-semibold", severityBadgeClass(report.severity))}
                    >
                      {report.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-600 sm:px-6">
                    {report.submittedAt}
                  </td>
                  <td className="px-4 py-4 text-right whitespace-nowrap sm:px-6">
                    <Link
                      href={`/dashboard/report-management/${report.id}`}
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "rounded-xl border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                      )}
                    >
                      Review
                      <ArrowRight data-icon="inline-end" />
                    </Link>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="flex flex-col items-center justify-between gap-4 border-t border-slate-200/80 bg-slate-50/50 p-4 sm:flex-row">
        <span className="text-sm font-medium text-slate-500">
          Showing {reports.length} of {filteredCount} matching reports
        </span>
        <span className="text-sm text-slate-400">
          Review queue updated for the latest moderation activity
        </span>
      </footer>
    </div>
  );
}
