"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  ArrowLeft,
  Eye,
  X,
  ShieldAlert,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Award,
  ChevronLeft,
  ChevronRight,
  Filter,
  DollarSign,
} from "lucide-react";

import { useGetReportsQuery, ReportItem } from "@/lib/redux/services/reportsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MyReportsPage() {
  const router = useRouter();

  // Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Open" | "Resolved">("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Selected report for modal detail preview
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // RTK Query data fetching
  const { data: reports = [], isLoading } = useGetReportsQuery({
    search: searchTerm,
    status: activeTab,
    severity: severityFilter,
  });

  const totalSubmissions = 12; // Total count across active programs
  const displayedCount = reports.length;

  const handleBack = () => {
    router.back();
  };

  const getSeverityBadge = (severity: ReportItem["severity"]) => {
    switch (severity) {
      case "CRITICAL":
        return (
          <Badge className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            CRITICAL
          </Badge>
        );
      case "HIGH":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            HIGH
          </Badge>
        );
      case "MEDIUM":
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            MEDIUM
          </Badge>
        );
      case "LOW":
        return (
          <Badge className="bg-slate-500 hover:bg-slate-600 text-white font-semibold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1.5 w-fit shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            LOW
          </Badge>
        );
    }
  };

  const getStatusBadge = (status: ReportItem["status"]) => {
    switch (status) {
      case "TRIAGING":
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Clock className="w-3 h-3 text-amber-600" />
            TRIAGING
          </Badge>
        );
      case "RESOLVED":
        return (
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-700 border-emerald-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            RESOLVED
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Award className="w-3 h-3 text-blue-600" />
            ACCEPTED
          </Badge>
        );
      case "SUBMITTED":
        return (
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-700 border-indigo-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <AlertCircle className="w-3 h-3 text-indigo-600" />
            SUBMITTED
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="outline" className="bg-rose-500/10 text-rose-700 border-rose-200 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <XCircle className="w-3 h-3 text-rose-600" />
            REJECTED
          </Badge>
        );
    }
  };

  const getBountyDisplay = (item: ReportItem) => {
    if (item.isBountyHighlight) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80 shadow-xs">
          <DollarSign className="w-3 h-3" />
          {item.bountyOrRep}
        </span>
      );
    }
    if (item.isBountyDim) {
      return <span className="text-xs font-medium text-slate-400 line-through">{item.bountyOrRep}</span>;
    }
    if (item.bountyOrRep === "Reputation") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
          <Award className="w-3 h-3" />
          Reputation
        </span>
      );
    }
    return <span className="text-xs font-semibold text-slate-700">{item.bountyOrRep}</span>;
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* Header Section */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">My Reports</h1>
          <p className="text-sm text-slate-500 font-medium">
            12 Active submissions across 5 programs
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleBack}
          className="self-start sm:self-auto cursor-pointer rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all gap-2 px-4 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </Button>
      </header>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by ID, program, or title..."
            className="pl-10 h-10 w-full rounded-xl border-slate-200 bg-slate-50/50 text-sm focus-visible:ring-2 focus-visible:ring-blue-600/30"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-slate-100/80 rounded-xl gap-1 border border-slate-200/50 w-full sm:w-auto">
            {(["All", "Open", "Resolved"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-initial relative px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer text-center ${
                  activeTab === tab
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Severity Select Dropdown */}
          <div className="relative w-full sm:w-auto">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="h-10 pl-3 pr-8 w-full sm:w-auto min-w-[130px] text-xs font-semibold bg-white border border-slate-200 rounded-xl text-slate-700 cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-blue-600/30 shadow-xs"
            >
              <option value="All">Severity: All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
            <Filter className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Data Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">REPORT ID</th>
                <th className="py-3.5 px-4 sm:px-6">VULNERABILITY & PROGRAM</th>
                <th className="py-3.5 px-4 sm:px-6">TYPE</th>
                <th className="py-3.5 px-4 sm:px-6">SEVERITY</th>
                <th className="py-3.5 px-4 sm:px-6">STATUS</th>
                <th className="py-3.5 px-4 sm:px-6">BOUNTY/REP</th>
                <th className="py-3.5 px-4 sm:px-6">LAST ACTIVITY</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    Loading reports...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 text-sm">
                    No reports match your filters.
                  </td>
                </tr>
              ) : (
                reports.map((report, idx) => (
                  <motion.tr
                    key={report.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="hover:bg-slate-50/70 transition-colors group"
                  >
                    {/* Report ID */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <Link
                        href={`/dashboard/my-reports/${report.id}`}
                        className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline decoration-2 underline-offset-2"
                      >
                        {report.reportId}
                      </Link>
                    </td>

                    {/* Vulnerability & Program */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold text-xs shrink-0 border border-blue-200">
                          <AvatarFallback className="bg-blue-100 text-blue-700 rounded-lg">
                            {report.avatarLetter}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <Link href={`/dashboard/my-reports/${report.id}`}>
                            <strong className="text-xs sm:text-sm font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors block">
                              {report.title}
                            </strong>
                          </Link>
                          <span className="text-xs text-slate-500 truncate">{report.program}</span>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <span className="text-xs font-medium text-slate-600">{report.type}</span>
                    </td>

                    {/* Severity */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {getSeverityBadge(report.severity)}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {getStatusBadge(report.status)}
                    </td>

                    {/* Bounty/Rep */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      {getBountyDisplay(report)}
                    </td>

                    {/* Last Activity */}
                    <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs text-slate-600 font-medium">{report.lastActivityDate}</span>
                        <span className="text-[10px] font-bold tracking-wide text-blue-600 uppercase">
                          {report.lastActivityBadge}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 sm:px-6 text-center whitespace-nowrap">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setSelectedReport(report)}
                        aria-label="View Report"
                        className="w-8 h-8 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-200/80 bg-slate-50/50">
          <span className="text-xs font-medium text-slate-500">
            Showing {displayedCount} of {totalSubmissions} submissions
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              size="icon"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 p-0 rounded-lg text-xs font-semibold cursor-pointer ${
                currentPage === 1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              1
            </Button>
            <Button
              size="sm"
              onClick={() => setCurrentPage(2)}
              className={`w-8 h-8 p-0 rounded-lg text-xs font-semibold cursor-pointer ${
                currentPage === 2
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
              }`}
            >
              2
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-8 h-8 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </footer>
      </div>

      {/* Report Quick View Modal */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4"
            >
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-blue-600">{selectedReport.reportId}</span>
                  <h3 className="text-lg font-bold text-slate-900">{selectedReport.title}</h3>
                  <p className="text-xs text-slate-500">{selectedReport.program}</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-full w-8 h-8 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400">Severity</span>
                  <div>{getSeverityBadge(selectedReport.severity)}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Status</span>
                  <div>{getStatusBadge(selectedReport.status)}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Type</span>
                  <p className="font-semibold text-slate-800">{selectedReport.type}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400">Bounty / Rep</span>
                  <div>{getBountyDisplay(selectedReport)}</div>
                </div>
                <div className="col-span-2 space-y-1">
                  <span className="text-slate-400">Last Activity</span>
                  <p className="font-semibold text-slate-800">
                    {selectedReport.lastActivityDate} — <span className="text-blue-600">{selectedReport.lastActivityBadge}</span>
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-xl text-xs"
                >
                  Close
                </Button>
                <Button
                  onClick={() => router.push(`/dashboard/my-reports/${selectedReport.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs cursor-pointer font-semibold"
                >
                  Full Details
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
