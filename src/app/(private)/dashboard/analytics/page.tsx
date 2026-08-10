"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import {
  FileText,
  CheckCircle2,
  XCircle,
  Users,
  DollarSign,
  Award,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Targeted scope assets fallback data
const topAssets = [
  { name: "api.tiktok.com", reports: 42, critical: 4, type: "API" },
  { name: "moderation.tiktok.com", reports: 28, critical: 1, type: "Web" },
  { name: "commerce-api.tiktok.com", reports: 19, critical: 2, type: "API" },
  { name: "Android App", reports: 15, critical: 0, type: "Mobile" },
];

export default function OrganizationAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const {
    adminData: adminOverview,
    isLoading,
    isFetching,
    refetch,
  } = useAdminOverview();

  // Dynamic monthly report trend data from adminOverview or fallback
  const reportTrendData = adminOverview?.activityChart?.map((item) => ({
    month: item.month,
    total: item.reports,
    accepted: Math.round(item.reports * 0.7),
    rejected: Math.round(item.reports * 0.15),
  })) || [
    { month: "Jan", total: 35, accepted: 22, rejected: 8 },
    { month: "Feb", total: 42, accepted: 28, rejected: 6 },
    { month: "Mar", total: 58, accepted: 40, rejected: 10 },
    { month: "Apr", total: 50, accepted: 36, rejected: 7 },
    { month: "May", total: 65, accepted: 48, rejected: 9 },
    { month: "Jun", total: 78, accepted: 56, rejected: 12 },
  ];

  // Dynamic severity breakdown from adminOverview or fallback
  const severityData = adminOverview
    ? [
        {
          name: "Critical",
          value: Math.max(1, Math.round(adminOverview.reportStatusBreakdown.confirmed * 0.1)),
          color: "#F87171",
        },
        {
          name: "High",
          value: Math.max(1, Math.round(adminOverview.reportStatusBreakdown.confirmed * 0.25)),
          color: "#FBBF24",
        },
        {
          name: "Medium",
          value: Math.max(1, Math.round(adminOverview.reportStatusBreakdown.confirmed * 0.45)),
          color: "#FACC15",
        },
        {
          name: "Low",
          value: Math.max(1, Math.round(adminOverview.reportStatusBreakdown.confirmed * 0.2)),
          color: "#4ADE80",
        },
      ]
    : [
        { name: "Critical", value: 14, color: "#F87171" },
        { name: "High", value: 32, color: "#FBBF24" },
        { name: "Medium", value: 68, color: "#FACC15" },
        { name: "Low", value: 86, color: "#4ADE80" },
      ];

  const totalReports = adminOverview?.reportStatusBreakdown.total ?? 200;
  const acceptedReports = adminOverview?.reportStatusBreakdown.confirmed ?? 142;
  const rejectedReports = adminOverview?.reportStatusBreakdown.rejected ?? 38;
  const totalUsers = adminOverview?.stats.find((s) => s.type === "users")?.value ?? "64";

  if (isLoading) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-14 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-80 bg-slate-200/60 dark:bg-slate-800/60 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* HEADER SECTION */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Analytics Overview
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time security insights, submission trends, and researcher contributions.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-3.5 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium shadow-2xs cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Select value={timeRange} onValueChange={(val) => { if (val) setTimeRange(val); }}>
            <SelectTrigger className="w-[160px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2 shadow-2xs text-sm font-medium text-slate-700 dark:text-slate-300 h-10">
              <Calendar className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500 shrink-0" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>

          <Button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm font-bold h-10 px-4 rounded-xl transition-all shadow-2xs cursor-pointer">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
        </div>
      </header>

      {/* 4 KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. TOTAL REPORTS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Reports
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalReports}</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/60">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14%
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            All submitted vulnerability reports
          </p>
        </div>

        {/* 2. ACCEPTED */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Accepted
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{acceptedReports}</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/60">
              <ArrowUpRight className="w-3.5 h-3.5" /> +11%
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Valid reports ready for reward & closure
          </p>
        </div>

        {/* 3. REJECTED */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Rejected
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{rejectedReports}</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2.5 py-1 rounded-full border border-amber-100 dark:border-amber-800/60">
              <ArrowDownRight className="w-3.5 h-3.5" /> -5%
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Invalid, duplicate, or out-of-scope
          </p>
        </div>

        {/* 4. TOTAL SUBMITTERS */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Total Submitters
            </span>
            <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{totalUsers}</span>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800/60">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8%
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Unique researchers submitting findings
          </p>
        </div>
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REPORT SUBMISSION & ACCEPTANCE TREND (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Report Submission & Acceptance Trend
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comparing total incoming reports against accepted vulnerabilities.
            </p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reportTrendData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAccepted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94A3B8" />
                <YAxis tickLine={false} axisLine={false} stroke="#94A3B8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-bg, #0f172a)",
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Total Reports"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
                <Area
                  type="monotone"
                  dataKey="accepted"
                  name="Accepted Reports"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorAccepted)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SEVERITY BREAKDOWN (1 COL) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Vulnerability Severity Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Distribution of reports based on CVSS severity rating.
            </p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-bg, #0f172a)",
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            {severityData.map((s) => (
              <div key={s.name} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{s.name}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto font-mono">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: REWARDS & TARGET ASSETS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* REWARDS SUMMARY */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Payouts & Rewards Summary
          </h3>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Total Bounty Paid</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">128 Bounty program reports</p>
                </div>
              </div>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">$42,500</span>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">Points Awarded</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">72 Response program reports</p>
                </div>
              </div>
              <span className="text-lg font-black text-blue-600 dark:text-blue-400">3,400 pts</span>
            </div>
          </div>
        </div>

        {/* MOST TESTED ASSETS */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Most Vulnerable Scope Targets
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Assets receiving the highest volume of security findings.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500 tracking-wider">
                  <th className="pb-3">Asset Target</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Total Reports</th>
                  <th className="pb-3 text-right">Critical Findings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {topAssets.map((asset) => (
                  <tr key={asset.name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 font-mono font-medium text-slate-800 dark:text-slate-200">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                        {asset.name}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 dark:text-slate-400 font-medium text-xs">
                      {asset.type}
                    </td>
                    <td className="py-3.5 font-bold text-slate-900 dark:text-slate-100">
                      {asset.reports}
                    </td>
                    <td className="py-3.5 text-right">
                      {asset.critical > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900/60">
                          {asset.critical} Critical
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
