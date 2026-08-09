import { CircleCheckBig, Clock3, ShieldAlert, type LucideIcon } from "lucide-react";

import type {
  ReviewQueueLane,
  ReviewQueueLaneFilter,
} from "@/components/report-management/review-queue/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const LANE_ICONS: Record<ReviewQueueLane["accent"], LucideIcon> = {
  amber: Clock3,
  blue: ShieldAlert,
  emerald: CircleCheckBig,
};

type ReviewQueueLanesProps = {
  activeQueue: ReviewQueueLaneFilter;
  onQueueChange: (queue: ReviewQueueLaneFilter) => void;
  lanes: ReviewQueueLane[];
};

export function ReviewQueueLanes({
  activeQueue,
  onQueueChange,
  lanes,
}: ReviewQueueLanesProps) {
  return (
    <section className="grid grid-cols-1 gap-3 xl:grid-cols-3">
      {lanes.map((lane) => {
        const Icon = LANE_ICONS[lane.accent];
        const isActive = activeQueue === lane.title;

        return (
          <button
            key={lane.title}
            type="button"
            onClick={() => onQueueChange(isActive ? "All" : lane.title)}
            className="text-left"
          >
            <Card
              className={cn(
                "rounded-[26px] border border-slate-200 bg-white py-0 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]",
                isActive && "border-blue-200 bg-blue-50/30 shadow-[0_16px_30px_rgba(37,99,235,0.08)]"
              )}
            >
              <CardContent className="flex min-h-[142px] items-start justify-between px-5 py-5">
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-2xl",
                        lane.accent === "amber" && "bg-amber-50 text-amber-600",
                        lane.accent === "blue" && "bg-blue-50 text-blue-600",
                        lane.accent === "emerald" && "bg-emerald-50 text-emerald-600"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                        {lane.title}
                      </span>
                      <span className="line-clamp-2 text-xs leading-5 text-slate-500">
                        {lane.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end gap-3">
                    <p className="text-[2rem] font-semibold leading-none tracking-[-0.05em] text-[#0F172A]">
                      {lane.count}
                    </p>
                    {isActive ? (
                      <Badge
                        variant="outline"
                        className="h-7 rounded-full border-blue-200 bg-blue-50 px-2.5 text-xs font-semibold text-blue-700"
                      >
                        Active
                      </Badge>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          </button>
        );
      })}
    </section>
  );
}
