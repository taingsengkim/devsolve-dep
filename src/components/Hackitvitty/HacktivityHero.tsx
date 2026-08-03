"use client";

import { motion } from "motion/react";
import { Radio, DollarSign, ShieldCheck, ShieldAlert, Sparkles } from "lucide-react";

interface HacktivityHeroProps {
  stats?: Array<{ label: string; value: string }>;
}

export default function HacktivityHero({ stats }: HacktivityHeroProps) {
  const statItems = [
    {
      label: "Disclosures Today",
      value: "24",
      icon: Radio,
      bgColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    {
      label: "Bounties Paid (This Month)",
      value: "$184,500",
      icon: DollarSign,
      bgColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    {
      label: "Total Resolved Bugs",
      value: (stats?.[0]?.value ?? "19,430"),
      icon: ShieldCheck,
      bgColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
    {
      label: "Top Severity Disclosed",
      value: "Critical",
      icon: ShieldAlert,
      bgColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-10 text-white shadow-xl mb-10 border border-slate-800">
      {/* Background ambient glow */}
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
            <span>Real-Time Security Activity</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Hacktivity Stream
          </h1>

          <p className="mt-3 text-base text-slate-300 leading-relaxed">
            Real-time feed of resolved vulnerabilities, bounty rewards, hacker achievements, and public disclosure reports.
          </p>
        </motion.div>

        {/* Right Stat Cards */}
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
