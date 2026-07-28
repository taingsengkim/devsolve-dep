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
            <Card className="border border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="gap-3">
                <CardDescription className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {item.title}
                </CardDescription>
                <CardAction>
                  <div className="flex size-10 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 ring-1 ring-slate-200/80">
                    <Icon className="size-5" />
                  </div>
                </CardAction>
                <CardTitle className="text-4xl font-bold tracking-tight text-slate-900">
                  {item.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium text-slate-500">{item.meta}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
