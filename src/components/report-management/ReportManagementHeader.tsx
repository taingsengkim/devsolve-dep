import Link from "next/link";
import { Download, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ReportManagementHeader() {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400">
            Admin
            <span className="mx-2 text-slate-300">{">"}</span>
            <span className="text-slate-500">Report Management</span>
          </p>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
              <ShieldCheck />
              Moderation console
            </Badge>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
              61 open
            </Badge>
            <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">
              12 needs review
            </Badge>
          </div>

          <p className="text-sm text-slate-500">
            Review and manage KYC verification requests from organizations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start">
          <Link
            href="/dashboard/report-management/review-queue"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl border-slate-300 bg-white font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            )}
          >
            Review queue
          </Link>

          <Link
            href="/dashboard/report-management/export"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "rounded-xl border-slate-300 bg-white font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            )}
          >
            <Download data-icon="inline-start" />
            Export
          </Link>
        </div>
      </div>
    </header>
  );
}
