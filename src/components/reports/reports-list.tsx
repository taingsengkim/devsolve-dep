"use client";

import { Separator } from "@/components/ui/separator";
import { useGetMyReportsQuery } from "@/lib/redux/services/reportsApi";

export function ReportsList() {
  const { data: reports = [], error, isLoading } = useGetMyReportsQuery();

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading your reports…</p>;
  }

  if (error) {
    return <p className="text-sm text-destructive">Unable to load your reports. Please sign in and try again.</p>;
  }

  if (reports.length === 0) {
    return <p className="text-sm text-muted-foreground">You have not submitted any reports yet.</p>;
  }

  return (
    <ul className="flex flex-col">
      {reports.map((report, index) => (
        <li className="flex flex-col gap-3 py-4" key={report.id}>
          {index > 0 && <Separator />}
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-medium text-foreground">{report.title}</h2>
            <span className="text-sm text-muted-foreground">{report.severity}</span>
          </div>
          <p className="text-sm text-muted-foreground">{report.state}</p>
        </li>
      ))}
    </ul>
  );
}
