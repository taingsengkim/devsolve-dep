"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CreateProgramHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 dark:text-slate-400">
          <Link
            href="/dashboard/program-management"
            className="flex items-center gap-1 transition-colors hover:text-slate-900 dark:hover:text-slate-100"
          >
            <ArrowLeft className="size-3.5" />
            Program Management
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Create New Program
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Create New Program
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Configure and launch a new security bug bounty or vulnerability disclosure program for your organization.
        </p>
      </div>
    </header>
  );
}
