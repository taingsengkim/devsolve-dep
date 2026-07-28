import {
  Eye,
  ShieldCheck,
  type LucideIcon,
  UserCheck,
  Users,
} from "lucide-react";

import type { TeamCounts } from "@/components/teams/types";
import { Button } from "@/components/ui/button";

type TeamStatCard = {
  title: string;
  value: number;
  meta: string;
  icon: LucideIcon;
};

function buildTeamStatCards(counts: TeamCounts): TeamStatCard[] {
  return [
    {
      title: "Total Members",
      value: counts.total,
      meta: `${counts.active} active`,
      icon: Users,
    },
    {
      title: "Managers",
      value: counts.managers,
      meta: "Super admin",
      icon: ShieldCheck,
    },
    {
      title: "Members",
      value: counts.members,
      meta: `${counts.members - counts.pending} working staff / ${counts.pending} pending`,
      icon: UserCheck,
    },
    {
      title: "Viewers",
      value: counts.viewers,
      meta: "Read-only",
      icon: Eye,
    },
  ];
}

type TeamsStatsGridProps = {
  counts: TeamCounts;
};

export function TeamsStatsGrid({ counts }: TeamsStatsGridProps) {
  const statCards = buildTeamStatCards(counts);
  const tones = [
    "bg-slate-900 text-white hover:bg-slate-800",
    "bg-blue-600 text-white hover:bg-blue-700",
    "bg-emerald-600 text-white hover:bg-emerald-700",
    "bg-amber-600 text-white hover:bg-amber-700",
  ];

  return (
    <section className="flex flex-wrap items-center gap-2.5">
      {statCards.map((item, index) => {
        const Icon = item.icon;

        return (
          <Button
            key={item.title}
            variant="outline"
            className={`h-10 rounded-xl border-transparent px-4 text-sm font-semibold shadow-xs ${tones[index]}`}
          >
            <Icon data-icon="inline-start" />
            {item.value} {item.title}
          </Button>
        );
      })}
    </section>
  );
}
