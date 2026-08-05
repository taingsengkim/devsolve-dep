"use client";

import React, { useState, useMemo } from "react";
import { motion } from "motion/react";
import {
  DollarSign,
  Award,
  CheckCircle2,
  Clock,
  Search,
  ExternalLink,
  ShieldCheck,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProgramPagination } from "@/components/programs/ProgramPagination";

export interface UserRewardItem {
  id: string;
  programName: string;
  programLogo?: string;
  reportId: string;
  reportTitle: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";
  rewardType: "BOUNTY" | "POINTS";
  amount: number;
  status: "PAID" | "PENDING" | "PROCESSING";
  awardedAt: string;
  transactionRef?: string;
}

const MOCK_REWARDS: UserRewardItem[] = Array.from({ length: 28 }, (_, index) => {
  const isBounty = index % 2 === 0;
  const isPaid = index % 3 !== 0;
  return {
    id: `rw-${101 + index}`,
    programName: index % 2 === 0 ? "CyberShield Inc." : "Spotify Audio Security Program",
    reportId: `REP-${8000 + index}`,
    reportTitle: `Security Vulnerability Report #${index + 1} - ${isBounty ? "Authorization Bypass" : "Stored XSS"}`,
    severity: index % 4 === 0 ? "CRITICAL" : index % 3 === 0 ? "HIGH" : "MEDIUM",
    rewardType: isBounty ? "BOUNTY" : "POINTS",
    amount: isBounty ? (index + 1) * 250 : (index + 1) * 50,
    status: isPaid ? "PAID" : "PENDING",
    awardedAt: `2026-03-${10 + (index % 18)}`,
  };
});

export default function RewardsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "PENDING">("ALL");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "BOUNTY" | "POINTS">("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const stats = useMemo(() => {
    let totalCash = 0;
    let totalPoints = 0;
    let pendingCash = 0;
    let paidCount = 0;

    MOCK_REWARDS.forEach((item) => {
      if (item.rewardType === "BOUNTY") {
        if (item.status === "PAID") {
          totalCash += item.amount;
          paidCount++;
        } else if (item.status === "PENDING" || item.status === "PROCESSING") {
          pendingCash += item.amount;
        }
      } else if (item.rewardType === "POINTS") {
        if (item.status === "PAID") {
          totalPoints += item.amount;
          paidCount++;
        }
      }
    });

    return { totalCash, totalPoints, pendingCash, paidCount };
  }, []);

  const filteredRewards = useMemo(() => {
    return MOCK_REWARDS.filter((item) => {
      if (searchTerm.trim() !== "") {
        const query = searchTerm.toLowerCase();
        const matchesProgram = item.programName.toLowerCase().includes(query);
        const matchesReport = item.reportTitle.toLowerCase().includes(query);
        const matchesId = item.reportId.toLowerCase().includes(query);
        if (!matchesProgram && !matchesReport && !matchesId) return false;
      }

      if (statusFilter !== "ALL" && item.status !== statusFilter) {
        return false;
      }

      if (typeFilter !== "ALL" && item.rewardType !== typeFilter) {
        return false;
      }

      return true;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const totalCount = filteredRewards.length;
  const totalPages = Math.ceil(totalCount / rowsPerPage) || 1;

  const paginatedRewards = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredRewards.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredRewards, currentPage, rowsPerPage]);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-rose-50 text-rose-600 border-rose-200";
      case "HIGH":
        return "bg-amber-50 text-amber-600 border-amber-200";
      case "MEDIUM":
        return "bg-sky-50 text-sky-600 border-sky-200";
      case "LOW":
        return "bg-slate-100 text-slate-700 border-slate-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="min-h-screen  w-full text-slate-800 font-sans py-6 antialiased">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-6  w-full"
      >
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Rewards & Earnings History
            </h1>
            <p className="text-base text-slate-500 mt-1 font-normal">
              Track your earnings, bounties awarded, and reputation points earned from accepted security reports.
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-slate-200 text-slate-700 font-semibold text-sm gap-2 self-start sm:self-auto hover:bg-slate-50 h-11 px-5"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export Statement
          </Button>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Total Earned
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                ${stats.totalCash.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Pending Payouts
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                ${stats.pendingCash.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Total Reputation
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                {stats.totalPoints} <span className="text-sm font-semibold text-slate-500">pts</span>
              </h3>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                totals Reports
              </p>
              <h3 className="text-3xl font-extrabold text-slate-900 mt-0.5 tracking-tight">
                {stats.paidCount}
              </h3>
            </div>
          </div>
        </div>

        {/* FILTERS & SEARCH BAR */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by program, report title, or ID..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-11 rounded-xl border-slate-200 text-base focus-visible:ring-blue-500 placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              <div className="bg-slate-100 p-1 rounded-xl flex items-center shrink-0">
                {(["ALL", "BOUNTY", "POINTS"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTypeFilter(t);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      typeFilter === t
                        ? "bg-white text-blue-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t === "ALL" ? "All Rewards" : t === "BOUNTY" ? "Bounties ($)" : "Points"}
                  </button>
                ))}
              </div>

              <div className="bg-slate-100 p-1 rounded-xl flex items-center shrink-0">
                {(["ALL", "PAID", "PENDING"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(s);
                      setCurrentPage(1);
                    }}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                      statusFilter === s
                        ? "bg-white text-blue-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* REWARDS HISTORY TABLE */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {paginatedRewards.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-lg font-semibold text-slate-800">No reward history found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                No rewards match your selected search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-bold uppercase text-slate-400 tracking-wider">
                    <th className="py-4 px-6">Program & Report</th>
                    <th className="py-4 px-4">Severity</th>
                    <th className="py-4 px-4">Reward</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedRewards.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Program & Report Title */}
                      <td className="py-5 px-6">
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                            {item.programName}
                          </span>
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {item.reportTitle}
                          </h4>
                          <span className="text-sm text-slate-400 font-mono">
                            ID: {item.reportId}
                          </span>
                        </div>
                      </td>

                      {/* Severity Badge */}
                      <td className="py-5 px-4 align-top sm:align-middle">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-bold rounded-md border ${getSeverityBadge(
                            item.severity
                          )}`}
                        >
                          {item.severity}
                        </span>
                      </td>

                      {/* Reward Amount */}
                      <td className="py-5 px-4 align-top sm:align-middle">
                        {item.rewardType === "BOUNTY" ? (
                          <div className="font-extrabold text-slate-900 text-xl">
                            ${item.amount.toLocaleString()}
                          </div>
                        ) : (
                          <div className="font-extrabold text-emerald-600 text-xl">
                            +{item.amount} pts
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-5 px-4 align-top sm:align-middle">
                        {item.status === "PAID" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700">
                            <Clock className="w-3.5 h-3.5" />
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-5 px-4 text-sm font-medium text-slate-500 align-top sm:align-middle">
                        {item.awardedAt}
                      </td>

                      {/* Action Link */}
                      <td className="py-5 px-6 text-right align-top sm:align-middle">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 font-semibold text-sm"
                        >
                          View Report
                          <ExternalLink className="w-4 h-4 ml-1.5 text-slate-400 group-hover:text-blue-600" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PAGINATION CONTROL */}
        <ProgramPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalCount={totalCount}
          displayedCount={paginatedRewards.length}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(rows: number) => {
            setRowsPerPage(rows);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
        />
      </motion.div>
    </div>
  );
}