import { Activity, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function ReportManagementHeader() {
  return (
    <header className="rounded-4xl border border-slate-200/80 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
            <span>Admin</span>
            <span>&gt;</span>
            <span className="text-slate-700">Report Management</span>
          </div>

          <div className="flex flex-col gap-3">
            <Badge
              variant="outline"
              className="w-fit border-slate-200 bg-slate-50 px-3 py-1 text-slate-600"
            >
              <ShieldCheck className="size-3.5" />
              Moderation Console
            </Badge>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Report Management
              </h1>
              <p className="max-w-2xl text-base leading-relaxed text-slate-500">
                Review incoming submissions, track severity distribution, and keep
                your vulnerability response pipeline organized in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
                200 total submissions
              </Badge>
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                61 open
              </Badge>
              <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
                12 needs review
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-4 xl:min-w-[280px]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Live Queue</p>
              <p className="text-sm text-slate-500">
                Moderation status across the current intake.
              </p>
            </div>
            <div className="flex size-10 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
              <Activity className="size-5" />
            </div>
          </div>

          <Separator className="bg-slate-200" />

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500">Open reports</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900">61</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-slate-500">Needs action</span>
              <span className="text-2xl font-bold tracking-tight text-slate-900">12</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" className="rounded-full">
              Review queue
            </Button>
            <Button variant="outline" size="sm" className="rounded-full bg-white">
              Export
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
