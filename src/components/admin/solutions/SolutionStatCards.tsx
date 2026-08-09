"use client";

import React from "react";
import { ClipboardList, Clock, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "motion/react";

interface SolutionStatCardsProps {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export const SolutionStatCards: React.FC<SolutionStatCardsProps> = ({
  total,
  pending,
  approved,
  rejected,
}) => {
  const stats = [
    {
      title: "Total Solutions",
      value: total,
      subtext: "Submitted by community",
      icon: ClipboardList,
      color:
        "text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pending Review",
      value: pending,
      subtext: "Requires admin audit",
      icon: Clock,
      color:
        "text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    {
      title: "Approved Solutions",
      value: approved,
      subtext: "Verified solution proposals",
      icon: CheckCircle2,
      color:
        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Rejected Solutions",
      value: rejected,
      subtext: "Declined by review team",
      icon: XCircle,
      color:
        "text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-all space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center ${stat.color}`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stat.value}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {stat.subtext}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
