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
            className="text-left cursor-pointer"
          >
            <Card
              className={cn(
                "rounded-[26px] bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none py-0 shadow-xs transition-all duration-300 hover:-translate-y-0.5",
                isActive && "ring-2 ring-blue-500/40 bg-blue-500/5"
              )}
            >
              <CardContent className="flex min-h-[142px] items-start justify-between px-5 py-5">
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "flex size-11 items-center justify-center rounded-2xl",
                        lane.accent === "amber" && "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
                        lane.accent === "blue" && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
                        lane.accent === "emerald" && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      )}
                    >
                      <Icon className="size-5" />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        {lane.title}
                      </span>
                      <span className="line-clamp-2 text-xs leading-5 text-muted-foreground">
                        {lane.description}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-end gap-3">
                    <p className="text-[2rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
                      {lane.count}
                    </p>
                    {isActive ? (
                      <Badge
                        variant="outline"
                        className="h-7 rounded-full border-blue-500/20 bg-blue-500/10 px-2.5 text-xs font-semibold text-blue-600 dark:text-blue-400"
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
