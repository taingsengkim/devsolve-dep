"use client";

import { motion } from "motion/react";
import { Activity, Flame, MessageSquare, Heart, LucideIcon } from "lucide-react";

export type ProfileTabId = "overview" | "hacktivity" | "community" | "hall-of-thanks";

interface ProfileTabsProps {
  activeTab: ProfileTabId;
  onTabChange: (tab: ProfileTabId) => void;
}

const TABS: { id: ProfileTabId; label: string; icon: LucideIcon }[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "hacktivity", label: "Hacktivity", icon: Flame },
  { id: "community", label: "Community", icon: MessageSquare },
  { id: "hall-of-thanks", label: "Hall of Thanks", icon: Heart },
];

export default function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800">
      {/* Four tabs don't fit a phone, so the rail scrolls — with the scrollbar
          hidden and the labels kept, because the icons alone aren't
          self-explanatory. `pr-1` keeps the last indicator off the edge. */}
      <nav className="flex gap-4 overflow-x-auto pr-1 sm:gap-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap pb-3 pt-1 text-sm font-semibold transition cursor-pointer ${
                isActive
                  ? "text-slate-900 dark:text-slate-100"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <Icon size={16} className={isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-500 dark:text-slate-400"} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="profile-tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600"
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}