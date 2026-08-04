"use client";

import React from "react";
import { Building2, Clock, CheckCircle2, XCircle } from "lucide-react";
import { CompanyVerificationItem } from "@/lib/redux/services/adminApi";
import { motion } from "motion/react";

interface OrganizationStatCardsProps {
  verifications: CompanyVerificationItem[];
}

export const OrganizationStatCards: React.FC<OrganizationStatCardsProps> = ({ verifications }) => {
  const total = verifications.length;
  const pending = verifications.filter((v) => v.status === "PENDING").length;
  const approved = verifications.filter((v) => v.status === "APPROVED").length;
  const rejected = verifications.filter((v) => v.status === "REJECTED").length;

  const stats = [
    {
      title: "Total Organizations",
      value: total,
      subtext: "Registered on platform",
      icon: Building2,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    },
    {
      title: "Pending KYC Review",
      value: pending,
      subtext: "Requires admin audit",
      icon: Clock,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    },
    {
      title: "Verified Partners",
      value: approved,
      subtext: "Active VDP program access",
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    },
    {
      title: "Rejected Requests",
      value: rejected,
      subtext: "Failed verification audit",
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200 dark:border-rose-800",
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
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${stat.color}`}>
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
