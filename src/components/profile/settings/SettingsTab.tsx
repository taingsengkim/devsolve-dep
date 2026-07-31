"use client";

import { motion } from "motion/react";
import { User, Globe, Lock, Bell } from "lucide-react";

export interface SettingsTabItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const SETTINGS_TABS: SettingsTabItem[] = [
  { id: "personal-info", label: "Personal Information", icon: User },
  { id: "bio-social", label: "Bio & Social Links", icon: Globe },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "preferences", label: "Preferences & Security", icon: Bell },
];

interface SettingsTabProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function SettingsTab({ activeId, onSelect }: SettingsTabProps) {
  return (
    <div className="border-b border-slate-200/80 dark:border-slate-800">
      <nav className="flex gap-2 sm:gap-6 overflow-x-auto no-scrollbar" aria-label="Settings Tabs">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeId === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelect(tab.id)}
              className={`relative flex items-center gap-2 pb-3.5 pt-1 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                isActive
                  ? "text-blue-600 dark:text-blue-400 font-bold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Icon className={`size-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400"}`} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="settings-tab-indicator"
                  className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-blue-600 dark:bg-blue-400"
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
