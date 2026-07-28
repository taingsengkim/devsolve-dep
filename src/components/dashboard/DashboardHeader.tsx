"use client";

import React from "react";
import Link from "next/link";
import { PlusCircle, Globe, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onRefresh,
  isRefreshing = false,
}) => {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Dashboard
        </h1>
        <p className="text-sm font-normal text-slate-500 dark:text-slate-400">
          Real-time intelligence and vulnerability operations
        </p>
      </div>

      <div className="flex items-center gap-3">
        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        )}

        <Link href="/dashboard/programs">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-lg cursor-pointer"
          >
            <Globe className="w-4 h-4 text-slate-500" />
            <span className="text-sm font-medium">Explore Programs</span>
          </Button>
        </Link>

        <Link href="/dashboard/my-reports">
          <Button
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs rounded-lg transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="text-sm font-medium">Submit Report</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};
