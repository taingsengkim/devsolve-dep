"use client";

import { motion } from "motion/react";
import { Activity, Crown, Lock, Shield, Star, Target, Trophy, Zap, LucideIcon } from "lucide-react";
import { ProfileBadge } from "@/lib/types/profile/types";

const ICON_MAP: Record<ProfileBadge["icon"], LucideIcon> = {
  trophy: Trophy,
  shield: Shield,
  zap: Zap,
  activity: Activity,
  star: Star,
  target: Target,
  crown: Crown,
  check: Shield,
};

interface BadgeItemProps {
  badge: ProfileBadge;
}

export default function BadgeItem({ badge }: BadgeItemProps) {
  const Icon = ICON_MAP[badge.icon];

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-col items-center gap-2 rounded-xl border p-3.5 text-center transition ${
        badge.locked
          ? "border-slate-100 bg-slate-50/70 text-slate-400 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-500"
          : "border-slate-200/80 bg-white shadow-2xs hover:border-slate-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
          badge.locked
            ? "bg-slate-200/60 text-slate-400 dark:bg-neutral-800 dark:text-neutral-500"
            : "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-300"
        }`}
      >
        {badge.locked ? <Lock size={16} /> : <Icon size={18} />}
      </div>
      <div>
        <p className={`text-sm font-semibold ${badge.locked ? "text-slate-400 dark:text-neutral-500" : "text-slate-800 dark:text-neutral-200"}`}>{badge.label}</p>
        {badge.locked && <p className="text-xs font-medium text-slate-400 dark:text-neutral-500">Locked</p>}
      </div>
    </motion.div>
  );
}
