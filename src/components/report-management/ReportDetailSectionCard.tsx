import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type ReportDetailSectionCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  contentClassName?: string;
};

export function ReportDetailSectionCard({
  title,
  icon,
  children,
  headerRight,
  contentClassName,
}: ReportDetailSectionCardProps) {
  return (
    <Card className="overflow-hidden rounded-[24px] border border-slate-200 bg-white py-0 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <CardHeader className="rounded-t-[24px] border-b border-slate-200 bg-slate-50/80 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              {icon}
            </div>
            <CardTitle className="text-xl font-semibold text-slate-900">
              {title}
            </CardTitle>
          </div>

          {headerRight ? <div className="flex flex-wrap gap-2">{headerRight}</div> : null}
        </div>
      </CardHeader>

      <CardContent className={cn("px-5 py-5 sm:px-6 sm:py-6", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  );
}
