"use client";

import { motion } from "motion/react";
import { Trophy, ShieldCheck, Target, DollarSign, Sparkles } from "lucide-react";
import { LeaderboardStats } from "@/lib/types/leaderboard/types";

interface LeaderboardHeroProps {
  stats?: LeaderboardStats;
}

export default function LeaderboardHero({ stats }: LeaderboardHeroProps) {
  const statItems = [
    {
      label: "Active Researchers",
      value: (stats?.activeResearchers ?? 2841).toLocaleString(),
      icon: Trophy,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-500/10 text-amber-600 border-amber-200/50",
    },
    {
      label: "Valid Vulnerabilities",
      value: (stats?.validReports ?? 19430).toLocaleString(),
      icon: ShieldCheck,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-500/10 text-blue-600 border-blue-200/50",
    },
    {
      label: "Programs Live",
      value: (stats?.programsLive ?? 312).toLocaleString(),
      icon: Target,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-500/10 text-emerald-600 border-emerald-200/50",
    },
    {
      label: "Total Awarded",
      value: "$1,420,000+",
      icon: DollarSign,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-500/10 text-purple-600 border-purple-200/50",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-10 text-white shadow-xl mb-10">
      {/* Background ambient glows */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-semibold text-blue-400 border border-blue-500/20 mb-4">
            <Sparkles size={14} className="animate-pulse text-blue-400" />
            <span>Global Security Hall of Fame</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Security Leaderboard
          </h1>

          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Recognizing elite ethical hackers and security researchers competing worldwide to safeguard digital infrastructure.
          </p>
        </motion.div>

        {/* Right Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 lg:w-[480px] shrink-0">
          {statItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 + idx * 0.05 }}
                className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl border ${item.bgColor}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  {item.value}
                </div>
                <div className="text-xs font-medium text-slate-400 mt-0.5">
                  {item.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
