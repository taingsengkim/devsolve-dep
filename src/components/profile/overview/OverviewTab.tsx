import { ProfileStats, SeverityStats } from "@/lib/types/profile/types";
import StatsCards from "../StatsCards";
import SeverityBreakdown from "../SeverityBreakdown";

interface OverviewTabProps {
  stats: ProfileStats;
  severity: SeverityStats;
}

export default function OverviewTab({ stats, severity }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <StatsCards stats={stats} />
      <SeverityBreakdown severity={severity} />
    </div>
  );
}