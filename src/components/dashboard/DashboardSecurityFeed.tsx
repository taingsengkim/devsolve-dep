"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, ShieldCheck, UserPlus, DollarSign } from "lucide-react";
import { SecurityFeedItem } from "@/lib/types/dashboard/types";
import { Badge } from "@/components/ui/badge";

interface DashboardSecurityFeedProps {
  feed: SecurityFeedItem[];
}

const getFeedIcon = (type: SecurityFeedItem["type"]) => {
  switch (type) {
    case "confirmed":
      return {
        icon: ShieldCheck,
        bg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
      };
    case "resolved":
      return {
        icon: CheckCircle2,
        bg: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
      };
    case "joined":
      return {
        icon: UserPlus,
        bg: "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400",
      };
    case "bounty":
      return {
        icon: DollarSign,
        bg: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
      };
  }
};

export const DashboardSecurityFeed: React.FC<DashboardSecurityFeedProps> = ({ feed }) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Security Feed
          </h2>
          <Badge variant="outline" className="text-xs font-normal text-slate-500 shadow-none border-slate-200 dark:border-slate-800">
            Live
          </Badge>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-1">
          {feed.map((item, idx) => {
            const config = getFeedIcon(item.type);
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                className="py-3.5 px-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors flex items-start gap-3"
              >
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${config.bg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200 leading-snug">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{item.timestamp}</span>
                    {item.severity && (
                      <>
                        <span>•</span>
                        <span className="font-semibold text-slate-600 dark:text-slate-300">
                          {item.severity}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
