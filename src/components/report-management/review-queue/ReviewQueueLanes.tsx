import { CircleCheckBig, Clock3, ShieldAlert, type LucideIcon } from "lucide-react";

import { REVIEW_QUEUE_LANES } from "@/components/report-management/review-queue/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LANE_ICONS: Record<(typeof REVIEW_QUEUE_LANES)[number]["accent"], LucideIcon> = {
  amber: Clock3,
  blue: ShieldAlert,
  emerald: CircleCheckBig,
};

export function ReviewQueueLanes() {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
      {REVIEW_QUEUE_LANES.map((lane) => {
        const Icon = LANE_ICONS[lane.accent];

        return (
          <Card
            key={lane.title}
            className={cn(
              "rounded-[28px] border bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)]",
              lane.accent === "amber" && "border-amber-200/80",
              lane.accent === "blue" && "border-blue-200/80",
              lane.accent === "emerald" && "border-emerald-200/80"
            )}
          >
            <CardContent className="space-y-4 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">{lane.title}</p>
                  <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                    {lane.count}
                  </p>
                </div>
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-2xl border",
                    lane.accent === "amber" && "border-amber-200 bg-amber-50 text-amber-700",
                    lane.accent === "blue" && "border-blue-200 bg-blue-50 text-blue-700",
                    lane.accent === "emerald" && "border-emerald-200 bg-emerald-50 text-emerald-700"
                  )}
                >
                  <Icon className="size-5" />
                </div>
              </div>
              <p className="text-sm leading-6 text-slate-500">{lane.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
