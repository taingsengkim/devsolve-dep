import { Clock3, Download } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const RECENT_EXPORTS = [
  {
    title: "Queue summary CSV",
    createdAt: "Jul 29, 2026",
    detail: "Generated for moderation standup",
  },
  {
    title: "Approval audit PDF",
    createdAt: "Jul 28, 2026",
    detail: "Prepared for compliance archive",
  },
  {
    title: "Evidence package ZIP",
    createdAt: "Jul 28, 2026",
    detail: "Shared with security operations",
  },
  {
    title: "Severity review snapshot",
    createdAt: "Jul 27, 2026",
    detail: "Used in weekly incident review",
  },
];

export function RecentExports() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Recent exports
        </h2>
        <p className="mt-1 text-base text-slate-500">
          Quick access to the most recently prepared report packages.
        </p>
      </div>

      <Card className="rounded-[28px] border border-slate-200 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
        <CardContent className="divide-y divide-slate-100 p-0">
          {RECENT_EXPORTS.map((item) => (
            <div
              key={`${item.title}-${item.createdAt}`}
              className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.detail}</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="size-4" />
                  {item.createdAt}
                </span>
                <span className="inline-flex items-center gap-1.5 font-medium text-slate-700">
                  <Download className="size-4" />
                  Ready
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
