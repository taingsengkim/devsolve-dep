import {
  Eye,
  ShieldCheck,
  type LucideIcon,
  UserCheck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

import type { TeamCounts } from "@/components/teams/types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const tones = [
    "bg-blue-50 text-blue-700 ring-blue-200/80",
    "bg-slate-100 text-slate-700 ring-slate-200/80",
    "bg-emerald-50 text-emerald-700 ring-emerald-200/80",
    "bg-amber-50 text-amber-700 ring-amber-200/80",
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
          >
            <Card className="rounded-2xl border border-slate-200/80 bg-white shadow-xs">
              <CardHeader className="gap-4">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.title}
                </CardDescription>
                <CardAction>
                  <div
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl ring-1",
                      tones[index]
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                </CardAction>
                <CardTitle className="text-3xl font-bold tracking-tight text-slate-900 sm:text-[2rem]">
                  {item.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium leading-relaxed text-slate-500">{item.meta}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
