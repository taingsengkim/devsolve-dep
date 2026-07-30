import { BarChart3, CheckCheck, Clock3, ShieldAlert, type LucideIcon } from "lucide-react";

import { REPORT_METRICS } from "@/components/report-management/mock-data";
import { cn } from "@/lib/utils";

const METRIC_ICONS: LucideIcon[] = [BarChart3, Clock3, ShieldAlert, CheckCheck];

export function ReportMetricsGrid() {
  return (
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {REPORT_METRICS.map((metric, index) => {
        const Icon = METRIC_ICONS[index];

        return (
          <div
            key={metric.title}
            className={cn(
              "group relative overflow-hidden flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)]",
              index === 0 && "border-slate-200",
              index === 1 && "border-blue-100",
              index === 2 && "border-slate-200",
              index === 3 && "border-emerald-100"
            )}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            </div>
            <div
              className={cn(
                "relative z-10 flex size-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                index === 0 && "bg-slate-100 text-slate-800",
                index === 1 && "bg-blue-50 text-blue-600",
                index === 2 && "bg-slate-100 text-slate-800",
                index === 3 && "bg-emerald-50 text-emerald-600"
              )}
            >
              <Icon className="size-4.5" />
            </div>

            <div className="relative z-10">
              <p className="text-xl font-bold tracking-tight text-slate-900">
                {metric.value}
              </p>
              <p className="text-xs font-medium text-slate-500">
                {metric.title}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
