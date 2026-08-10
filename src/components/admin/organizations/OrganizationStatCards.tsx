"use client";

import React from "react";
import { Building2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface OrganizationStatCardsProps {
  counts: {
    all: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export const OrganizationStatCards: React.FC<OrganizationStatCardsProps> = ({
  counts,
}) => {
  const stats = [
    {
      title: "Total Organizations",
      value: counts.all,
      subtext: "Registered on platform",
      icon: Building2,
    },
    {
      title: "Pending KYC Review",
      value: counts.pending,
      subtext: "Requires admin audit",
      icon: Clock,
    },
    {
      title: "Verified Partners",
      value: counts.approved,
      subtext: "Active VDP program access",
      icon: CheckCircle2,
    },
    {
      title: "Rejected Requests",
      value: counts.rejected,
      subtext: "Failed verification audit",
      icon: XCircle,
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
};
