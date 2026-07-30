// src/app/marketplace/[id]/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { MOCK_PROGRAMSss } from "@/lib/types/programMockdata";
import { CheckCircle2, Bookmark, ArrowLeft, AlertTriangle, XCircle } from "lucide-react";

export default function ProgramDetailPage() {
  const params = useParams();
  const programId = params?.id as string;

  // Active tab state: 'overview' | 'scope' | 'matrix' | 'rules'
  const [activeTab, setActiveTab] = useState<"overview" | "scope" | "matrix" | "rules">("overview");

  // Find program by ID
  const program = MOCK_PROGRAMSss.find((p) => p.id === programId) || MOCK_PROGRAMSss[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Back Link */}
        <Link
          href="/programs"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-blue-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Programs</span>
        </Link>

        {/* Hero Card */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
          <div className="h-1.5 bg-indigo-500 w-full" />
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start space-x-4">
                <img
                  src={program.logoUrl || "/placeholder.png"}
                  alt={program.companyName}
                  className="h-14 w-14 rounded-xl object-contain border border-slate-100 p-1 bg-white"
                />
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-slate-700 text-sm">{program.companyName}</span>
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      • {program.status}
                    </span>
                    <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-bold text-purple-700">
                      {program.type}
                    </span>
                  </div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                    {program.title}
                  </h1>
                  <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
                    {program.description}
                  </p>

                  {/* Asset Categories */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {program.assetCategories.map((cat, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-700"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button className="flex items-center space-x-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors self-start md:self-auto">
                <Bookmark className="h-4 w-4" />
                <span>Save</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-100 pt-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Max Reward</p>
                <p className="text-lg font-bold text-slate-900">{program.rewardRange}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Submissions</p>
                <p className="text-lg font-bold text-slate-900">{program.stats?.reportsSubmitted ?? 142}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Researchers</p>
                <p className="text-lg font-bold text-slate-900">{program.activeResearchers ?? 89}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Closes</p>
                <p className="text-lg font-bold text-slate-900">{program.endDate ?? "Aug 31, 2026"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Main Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Tab Controls & Content */}
          <div className="lg:col-span-2">
            {/* Tabs Header */}
            <div className="border-b border-slate-200 mb-6 flex space-x-6 text-xs font-medium text-slate-500">
              <button
                onClick={() => setActiveTab("overview")}
                className={`pb-3 transition-all ${
                  activeTab === "overview"
                    ? "border-b-2 border-blue-600 font-bold text-blue-600"
                    : "hover:text-slate-800"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("scope")}
                className={`pb-3 transition-all ${
                  activeTab === "scope"
                    ? "border-b-2 border-blue-600 font-bold text-blue-600"
                    : "hover:text-slate-800"
                }`}
              >
                Scope
              </button>
              <button
                onClick={() => setActiveTab("matrix")}
                className={`pb-3 transition-all ${
                  activeTab === "matrix"
                    ? "border-b-2 border-blue-600 font-bold text-blue-600"
                    : "hover:text-slate-800"
                }`}
              >
                Bounty Matrix
              </button>
              <button
                onClick={() => setActiveTab("rules")}
                className={`pb-3 transition-all ${
                  activeTab === "rules"
                    ? "border-b-2 border-blue-600 font-bold text-blue-600"
                    : "hover:text-slate-800"
                }`}
              >
                Rules & Exclusions
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">About the Program</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Test our core web applications, API gateways, and cloud infrastructure for security vulnerabilities. {program.description}
                  </p>
                </div>

                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Proof of Concept Requirements</h3>
                  <p className="text-xs text-slate-500 mb-3">Each report must include the following to be considered valid:</p>
                  <ul className="space-y-2.5">
                    {[
                      "Step-by-step reproduction guide",
                      "Exact HTTP request/payload (use Burp Suite export)",
                      "Screenshot or screen recording demonstrating impact",
                      "Affected endpoint and parameter names",
                    ].map((req, i) => (
                      <li key={i} className="flex items-center space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* TAB 2: SCOPE */}
            {activeTab === "scope" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">In-Scope Targets</h3>
                  <p className="text-xs text-slate-500 mb-3">You are authorized to test these assets only.</p>
                  <div className="space-y-2">
                    {program.inScopeAssets.map((asset, i) => (
                      <div
                        key={i}
                        className="flex items-center space-x-2 rounded-xl border border-emerald-200 bg-emerald-50/60 p-3 text-xs font-mono font-semibold text-emerald-800"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>{asset}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Out-of-Scope Targets</h3>
                  <p className="text-xs text-slate-500 mb-3">Do not test these assets under any circumstances.</p>
                  <div className="space-y-2">
                    {["cdn.example.com", "status.example.com", "Third-party integrations", "Production customer databases"].map(
                      (asset, i) => (
                        <div
                          key={i}
                          className="flex items-center space-x-2 rounded-xl border border-rose-200 bg-rose-50/60 p-3 text-xs font-mono font-semibold text-rose-800"
                        >
                          <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                          <span>{asset}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: BOUNTY MATRIX */}
            {activeTab === "matrix" && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Bounty Matrix</h3>
                <p className="text-xs text-slate-500 mb-4">
                  Payouts are determined by confirmed severity. Final amounts are at the company s discretion.
                </p>

                {[
                  { level: "Critical", range: "$5,000 – $10,000", border: "bg-rose-500", bg: "bg-rose-50/50", text: "text-rose-700" },
                  { level: "High", range: "$1,500 – $5,000", border: "bg-amber-500", bg: "bg-amber-50/50", text: "text-amber-700" },
                  { level: "Medium", range: "$300 – $1,500", border: "bg-yellow-500", bg: "bg-yellow-50/50", text: "text-yellow-700" },
                  { level: "Low", range: "$50 – $300", border: "bg-emerald-500", bg: "bg-emerald-50/50", text: "text-emerald-700" },
                ].map((tier, i) => (
                  <div
                    key={i}
                    className={`flex items-center justify-between rounded-xl border border-slate-200 ${tier.bg} p-4 shadow-xs`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`h-8 w-1.5 rounded-full ${tier.border}`} />
                      <span className={`text-xs font-bold ${tier.text}`}>{tier.level}</span>
                    </div>
                    <span className={`text-xs font-extrabold ${tier.text}`}>{tier.range}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 4: RULES & EXCLUSIONS */}
            {activeTab === "rules" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Rules of Engagement</h3>
                  <ol className="space-y-2 text-xs text-slate-700 list-decimal list-inside leading-relaxed">
                    <li>Automated scanning allowed up to 5 req/sec.</li>
                    <li>Do not access, modify, or delete customer data.</li>
                    <li>Do not perform DoS or DDoS attacks.</li>
                    <li>Do not engage in social engineering against employees.</li>
                    <li>Test only assets listed in scope.</li>
                    <li>Submit one vulnerability per report.</li>
                  </ol>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-center space-x-2 text-amber-800 text-xs font-bold mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    <span>Exclusions Notice</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Reports covering Self-XSS without impact, missing security headers, or rate limiting on non-sensitive endpoints will be rejected without bounty.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Timeline Widget */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-xs font-bold text-slate-900 mb-3">Program Timeline</h4>
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Start Date</span>
                  <span className="font-semibold text-slate-700">June 1, 2026</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">End Date</span>
                  <span className="font-semibold text-slate-700">Aug 31, 2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    • Open
                  </span>
                </div>
              </div>
            </div>

            {/* Submit Report Box */}
            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5">
              <h4 className="text-xs font-bold text-slate-900 mb-1">Ready to start?</h4>
              <p className="text-[11px] text-slate-500 mb-4">Read the scope and rules carefully before testing.</p>
              <button className="w-full rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors">
                Submit a Report
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}