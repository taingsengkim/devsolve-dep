"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ExternalLink, ArrowRight } from "lucide-react";
import { DashboardProgram } from "@/lib/types/dashboard/types";
import { Badge } from "@/components/ui/badge";

interface DashboardMyProgramsProps {
  programs: DashboardProgram[];
}

export const DashboardMyPrograms: React.FC<DashboardMyProgramsProps> = ({ programs }) => {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-slate-200 dark:border-neutral-800 shadow-xs p-5 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-neutral-800">
          <h2 className="text-base font-semibold text-slate-900 dark:text-neutral-100">
            My Programs
          </h2>
          <Link
            href="/dashboard/programs"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Column Headers */}
        <div className="grid grid-cols-12 gap-2 text-xs font-medium text-slate-400 dark:text-neutral-500 uppercase tracking-wider py-3 border-b border-slate-100 dark:border-neutral-800/60 px-2">
          <div className="col-span-6">Program Name</div>
          <div className="col-span-3 text-center">Status</div>
          <div className="col-span-3 text-right">Reports</div>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-neutral-800/60">
          {programs.map((program, idx) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
            >
              <Link
                href={`/dashboard/programs/${program.id}`}
                className="grid grid-cols-12 gap-2 items-center py-3.5 px-2 hover:bg-slate-50 dark:hover:bg-neutral-800/40 rounded-lg transition-colors group"
              >
                {/* Program Name & Logo */}
                <div className="col-span-6 flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 ${
                      program.logoBgColor || "bg-blue-600"
                    }`}
                  >
                    {program.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-900 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {program.name}
                  </span>
                </div>

                {/* Status Badge */}
                <div className="col-span-3 flex justify-center">
                  {program.status === "Open" ? (
                    <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span>Open</span>
                    </Badge>
                  ) : (
                    <Badge className="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shadow-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span>Reviewing</span>
                    </Badge>
                  )}
                </div>

                {/* Reports Count & Link Icon */}
                <div className="col-span-3 flex items-center justify-end gap-1.5 text-sm font-semibold text-slate-900 dark:text-neutral-100">
                  <span>{program.reportCount}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
