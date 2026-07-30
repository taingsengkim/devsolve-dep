import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PRIORITY_REVIEW_ITEMS } from "@/components/report-management/review-queue/mock-data";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

function severityClass(severity: (typeof PRIORITY_REVIEW_ITEMS)[number]["severity"]) {
  if (severity === "Critical") {
    return "bg-slate-900 text-white";
  }
  if (severity === "High") {
    return "bg-slate-200 text-slate-800";
  }
  return "bg-slate-100 text-slate-700";
}

export function ReviewQueuePriorityList() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Priority submissions
        </h2>
        <p className="mt-1 text-base text-slate-500">
          Focus the moderation team on the reports that need the next decision first.
        </p>
      </div>

      <div className="space-y-3">
        {PRIORITY_REVIEW_ITEMS.map((item) => (
          <Card
            key={item.id}
            className="rounded-[26px] border border-slate-200 bg-white py-0 shadow-[0_2px_10px_rgba(15,23,42,0.04)]"
          >
            <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-slate-200 bg-slate-100 text-slate-600">
                    Report #{item.id}
                  </Badge>
                  <Badge className={cn("border-0", severityClass(item.severity))}>
                    {item.severity}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Reporter: {item.reporter} • Submitted: {item.submittedAt}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start gap-3 lg:items-end">
                <p className="text-sm font-medium text-slate-500">{item.status}</p>
                <Link
                  href={`/dashboard/report-management/${item.id}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "rounded-xl border-slate-300 bg-white text-slate-700"
                  )}
                >
                  Open report
                  <ArrowRight data-icon="inline-end" />
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
