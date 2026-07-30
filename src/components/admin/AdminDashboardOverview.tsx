"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Building2,
  Globe,
  FileText,
  Users,
  MessageSquare,
  Swords,
  ChevronDown,
  RefreshCw,
  Clock,
  ChevronRight,
  ShieldAlert,
  FileCheck,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetAdminOverviewQuery } from "@/lib/redux/services/adminApi";

interface AdminDashboardOverviewProps {
  onSwitchToCompanyView?: () => void;
}

export function AdminDashboardOverview({ onSwitchToCompanyView }: AdminDashboardOverviewProps) {
  const { data: adminData, isLoading, isFetching, refetch } = useGetAdminOverviewQuery();
  const [timeRange, setTimeRange] = useState("7 months");

  if (isLoading || !adminData) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-16 bg-slate-200/60 dark:bg-slate-800 rounded-xl" />
        <div className="h-32 bg-slate-200/60 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-slate-200/60 dark:bg-slate-800 rounded-2xl" />
          <div className="lg:col-span-4 h-96 bg-slate-200/60 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  // Calculate SVG arc paths for donut chart
  const breakdown = adminData.reportStatusBreakdown;
  const total = breakdown.total;
  const radius = 65;
  const strokeWidth = 14;
  const center = 80;
  const circumference = 2 * Math.PI * radius;

  const items = [
    { label: "Confirmed", count: breakdown.confirmed, color: "#10b981", barBg: "bg-emerald-500" },
    { label: "Pending", count: breakdown.pending, color: "#f59e0b", barBg: "bg-amber-500" },
    { label: "Rejected", count: breakdown.rejected, color: "#ef4444", barBg: "bg-rose-500" },
    { label: "In Review", count: breakdown.inReview, color: "#3b82f6", barBg: "bg-blue-500" },
  ];

  let accumulatedPercent = 0;
  const arcs = items.map((item) => {
    const percent = item.count / total;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;
    return { ...item, strokeDasharray, strokeDashoffset };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Top Controls & Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Operations
          </h1>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
            className="h-10 px-3.5 rounded-xl border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold cursor-pointer shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Single Layout Container for All 6 Compact Stat Metrics */}
      <Card className="rounded-[20px] border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
          {adminData.stats.map((stat, idx) => (
            <div
              key={stat.id}
              className={`flex flex-col justify-between ${
                idx > 0 ? "sm:pl-4 lg:pl-6" : ""
              } ${idx >= 2 ? "pt-4 sm:pt-0" : ""}`}
            >
              <div>
                <div className="w-8 h-8 rounded-lg bg-indigo-50/80 flex items-center justify-center text-indigo-600 mb-2.5">
                  {stat.type === "organizations" && <Building2 className="w-4 h-4 text-indigo-600" />}
                  {stat.type === "programs" && <Globe className="w-4 h-4 text-indigo-600" />}
                  {stat.type === "total_reports" && <FileText className="w-4 h-4 text-indigo-600" />}
                  {stat.type === "users" && <Users className="w-4 h-4 text-indigo-600" />}
                  {stat.type === "community_posts" && <MessageSquare className="w-4 h-4 text-indigo-600" />}
                  {stat.type === "disputes" && <Swords className="w-4 h-4 text-indigo-600" />}
                </div>

                <div className="text-2xl font-extrabold tracking-tight text-slate-900">
                  {stat.value}
                </div>

                <div className="text-xs font-semibold text-slate-500 mt-0.5">
                  {stat.title}
                </div>
              </div>

              <div className="text-[11px] text-slate-400 font-normal mt-1">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Charts Section: Platform Activity (Left) + Report Status Donut (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Platform Activity Chart Card */}
        <Card className="lg:col-span-8 rounded-[20px] border border-slate-200/70 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Platform Activity</h3>
                <p className="text-sm text-slate-400 mt-0.5">Reports, disputes & community posts — last 7 months</p>
              </div>

              <div className="relative">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 rounded-xl border-slate-200 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
                >
                  {timeRange}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </Button>
              </div>
            </div>

            {/* SVG Line & Area Chart */}
            <div className="mt-6 relative w-full h-[220px]">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0, 45, 90, 135, 180].map((y, idx) => (
                  <line
                    key={idx}
                    x1="40"
                    y1={y}
                    x2="680"
                    y2={y}
                    stroke="#f1f5f9"
                    strokeDasharray="4 4"
                    strokeWidth="1"
                  />
                ))}

                {/* Y-Axis Labels */}
                <text x="0" y="10" className="text-[11px] fill-slate-400 font-medium">120</text>
                <text x="5" y="55" className="text-[11px] fill-slate-400 font-medium">90</text>
                <text x="5" y="100" className="text-[11px] fill-slate-400 font-medium">60</text>
                <text x="5" y="145" className="text-[11px] fill-slate-400 font-medium">30</text>
                <text x="12" y="185" className="text-[11px] fill-slate-400 font-medium">0</text>

                {/* Area under curve */}
                <path
                  d="M 40,140 C 130,100 220,130 310,90 C 400,60 490,50 580,35 C 630,25 660,20 680,18 L 680,180 L 40,180 Z"
                  fill="url(#areaGradient)"
                />

                {/* Reports Line (Blue) */}
                <path
                  d="M 40,140 C 130,100 220,130 310,90 C 400,60 490,50 580,35 C 630,25 660,20 680,18"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Community Posts Line (Green) */}
                <path
                  d="M 40,142 C 130,101 220,129 310,89 C 400,59 490,49 580,34 C 630,24 660,19 680,17"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Disputes Line (Amber dashed) */}
                <path
                  d="M 40,144 C 130,102 220,128 310,88 C 400,58 490,48 580,33 C 630,23 660,18 680,16"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                />

                {/* X-Axis Month Labels */}
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, idx) => (
                  <text
                    key={month}
                    x={40 + idx * 105}
                    y="198"
                    className="text-[11px] fill-slate-400 font-medium text-anchor-middle"
                  >
                    {month}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          {/* Chart Legend */}
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500 rounded-full" />
              <span>Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-emerald-500 rounded-full" />
              <span>Community Posts</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-0.5 border-b-2 border-dashed border-amber-500" />
              <span>Disputes</span>
            </div>
          </div>
        </Card>

        {/* Right: Report Status Donut & Breakdown */}
        <Card className="lg:col-span-4 rounded-[20px] border border-slate-200/70 bg-white p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Report Status</h3>
            <p className="text-sm text-slate-400 mt-0.5">All-time breakdown</p>

            {/* Donut Graphic */}
            <div className="my-6 flex items-center justify-center relative">
              <svg width="160" height="160" viewBox="0 0 160 160" className="transform -rotate-90">
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  stroke="#f1f5f9"
                  strokeWidth={strokeWidth}
                />
                {arcs.map((arc, index) => (
                  <circle
                    key={index}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={arc.color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={arc.strokeDasharray}
                    strokeDashoffset={arc.strokeDashoffset}
                    strokeLinecap="butt"
                  />
                ))}
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">{total}</span>
                <span className="text-xs text-slate-400 font-medium mt-0.5">total</span>
              </div>
            </div>

            {/* Status Breakdown Legend & Progress Bars */}
            <div className="space-y-3">
              {arcs.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 w-24 shrink-0">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-semibold text-slate-600">{item.label}</span>
                  </div>

                  {/* Progress bar line */}
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.barBg}`}
                      style={{ width: `${(item.count / total) * 100}%` }}
                    />
                  </div>

                  <span className="font-bold text-slate-900 w-8 text-right shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Admin Action Queue & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Admin Action Queue */}
        <Card className="lg:col-span-7 rounded-[20px] border border-slate-200/70 bg-white shadow-2xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-500" />
                  Admin Action Queue
                </CardTitle>
                <CardDescription className="text-sm text-slate-500 mt-0.5">
                  Tasks requiring platform administrator approval or review
                </CardDescription>
              </div>
              <Badge className="bg-amber-100 text-amber-800 border-amber-200 rounded-full px-2.5 py-0.5 text-xs font-semibold">
                {adminData.actionQueue.totalCount} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {adminData.actionQueue.items.map((item) => (
              <Link key={item.id} href={item.linkHref} className="block">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/40 transition group cursor-pointer">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        item.status === "urgent"
                          ? "bg-rose-50 text-rose-600 border border-rose-200/60"
                          : item.status === "pending"
                          ? "bg-amber-50 text-amber-600 border border-amber-200/60"
                          : "bg-blue-50 text-blue-600 border border-blue-200/60"
                      }`}
                    >
                      {item.type === "verification" && <Building2 className="w-5 h-5" />}
                      {item.type === "report_confirmation" && <FileCheck className="w-5 h-5" />}
                      {item.type === "moderation" && <ShieldAlert className="w-5 h-5" />}
                      {item.type === "user_review" && <Users className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        item.status === "urgent"
                          ? "bg-rose-600 text-white"
                          : item.status === "pending"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {item.count} items
                    </Badge>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>

        {/* Quick Admin Modules */}
        <Card className="lg:col-span-5 rounded-[20px] border border-slate-200/70 bg-white p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Quick Admin Modules</h3>
            <p className="text-xs text-slate-500 mb-4">Direct access to administrative platform suites</p>

            <div className="space-y-2.5">
              <Link href="/dashboard/company-verification" className="block">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Company Verifications</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
              </Link>

              <Link href="/dashboard/report-confirmation" className="block">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Report Confirmation</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
              </Link>

              <Link href="/dashboard/users" className="block">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">User Management</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
              </Link>

              <Link href="/dashboard/community-moderation" className="block">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/60 transition group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600">Community Moderation</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                </div>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </motion.div>
  );
}
