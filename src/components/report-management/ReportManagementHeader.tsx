import { Download, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ReportManagementHeader() {
  return (
    <header className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="border-slate-200 bg-white text-slate-600"
          >
            <ShieldCheck />
            Moderation console
          </Badge>
          <Badge
            variant="outline"
            className="border-emerald-200 bg-emerald-50 text-emerald-700"
          >
            61 open
          </Badge>
          <Badge
            variant="outline"
            className="border-amber-200 bg-amber-50 text-amber-700"
          >
            12 needs review
          </Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Report Management
          </h1>
          <p className="mt-1.5 max-w-3xl text-base font-normal text-slate-600">
            Review incoming submissions, monitor severity distribution, and keep
            the vulnerability response queue organized in one clean workspace.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          className="h-11 rounded-xl border-slate-300 bg-white px-4 font-semibold text-slate-700"
        >
          Review queue
        </Button>
        <Button
          variant="outline"
          className="h-11 rounded-xl border-slate-300 bg-white px-4 font-semibold text-slate-700"
        >
          <Download data-icon="inline-start" />
          Export
        </Button>
      </div>
    </header>
  );
}
