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
            <Card className="gap-3 rounded-2xl border-none bg-card text-card-foreground py-5 shadow-xs ring-1 ring-foreground/5 dark:ring-foreground/10">
              <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3 px-5">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-0.5 px-5">
                <div className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-none">
                  {stat.value}
                </div>
                <CardDescription className="text-xs text-muted-foreground mt-1">
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
