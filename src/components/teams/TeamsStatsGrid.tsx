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
  iconClassName: string;
};

function buildTeamStatCards(counts: TeamCounts): TeamStatCard[] {
  return [
    {
      title: "Total Members",
      value: counts.total,
      meta: `${counts.active} active`,
      icon: Users,
      iconClassName: "bg-slate-100 text-slate-800",
    },
    {
      title: "Managers",
      value: counts.managers,
      meta: "Super admin",
      icon: ShieldCheck,
      iconClassName: "bg-blue-50 text-blue-600",
    },
    {
      title: "Members",
      value: counts.members,
      meta: `${counts.members - counts.pending} working staff / ${counts.pending} pending`,
      icon: UserCheck,
      iconClassName: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Viewers",
      value: counts.viewers,
      meta: "Read-only",
      icon: Eye,
      iconClassName: "bg-amber-50 text-amber-600",
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
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={cn(
              "rounded-[26px] border border-slate-200 bg-white px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(15,23,42,0.06)]"
            )}
          >
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-11 items-center justify-center rounded-2xl",
                  item.iconClassName
                )}
              >
                <Icon className="size-5" />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-slate-500">{item.meta}</p>
              </div>
            </div>

            <p className="mt-4 text-[2rem] font-semibold leading-none tracking-[-0.05em] text-[#0F172A]">
              {item.value}
            </p>
          </div>
        );
      })}
    </section>
  );
}
