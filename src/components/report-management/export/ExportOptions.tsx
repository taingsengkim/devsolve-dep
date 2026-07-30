import { Download, FileArchive, FileSpreadsheet, FileText } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EXPORT_OPTIONS = [
  {
    title: "Queue summary CSV",
    description: "Export report ids, status, severity, assignee, and decision timestamps.",
    icon: FileSpreadsheet,
  },
  {
    title: "Moderation audit PDF",
    description: "Generate a clean review packet for approvals, analyst comments, and timelines.",
    icon: FileText,
  },
  {
    title: "Evidence package ZIP",
    description: "Bundle attachments, screenshots, and notes into a single handoff archive.",
    icon: FileArchive,
  },
];

export function ExportOptions() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Export templates
        </h2>
        <p className="mt-1 text-base text-slate-500">
          Pick the format that fits your moderation handoff or reporting workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        {EXPORT_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <Card
              key={option.title}
              className="rounded-[28px] border border-slate-200 bg-white py-0 shadow-[0_2px_12px_rgba(15,23,42,0.04)]"
            >
              <CardContent className="space-y-4 p-5">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                  <Icon className="size-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{option.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-slate-500">{option.description}</p>
                </div>
                <button
                  type="button"
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "w-full rounded-xl border-slate-300 bg-white font-semibold text-slate-700"
                  )}
                >
                  <Download data-icon="inline-start" />
                  Prepare export
                </button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
