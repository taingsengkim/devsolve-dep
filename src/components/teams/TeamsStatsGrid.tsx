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
    <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={cn(
              "group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_8px_18px_rgba(15,23,42,0.05)]",
              index === 0 && "border-slate-200",
              index === 1 && "border-blue-100",
              index === 2 && "border-emerald-100",
              index === 3 && "border-slate-200"
            )}
          >
            <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.02)_1px,transparent_1px)] bg-[length:4px_4px]" />
            </div>

            <div className="relative z-10 flex items-center gap-3">
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
                  index === 0 && "bg-slate-100 text-slate-800",
                  index === 1 && "bg-blue-50 text-blue-600",
                  index === 2 && "bg-emerald-50 text-emerald-600",
                  index === 3 && "bg-slate-100 text-slate-700"
                )}
              >
                <Icon className="size-4.5" />
              </div>

              <div>
                <p className="text-xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </p>
                <p className="text-xs font-medium text-slate-500">
                  {item.title}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
