import { BarChart3, CheckCheck, Clock3, ShieldAlert, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";

import { REPORT_METRICS } from "@/components/report-management/mock-data";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const METRIC_ICONS: LucideIcon[] = [BarChart3, Clock3, ShieldAlert, CheckCheck];
const METRIC_TONES = [
  "bg-blue-50 text-blue-700 ring-blue-200/80",
  "bg-amber-50 text-amber-700 ring-amber-200/80",
  "bg-rose-50 text-rose-700 ring-rose-200/80",
  "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
];

export function ReportMetricsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {REPORT_METRICS.map((metric, index) => {
        const Icon = METRIC_ICONS[index];
        const tone = METRIC_TONES[index];

        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
          >
            <Card className="border border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="gap-4">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {metric.title}
                </CardDescription>
                <CardAction>
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-2xl ring-1",
                      tone
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                </CardAction>
                <CardTitle className="text-4xl font-bold tracking-tight text-slate-900 sm:text-[2.5rem]">
                  {metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-slate-500">
                  Snapshot of the current report moderation pipeline.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
