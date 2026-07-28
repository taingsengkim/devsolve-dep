"use client";

import { motion } from "motion/react";
import { FolderKanban, TimerReset, UsersRound, Waves } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DashboardStatsGridProps = {
  totalProjects: number;
  activeCount: number;
  reviewingCount: number;
  onHoldCount: number;
  squadCount: number;
};

const tones = [
  "bg-blue-50 text-blue-700 ring-1 ring-blue-100",
  "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
  "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
];

export function DashboardStatsGrid({
  totalProjects,
  activeCount,
  reviewingCount,
  onHoldCount,
  squadCount,
}: DashboardStatsGridProps) {
  const stats = [
    {
      title: "Total workspaces",
      value: totalProjects,
      caption: "Programs currently being tracked",
      icon: FolderKanban,
    },
    {
      title: "Active pipelines",
      value: activeCount,
      caption: "Execution lanes moving without blockers",
      icon: Waves,
    },
    {
      title: "Reviewing now",
      value: reviewingCount,
      caption: `${onHoldCount} workspace waiting unblock`,
      icon: TimerReset,
    },
    {
      title: "Engaged squads",
      value: squadCount,
      caption: "Cross-functional teams in rotation",
      icon: UsersRound,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.05 }}
          >
            <Card className="border border-slate-200/80 bg-white shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </CardTitle>
                  <span className="text-3xl font-bold tracking-tight text-slate-950">
                    {stat.value}
                  </span>
                </div>
                <div
                  className={`flex size-11 items-center justify-center rounded-2xl ${tones[index]}`}
                >
                  <Icon className="size-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm leading-6 text-slate-500">{stat.caption}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
