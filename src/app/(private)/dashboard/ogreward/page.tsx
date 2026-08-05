"use client";

import React, { useState } from "react";
import {
  DollarSign,
  Clock,
  Award,
  CheckCircle2,
  Search,
  Download,
  ExternalLink,
  Plus,
} from "lucide-react";

// Types
type RewardTypeFilter = "all" | "bounties" | "points";
type StatusFilter = "ALL" | "PAID" | "PENDING";

interface OrganizationRewardItem {
  id: string;
  payoutId: string;
  researcherName: string;
  researcherEmail: string;
  reportTitle: string;
  reportId: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  reward: string;
  rewardType: "cash" | "points";
  status: "Paid" | "Pending";
  date: string;
}

const mockOrgPayouts: OrganizationRewardItem[] = [
  {
    id: "1",
    payoutId: "PAY-9001",
    researcherName: "Alex Rivera",
    researcherEmail: "alex.r@secnet.io",
    reportTitle: "Security Vulnerability Report #1 - Authorization Bypass",
    reportId: "REP-8000",
    severity: "CRITICAL",
    reward: "$2,500",
    rewardType: "cash",
    status: "Pending",
    date: "2026-03-10",
  },
  {
    id: "2",
    payoutId: "PAY-9002",
    researcherName: "Seng Songhuor",
    researcherEmail: "songhuor@researcher.com",
    reportTitle: "Security Vulnerability Report #2 - Stored XSS",
    reportId: "REP-8001",
    severity: "MEDIUM",
    reward: "+100 pts",
    rewardType: "points",
    status: "Paid",
    date: "2026-03-11",
  },
  {
    id: "3",
    payoutId: "PAY-9003",
    researcherName: "Elena Rostova",
    researcherEmail: "elena@bugbound.org",
    reportTitle: "Security Vulnerability Report #3 - Authorization Bypass",
    reportId: "REP-8002",
    severity: "MEDIUM",
    reward: "$750",
    rewardType: "cash",
    status: "Paid",
    date: "2026-03-12",
  },
  {
    id: "4",
    payoutId: "PAY-9004",
    researcherName: "David Kim",
    researcherEmail: "dkim@whitehat.kr",
    reportTitle: "Security Vulnerability Report #4 - Stored XSS",
    reportId: "REP-8003",
    severity: "HIGH",
    reward: "+200 pts",
    rewardType: "points",
    status: "Pending",
    date: "2026-03-13",
  },
];

