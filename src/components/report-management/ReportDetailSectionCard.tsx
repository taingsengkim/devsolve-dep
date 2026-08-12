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
    <Card className="overflow-hidden rounded-[24px] bg-card text-card-foreground ring-1 ring-foreground/5 dark:ring-foreground/10 border-none py-0 shadow-xs">
      <CardHeader className="rounded-t-[24px] border-b border-border bg-muted/60 px-5 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              {icon}
            </div>
            <CardTitle className="text-xl font-bold text-foreground">
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
