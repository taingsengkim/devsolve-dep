import {
  Eye,
  ShieldCheck,
  type LucideIcon,
  UserCheck,
  Users,
} from "lucide-react";

import type { TeamCounts } from "@/components/teams/types";
import { cn } from "@/lib/utils";

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

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((item) => {
        return (
          <div
            key={item.title}
            className={cn(
              "rounded-[28px] border border-slate-200 bg-white px-5 py-4 shadow-[0_4px_18px_rgba(148,163,184,0.12)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(148,163,184,0.16)]"
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
              {item.title}
            </p>
            <p
              className={cn(
                "mt-2.5 text-4xl font-bold tracking-[-0.04em] text-[#2563EB]"
              )}
            >
              {item.value}
            </p>
            <p className="mt-1.5 text-sm text-slate-400">{item.meta}</p>
          </div>
        );
      })}
    </section>
  );
}
