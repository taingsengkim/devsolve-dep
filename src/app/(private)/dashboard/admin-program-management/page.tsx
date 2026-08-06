"use client";

import { motion } from "motion/react";
import { Building2 } from "lucide-react";

export default function AdminProgramManagementPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-blue-600" />
            <span>Program Management</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and oversee all security bug bounty programs.
          </p>
        </div>
      </header>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xs">
        <p className="text-slate-600 font-medium">
          Program Management dashboard module under construction.
        </p>
      </div>
    </motion.div>
  );
}
