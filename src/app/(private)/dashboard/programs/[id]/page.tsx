"use client";

import React, { useState, use } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldCheck,
  FileCheck2,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useGetProgramByIdQuery } from "@/lib/redux/services/programsApi";
import { ProgramDetailHero } from "@/components/programs/ProgramDetailHero";
import { ProgramDetailSidebar } from "@/components/programs/ProgramDetailSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "scope", label: "Scope" },
  { id: "bounty-matrix", label: "Bounty Matrix" },
  { id: "rules", label: "Rules & Exclusions" },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const programId = resolvedParams.id;
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { data: program, isLoading, isError } = useGetProgramByIdQuery(programId);

  if (isLoading) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-4 w-32 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl" />
          <div className="h-96 bg-slate-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-4 my-8">
        <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Program Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">
            The program you are looking for does not exist or has been removed.
          </p>
        </div>
        <Button onClick={() => window.history.back()} variant="outline" className="rounded-xl font-semibold">
          Back to Programs
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-8 w-full pb-12"
    >
      {/* Hero / Header Section */}
      <ProgramDetailHero program={program} />

      {/* Program Navigation Tabs */}
      <nav className="border-b border-slate-200 bg-white rounded-xl px-2 pt-2 shadow-2xs">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-3 text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "text-blue-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeProgramTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                      transition={{ type: "spring", stiffness: 400, damping: 35 }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Main Grid Section (2 Columns: Main Content + Sidebar) */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Tab Content */}
        <section className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8"
              >
                {/* About the Program */}
                <div className="space-y-3">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-blue-600" />
                    About the Program
                  </h2>
                  <p className="text-base font-bold text-slate-900 leading-relaxed">
                    Test our cloud infrastructure, API gateways, and core web services for vulnerabilities.
                  </p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {program.aboutSummary || program.description}
                  </p>
                </div>

                <hr className="border-slate-100" />

                {/* Proof of Concept Requirements */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    Proof of Concept Requirements
                  </h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Each report must include the following to be considered valid:
                  </p>
                  <ul className="space-y-2.5">
                    {(program.pocRequirements || [
                      "Step-by-step reproduction guide",
                      "Exact HTTP request/payload (use Burp Suite export)",
                      "Screenshot or screen recording demonstrating impact",
                      "Affected endpoint and parameter names",
                    ]).map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === "scope" && (
              <motion.div
                key="scope"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900">
                    In-Scope Targets & Assets
                  </h2>
                  <p className="text-sm text-slate-500">
                    Only vulnerabilities discovered in targets listed below are eligible for rewards.
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                        <th className="py-3.5 px-4">TARGET ASSET</th>
                        <th className="py-3.5 px-4">TYPE</th>
                        <th className="py-3.5 px-4">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {program.inScopeAssets.map((asset, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                            {asset}
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant="secondary" className="text-xs">
                              {asset.includes("App")
                                ? "Mobile"
                                : asset.includes("api")
                                ? "API"
                                : "Web"}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              In-Scope
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === "bounty-matrix" && (
              <motion.div
                key="bounty-matrix"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Bounty Reward Matrix
                  </h2>
                  <p className="text-sm text-slate-500">
                    Bounties are awarded based on CVSS severity rating and business impact.
                  </p>
                </div>

                <div className="space-y-3">
                  {(program.bountyMatrix || [
                    { severity: "CRITICAL", range: "$5,000 - $10,000", description: "Remote Code Execution (RCE), Authentication Bypass, Full Database Leak" },
                    { severity: "HIGH", range: "$2,000 - $5,000", description: "Stored XSS, Account Takeover, Privilege Escalation, Broken Access Control" },
                    { severity: "MEDIUM", range: "$500 - $2,000", description: "CSRF on critical actions, IDOR, Server-Side Request Forgery (SSRF)" },
                    { severity: "LOW", range: "$100 - $500", description: "Reflected XSS, Open Redirect, Sensitive Information Disclosure" },
                  ]).map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                              item.severity === "CRITICAL"
                                ? "bg-red-600 text-white"
                                : item.severity === "HIGH"
                                ? "bg-orange-500 text-white"
                                : item.severity === "MEDIUM"
                                ? "bg-amber-500 text-white"
                                : "bg-slate-600 text-white"
                            }`}
                          >
                            {item.severity}
                          </span>
                          <span className="text-sm font-semibold text-slate-900">
                            {item.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-base font-bold text-emerald-600 shrink-0">
                        {item.range}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "rules" && (
              <motion.div
                key="rules"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
              >
                <div className="space-y-1">
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-600" />
                    Rules & Exclusions
                  </h2>
                  <p className="text-sm text-slate-500">
                    Strict compliance with these rules is required to remain in good standing.
                  </p>
                </div>

                <ul className="space-y-3">
                  {(program.rulesExclusions || [
                    "Denial of Service (DoS/DDoS) attacks against production nodes",
                    "Spam, phishing, or social engineering targeting employees or users",
                    "Physical security testing of data centers or office locations",
                    "Automated vulnerability scanner noise without validated proof of concept",
                    "Third-party integrations or services not directly controlled by the target",
                  ]).map((rule, idx) => (
                    <li
                      key={idx}
                      className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 text-rose-900 text-sm flex items-start gap-3"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Right Column: Sidebar Widgets */}
        <ProgramDetailSidebar program={program} />
      </main>
    </motion.div>
  );
}
