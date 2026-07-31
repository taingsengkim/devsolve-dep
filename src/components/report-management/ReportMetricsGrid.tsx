import { BarChart3, CheckCheck, Clock3, ShieldAlert, TrendingUp, type LucideIcon } from "lucide-react";

import { REPORT_METRICS } from "@/components/report-management/mock-data";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const METRIC_ICONS: LucideIcon[] = [BarChart3, Clock3, ShieldAlert, CheckCheck];
const METRIC_HELPERS = [
  "All submitted reports",
  "Waiting for triage",
  "In analyst review",
  "Ready for closure",
];
const METRIC_TRENDS = ["+14%", "-8%", "+2", "+11%"];

export function ReportMetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {REPORT_METRICS.map((metric, index) => {
        const Icon = METRIC_ICONS[index];

        return (
          <Card
            size="sm"
            key={metric.title}
            className={cn(
              "rounded-[26px] border border-slate-200 bg-white py-0 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]",
              "[--card-spacing:--spacing(0)]"
            )}
          >
            <CardContent className="flex items-start justify-between px-5 py-5">
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-2xl",
                      index === 0 && "bg-slate-100 text-slate-800",
                      index === 1 && "bg-amber-50 text-amber-600",
                      index === 2 && "bg-blue-50 text-blue-600",
                      index === 3 && "bg-emerald-50 text-emerald-600"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                      {metric.title}
                    </span>
                    <span className="text-xs text-slate-500">{METRIC_HELPERS[index]}</span>
                  </div>
                </div>

                <div className="flex items-end gap-3">
                  <p className="text-[2rem] font-semibold leading-none tracking-[-0.05em] text-[#0F172A]">
                    {metric.value}
                  </p>
                  <Badge
                    variant="outline"
                    className={cn(
                      "h-7 rounded-full px-2.5 text-xs font-semibold",
                      index === 1
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    )}
                  >
                    <TrendingUp />
                    {METRIC_TRENDS[index]}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
