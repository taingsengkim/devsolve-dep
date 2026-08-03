"use client";

import React from "react";
import { motion } from "motion/react";

export const PROGRAM_DETAILS_TABS = [
  { id: "overview", label: "Overview" },
  { id: "scope", label: "Scope" },
  { id: "bounty-matrix", label: "Bounty Matrix" },
  { id: "rules", label: "Rules & Exclusions" },
] as const;

export type ProgramDetailTabId = (typeof PROGRAM_DETAILS_TABS)[number]["id"];

interface ProgramDetailTabNavProps {
  activeTab: ProgramDetailTabId;
  onTabChange: (tabId: ProgramDetailTabId) => void;
}

export const ProgramDetailTabNav: React.FC<ProgramDetailTabNavProps> = ({
  activeTab,
  onTabChange,
}) => {

// this si the filter tab ( Overview , Scope , Bounty Matrix , Rule & Exclusions )

  return (
    <nav className="border-b border-slate-200 bg-white rounded-xl px-2 pt-2 shadow-2xs">
      <ul className="flex items-center gap-1 overflow-x-auto">
        {PROGRAM_DETAILS_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <li key={tab.id}>
              <button
                onClick={() => onTabChange(tab.id)}
                className={`relative px-6 py-3.5 text-base font-bold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "text-blue-600"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="activeProgramTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 35 }}
                  />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
