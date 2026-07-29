import { ProfileStats, SeverityStats, ProfileBadge } from "@/lib/types/profile/types";
import StatsCards from "../StatsCards";
import SeverityBreakdown from "../SeverityBreakdown";
import BadgesGrid from "../BadgesGrid";

interface OverviewTabProps {
  stats: ProfileStats;
  severity: SeverityStats;
  badges: ProfileBadge[];
}

export default function OverviewTab({ stats, severity, badges }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SeverityBreakdown severity={severity} />
        <BadgesGrid badges={badges} />
      </div>
    </div>
  );
}