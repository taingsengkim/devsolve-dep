import { Activity, ArrowUpRight, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardOverviewHeaderProps = {
  totalProjects: number;
  squadCount: number;
};

export function DashboardOverviewHeader({
  totalProjects,
  squadCount,
}: DashboardOverviewHeaderProps) {
  return (
    <Card className="border border-slate-200/80 bg-white shadow-sm">
      <CardHeader className="gap-4 lg:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-3">
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700"
          >
            <ShieldCheck />
            Security operations
          </Badge>
          <div className="flex flex-col gap-2">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Dashboard
            </CardTitle>
            <CardDescription className="max-w-3xl text-base leading-7 text-slate-500">
              Monitor active program workspaces, squad coordination, and delivery
              signals from one clean operations view.
            </CardDescription>
          </div>
        </div>

        <CardAction className="w-full lg:w-[280px]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Activity className="size-4 text-emerald-600" />
                Live workspace pulse
              </div>
              <Badge
                variant="outline"
                className="border-emerald-200 bg-emerald-50 text-emerald-700"
              >
                Updated today
              </Badge>
            </div>
            <div className="mt-4 flex items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-3xl font-bold tracking-tight text-slate-950">
                  {totalProjects}
                </span>
                <p className="text-sm text-slate-500">
                  workspaces across {squadCount} squads
                </p>
              </div>
              <Button variant="outline" className="rounded-full border-slate-300">
                View roadmap
                <ArrowUpRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
            Triage readiness 96%
          </Badge>
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
            Median response 2h 18m
          </Badge>
          <Badge variant="outline" className="border-slate-200 bg-white text-slate-600">
            3 reviews waiting sign-off
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
