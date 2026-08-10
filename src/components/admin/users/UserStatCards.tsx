"use client";

import React from "react";
import { FileText, Shield, UserCheck, Users } from "lucide-react";
import { AdminUserItem } from "@/lib/redux/services/adminApi";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface UserStatCardsProps {
  users: AdminUserItem[];
  totalCount?: number;
}

export function UserStatCards({ users, totalCount }: UserStatCardsProps) {
  const total = typeof totalCount === "number" ? totalCount : users.length;
  const activeCount = users.filter((u) => u.status === "ACTIVE").length;
  const totalReports = users.reduce((acc, u) => acc + (u.reportsSubmitted || 0), 0);
  const suspended = users.filter((u) => u.status === "SUSPENDED").length;

  const stats = [
    {
      title: "Total Users",
      value: total,
      subtext: `${suspended} suspended`,
      icon: Users,
    },
    {
      title: "Active Users",
      value: activeCount,
      subtext: "Active accounts",
      icon: UserCheck,
    },
    {
      title: "Reports Submitted",
      value: totalReports,
      subtext: "Across active users",
      icon: FileText,
    },
    {
      title: "Suspended Accounts",
      value: suspended,
      subtext: "Require admin review",
      icon: Shield,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <Card className="gap-3 rounded-2xl border border-slate-200 bg-white py-5 shadow-2xs transition-shadow hover:shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3 px-5">
                <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-0.5 px-5">
                <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {stat.value}
                </div>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.subtext}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
