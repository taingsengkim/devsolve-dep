import { BarChart3, CheckCheck, Clock3, ShieldAlert, type LucideIcon } from "lucide-react";

import { REPORT_METRICS } from "@/components/report-management/mock-data";
import { Button } from "@/components/ui/button";

const METRIC_ICONS: LucideIcon[] = [BarChart3, Clock3, ShieldAlert, CheckCheck];
const METRIC_CLASSES = [
  "bg-slate-900 text-white hover:bg-slate-800",
  "bg-amber-600 text-white hover:bg-amber-700",
  "bg-rose-600 text-white hover:bg-rose-700",
  "bg-emerald-600 text-white hover:bg-emerald-700",
];

export function ReportMetricsGrid() {
  return (
    <section className="flex flex-wrap items-center gap-2.5">
      {REPORT_METRICS.map((metric, index) => {
        const Icon = METRIC_ICONS[index];
        const metricClass = METRIC_CLASSES[index];

        return (
          <Button
            key={metric.title}
            variant="outline"
            className={`h-10 rounded-xl border-transparent px-4 text-sm font-semibold shadow-xs ${metricClass}`}
          >
            <Icon data-icon="inline-start" />
            {metric.value} {metric.title}
          </Button>
        );
      })}
    </section>
  );
}