export default function OrganizationRewardsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rewardFilter, setRewardFilter] = useState<RewardTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");

  // Filtering Logic
  const filteredPayouts = mockOrgPayouts.filter((item) => {
    // Search match
    const matchesSearch =
      item.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.researcherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.researcherEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reportId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.payoutId.toLowerCase().includes(searchQuery.toLowerCase());

    // Reward type match
    const matchesReward =
      rewardFilter === "all" ||
      (rewardFilter === "bounties" && item.rewardType === "cash") ||
      (rewardFilter === "points" && item.rewardType === "points");

    // Status match
    const matchesStatus =
      statusFilter === "ALL" ||
      item.status.toUpperCase() === statusFilter;

    return matchesSearch && matchesReward && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 text-slate-800 antialiased font-sans">
      <div className=" space-y-6">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-extrabold text-[#0f172a] tracking-tight">
              Rewards & Budget Management
            </h1>
            <p className="text-[14px] text-[#64748b] mt-0.5">
              Overview of organization bounty distributions, pending approvals, and researcher rewards.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 bg-white border border-[#e2e8f0] hover:bg-[#f8fafc] text-[#334155] text-[13px] font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer">
              <Download className="w-4 h-4 text-[#64748b]" />
              Export Payouts
            </button>
            <button className="inline-flex items-center gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl shadow-2xs transition-colors cursor-pointer">
              <Plus className="w-4 h-4" />
              Issue Reward
            </button>
          </div>
        </div>

        {/* STAT CARDS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* TOTAL DISBURSED */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center shrink-0">
              <DollarSign className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                TOTAL DISBURSED
              </div>
              <div className="text-[28px] font-black text-[#0f172a] tracking-tight leading-tight">
                $42,500
              </div>
            </div>
          </div>

          {/* PENDING APPROVALS */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#fffbe2] text-[#d97706] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                PENDING APPROVALS
              </div>
              <div className="text-[28px] font-black text-[#0f172a] tracking-tight leading-tight">
                $3,250
              </div>
            </div>
          </div>

          {/* TOTAL REPUTATION ISSUED */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                REPUTATION ISSUED
              </div>
              <div className="text-[28px] font-black text-[#0f172a] tracking-tight leading-tight flex items-baseline">
                3,400 <span className="text-[14px] font-normal text-[#64748b] ml-1.5">pts</span>
              </div>
            </div>
          </div>

          {/* TOTAL PAID REPORTS */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-center gap-4 shadow-2xs">
            <div className="w-12 h-12 rounded-xl bg-[#f0f2fe] text-[#4f46e5] flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                REWARDED REPORTS
              </div>
              <div className="text-[28px] font-black text-[#0f172a] tracking-tight leading-tight">
                142
              </div>
            </div>
          </div>

        </div>

        {/* SEARCH & FILTER CONTROLS BAR */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-3 shadow-2xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search by researcher, report title, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#f1f5f9] text-[13px] text-[#0f172a] placeholder-[#94a3b8] pl-9 pr-4 py-2.5 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 border-none transition-all"
            />
          </div>

          {/* Filter Pills Groups */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Reward Type Filter Pill */}
            <div className="bg-[#f1f5f9] p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setRewardFilter("all")}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  rewardFilter === "all"
                    ? "bg-white text-[#2563eb] font-bold shadow-2xs"
                    : "text-[#64748b] hover:text-[#0f172a] font-medium"
                }`}
              >
                All Rewards
              </button>
              <button
                onClick={() => setRewardFilter("bounties")}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  rewardFilter === "bounties"
                    ? "bg-white text-[#2563eb] font-bold shadow-2xs"
                    : "text-[#64748b] hover:text-[#0f172a] font-medium"
                }`}
              >
                Bounties ($)
              </button>
              <button
                onClick={() => setRewardFilter("points")}
                className={`text-[13px] px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  rewardFilter === "points"
                    ? "bg-white text-[#2563eb] font-bold shadow-2xs"
                    : "text-[#64748b] hover:text-[#0f172a] font-medium"
                }`}
              >
                Points
              </button>
            </div>

            {/* Status Filter Pill */}
            <div className="bg-[#f1f5f9] p-1 rounded-xl flex items-center gap-1">
              <button
                onClick={() => setStatusFilter("ALL")}
                className={`text-[12px] font-bold tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === "ALL"
                    ? "bg-white text-[#2563eb] shadow-2xs"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                ALL
              </button>
              <button
                onClick={() => setStatusFilter("PAID")}
                className={`text-[12px] font-bold tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === "PAID"
                    ? "bg-white text-[#2563eb] shadow-2xs"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                PAID
              </button>
              <button
                onClick={() => setStatusFilter("PENDING")}
                className={`text-[12px] font-bold tracking-wider px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  statusFilter === "PENDING"
                    ? "bg-white text-[#2563eb] shadow-2xs"
                    : "text-[#64748b] hover:text-[#0f172a]"
                }`}
              >
                PENDING
              </button>
            </div>

          </div>
        </div>

        {/* ORGANIZATION REWARDS TABLE */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#f1f5f9] bg-white text-[11px] font-bold text-[#94a3b8] uppercase tracking-wider">
                  <th className="py-4 px-6 min-w-[300px]">REPORT & VULNERABILITY</th>
                  <th className="py-4 px-6 min-w-[200px]">RECIPIENT (RESEARCHER)</th>
                  <th className="py-4 px-6 text-center">SEVERITY</th>
                  <th className="py-4 px-6 text-center">REWARD</th>
                  <th className="py-4 px-6 text-center">STATUS</th>
                  <th className="py-4 px-6 text-center">DATE</th>
                  <th className="py-4 px-6 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f8fafc]">
                {filteredPayouts.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-[#f8fafc]/80 transition-colors"
                  >
                    {/* Report Title & IDs */}
                    <td className="py-5 px-6">
                      <div className="text-[15px] font-bold text-[#0f172a] hover:text-[#2563eb] cursor-pointer transition-colors leading-snug">
                        {item.reportTitle}
                      </div>
                      <div className="text-[12px] text-[#94a3b8] font-mono mt-0.5">
                        {item.reportId} • {item.payoutId}
                      </div>
                    </td>

                    {/* Researcher Info */}
                    <td className="py-5 px-6">
                      <div className="text-[14px] font-bold text-[#0f172a]">
                        {item.researcherName}
                      </div>
                      <div className="text-[12px] text-[#94a3b8]">
                        {item.researcherEmail}
                      </div>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-5 px-6 text-center">
                      {item.severity === "CRITICAL" && (
                        <span className="inline-block bg-[#fff0f3] text-[#e11d48] text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border border-[#ffe4e6]">
                          CRITICAL
                        </span>
                      )}
                      {item.severity === "HIGH" && (
                        <span className="inline-block bg-[#fffbeb] text-[#d97706] text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border border-[#fef3c7]">
                          HIGH
                        </span>
                      )}
                      {item.severity === "MEDIUM" && (
                        <span className="inline-block bg-[#f0f9ff] text-[#0284c7] text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border border-[#e0f2fe]">
                          MEDIUM
                        </span>
                      )}
                      {item.severity === "LOW" && (
                        <span className="inline-block bg-[#f0fdf4] text-[#16a34a] text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-md border border-[#dcfce7]">
                          LOW
                        </span>
                      )}
                    </td>

                    {/* Reward Amount */}
                    <td className="py-5 px-6 text-center">
                      <span
                        className={`text-[16px] font-extrabold ${
                          item.rewardType === "points"
                            ? "text-[#10b981]"
                            : "text-[#0f172a]"
                        }`}
                      >
                        {item.reward}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-5 px-6 text-center">
                      {item.status === "Pending" ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#fffbe1] text-[#b45309] text-[12px] font-semibold px-2.5 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5 text-[#b45309]" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-[#ecfdf5] text-[#047857] text-[12px] font-semibold px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" />
                          Paid
                        </span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-5 px-6 text-center text-[13px] text-[#64748b] font-medium font-mono">
                      {item.date}
                    </td>

                    {/* Action */}
                    <td className="py-5 px-6 text-right">
                      <button className="text-[13px] font-medium text-[#475569] hover:text-[#0f172a] inline-flex items-center gap-1 transition-colors cursor-pointer">
                        View Details
                        <ExternalLink className="w-3.5 h-3.5 text-[#94a3b8]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}