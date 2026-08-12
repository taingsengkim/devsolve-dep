import { BarChart3, CheckCheck, Clock3, ShieldAlert, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const METRIC_ICONS: LucideIcon[] = [BarChart3, Clock3, ShieldAlert, CheckCheck];
const METRIC_HELPERS = [
  "All submitted reports",
  "Waiting for triage",
  "In analyst review",
  "Ready for closure",
];

type ReportMetricsGridProps = {
  metrics: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
  };
  isLoading?: boolean;
};

export function ReportMetricsGrid({
  metrics,
  isLoading = false,
}: ReportMetricsGridProps) {
  const metricItems = [
    { title: "Total Report", value: metrics.total },
    { title: "Pending", value: metrics.pending },
    { title: "Under Review", value: metrics.underReview },
    { title: "Approved", value: metrics.approved },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metricItems.map((metric, index) => {
        const Icon = METRIC_ICONS[index];

        return (
          <Card
            size="sm"
            key={metric.title}
            className={cn(
              "rounded-[26px] bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none py-0 shadow-xs transition-all duration-300 hover:-translate-y-0.5",
              "[--card-spacing:--spacing(0)]"
            )}
          >
            <CardContent className="flex items-start justify-between px-5 py-5">
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl",
                      index === 0 && "bg-muted text-foreground",
                      index === 1 && "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
                      index === 2 && "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400",
                      index === 3 && "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {metric.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{METRIC_HELPERS[index]}</span>
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  {isLoading ? (
                    <div className="h-10 w-20 animate-pulse rounded-xl bg-muted" />
                  ) : (
                    <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-none">
                      {metric.value}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
