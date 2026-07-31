"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  useGetReportConfirmationByIdQuery,
  useUpdateConfirmReportMutation,
} from "@/lib/redux/services/adminApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ShieldAlert,
  Building2,
  User,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  Copy,
  Check,
  FileText,
  Paperclip,
  Flame,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Lock,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

type DetailTab = "overview" | "poc" | "discussion" | "audit";

export default function ReportConfirmationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : "";

  const { data: report, isLoading, isError } = useGetReportConfirmationByIdQuery(id, {
    skip: !id,
  });
  const [updateConfirm] = useUpdateConfirmReportMutation();

  const [selectedSeverity, setSelectedSeverity] = useState<
    "Critical" | "High" | "Medium" | "Low"
  >("High");
  const [rewardAmount, setRewardAmount] = useState("$1,800");
  const [companyReasoning, setCompanyReasoning] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");

  useEffect(() => {
    if (report) {
      setSelectedSeverity(report.severity);
      setRewardAmount(report.rewardAmount || report.rewardEstimate || "$1,800");
      setCompanyReasoning(report.companyReasoning || "");
      setAdminNote(report.triageNotes || "");
    }
  }, [report]);

  if (isLoading) {
    return (
      <div className="space-y-6 w-full pb-12 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
            <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          </div>
          <div className="h-[500px] bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError || !report) {
    return (
      <div className="space-y-6 w-full pb-12">
        <Link
          href="/dashboard/report-confirmation"
          className="inline-flex items-center text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Triage Queue
        </Link>
        <Card className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-4 shadow-2xs">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 mx-auto flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Report Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            The requested report ID `{id}` could not be located in the platform confirmation queue.
          </p>
          <Button
            onClick={() => router.push("/dashboard/report-confirmation")}
            className="rounded-xl font-semibold bg-slate-900 hover:bg-slate-800 text-white cursor-pointer px-6 h-10 text-sm"
          >
            Return to Confirmation Queue
          </Button>
        </Card>
      </div>
    );
  }

  const hackerSev = report.hackerClaimedSeverity || {
    tier: report.severity,
    cvss: report.cvssVector ? `CVSS ${report.cvssScore}` : "CVSS 7.0 - 8.9",
    typicalReward: `Typically ${report.rewardEstimate}`,
  };

  const companySev = report.companyConfirmedSeverity || {
    tier: selectedSeverity,
    cvss: report.cvssVector ? `CVSS ${report.cvssScore}` : "CVSS 7.0 - 8.9",
    typicalReward: `Typically ${report.rewardEstimate}`,
  };

  const severitiesAgree = report.severitiesAgree ?? hackerSev.tier === selectedSeverity;

  const handleCopyPayload = () => {
    if (report.pocPayload) {
      navigator.clipboard.writeText(report.pocPayload);
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    }
  };

  const handleAction = async (status: "CONFIRMED" | "REJECTED" | "ESCALATED") => {
    setIsSubmitting(true);
    try {
      await updateConfirm({
        id: report.id,
        status,
        severity: selectedSeverity,
        rewardAmount: rewardAmount,
        companyReasoning: companyReasoning,
        triageNotes: adminNote,
      });
      router.push("/dashboard/report-confirmation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs: { id: DetailTab; label: string; count?: number }[] = [
    { id: "overview", label: "Overview & Scope" },
    { id: "poc", label: "PoC & Evidence", count: report.attachments?.length },
    { id: "discussion", label: "Discussion Thread", count: report.discussionThread?.length },
    { id: "audit", label: "Audit Timeline", count: report.auditLog?.length },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      {/* 1. PAGE BREADCRUMB HEADER */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Link
              href="/dashboard/report-confirmation"
              className="hover:text-slate-900 dark:hover:text-slate-100 flex items-center gap-1 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Triage Queue
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
              {report.reportCode || `DS-${report.id}`}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Report Validation & Triage Review
          </h1>
        </div>

        <Badge
          variant="outline"
          className="rounded-full px-3.5 py-1 text-sm font-bold border-slate-200 dark:border-slate-800 self-start sm:self-center"
        >
          Status: {report.status}
        </Badge>
      </header>

      {/* 2. HERO CARD HEADER */}
      <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-5 shadow-2xs">
        <div className="flex items-start gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-base shrink-0 shadow-2xs ${
              report.avatarColor || "bg-purple-600 text-white"
            }`}
          >
            {report.researcherName.replace("@", "").slice(0, 2).toUpperCase()}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-sm font-bold text-slate-500 dark:text-slate-400">
                {report.reportCode || `DS-${report.id}`}
              </span>
              <Badge className="bg-orange-500 text-white font-bold rounded-full px-3 py-0.5 text-xs">
                {selectedSeverity} Severity
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-0.5 text-xs font-semibold border-slate-200 dark:border-slate-800">
                {report.category}
              </Badge>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-snug">
              {report.title}
            </h2>
          </div>
        </div>

        {/* Metadata Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Researcher
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100">{report.researcherName}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" /> Target Program
            </span>
            <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
              {report.companyName} {report.programName && `(${report.programName})`}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-emerald-500" /> Confirmed Reward
            </span>
            <p className="font-extrabold text-emerald-600 dark:text-emerald-400 text-base">{rewardAmount}</p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Timeline
            </span>
            <p className="font-medium text-slate-700 dark:text-slate-300 text-xs">
              Submitted {report.submittedAt}
              {report.acceptedAt && ` • Accepted ${report.acceptedAt}`}
            </p>
          </div>
        </div>
      </Card>

      {/* 3. ASYMMETRIC 2-COLUMN GRID (Main Content Left 2/3, Sidebar Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* LEFT COLUMN: MAIN CONTENT & TABS */}
        <div className="lg:col-span-2 space-y-6">
          {/* SEVERITY VERDICT CARD */}
          <Card className="rounded-2xl border border-emerald-200/90 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                Severity Verdict Matrix
              </span>

              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/60 dark:text-emerald-200 dark:border-emerald-800 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {severitiesAgree ? "Severities agree" : "Severity Overridden"}
              </Badge>
            </div>

            {/* Hacker Claimed vs Company Confirmed Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Hacker Claimed
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {hackerSev.tier}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div>{hackerSev.cvss}</div>
                  <div>{hackerSev.typicalReward}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/40 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                  Company Confirmed
                </span>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                    {selectedSeverity}
                  </span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                  <div>{companySev.cvss}</div>
                  <div>{companySev.typicalReward}</div>
                </div>
              </div>
            </div>

            {/* Confirmed Reward Banner Footer */}
            <div className="pt-3 border-t border-emerald-200/70 dark:border-emerald-900/40 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Reward based on confirmed severity
              </span>
              <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {rewardAmount}
              </span>
            </div>
          </Card>

          {/* COMPANY'S REASONING CARD */}
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
              <Lock className="w-4 h-4 text-slate-400" />
              <span>{report.companyName}&apos;s Reasoning</span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
              {companyReasoning ||
                `${report.companyName} severity aligns with our bounty matrix for ${report.category}. ${selectedSeverity} is correct — well-documented, clean PoC.`}
            </p>
          </Card>

          {/* ELEVATED TAB NAVIGATION BAR WITH ANIMATED UNDERLINE */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 shadow-2xs">
            <div className="flex items-center gap-1 overflow-x-auto">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition cursor-pointer shrink-0 ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    <span>{tab.label}</span>
                    {typeof tab.count === "number" && (
                      <span className="px-1.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {tab.count}
                      </span>
                    )}
                    {isActive && (
                      <motion.div
                        layoutId="activeTabUnderline"
                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC TAB CONTENT WITH ANIMATE PRESENCE */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xs">
                  {/* Vulnerability Description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <FileText className="w-4.5 h-4.5 text-blue-600" />
                      Vulnerability Description
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      {report.description}
                    </p>
                  </div>

                  {/* Security Impact */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Flame className="w-4.5 h-4.5 text-rose-500" />
                      Security & Threat Impact
                    </h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800">
                      {report.impact}
                    </p>
                  </div>

                  {/* Target Scope & CWE Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-xs font-semibold text-slate-400">Target Scope URL</span>
                      <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100 break-all flex items-center justify-between">
                        <span>{report.targetAsset || "N/A"}</span>
                        {report.targetAsset && (
                          <a
                            href={report.targetAsset}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline shrink-0 ml-2"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-1">
                      <span className="text-xs font-semibold text-slate-400">CVSS Vector Rating</span>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-rose-600 text-white font-bold text-xs px-2 py-0.5">
                          {report.cvssScore || "N/A"}
                        </Badge>
                        <span className="font-mono text-xs text-slate-600 dark:text-slate-400">
                          {report.cvssVector || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "poc" && (
              <motion.div
                key="poc"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xs">
                  {/* Steps to Reproduce */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <ShieldCheck className="w-4.5 h-4.5 text-blue-600" />
                      Steps to Reproduce
                    </h3>
                    {report.reproduceSteps && report.reproduceSteps.length > 0 ? (
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-2 font-mono text-sm text-slate-800 dark:text-slate-200">
                        {report.reproduceSteps.map((step, idx) => (
                          <div key={idx} className="leading-relaxed flex items-start gap-2">
                            <span className="text-slate-400 font-bold shrink-0">{idx + 1}.</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No reproduction steps listed.</p>
                    )}
                  </div>

                  {/* PoC Payload Snippet */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        Proof of Concept Code Payload
                      </h3>
                      {report.pocPayload && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCopyPayload}
                          className="h-8 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          {copiedPayload ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-500" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1.5" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    {report.pocPayload ? (
                      <pre className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-sm overflow-x-auto border border-slate-800 leading-relaxed max-h-72">
                        <code>{report.pocPayload}</code>
                      </pre>
                    ) : (
                      <p className="text-sm text-slate-500">No payload code snippet provided.</p>
                    )}
                  </div>

                  {/* Attachments */}
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Paperclip className="w-4.5 h-4.5 text-slate-400" />
                      Evidence & Attachments
                    </h3>

                    {report.attachments && report.attachments.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {report.attachments.map((att, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                              <span className="truncate">{att.name}</span>
                            </div>
                            {att.size && (
                              <span className="text-xs font-normal text-slate-400 shrink-0 ml-2">
                                {att.size}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No attachments provided.</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "discussion" && (
              <motion.div
                key="discussion"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100">
                      <MessageSquare className="w-4.5 h-4.5 text-slate-400" />
                      <span>Discussion Thread</span>
                    </div>
                    <span className="text-xs font-semibold text-slate-400">
                      {report.discussionThread?.length || 0} messages
                    </span>
                  </div>

                  <div className="space-y-4">
                    {report.discussionThread && report.discussionThread.length > 0 ? (
                      report.discussionThread.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3.5 text-sm">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                              msg.role === "HACKER"
                                ? "bg-purple-600 text-white"
                                : msg.role === "COMPANY"
                                ? "bg-slate-800 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                          >
                            {msg.author.replace("@", "").slice(0, 2).toUpperCase()}
                          </div>

                          <div className="space-y-1.5 flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-900 dark:text-slate-100">
                                  {msg.author}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="rounded-full px-2 py-0 text-[10px] font-extrabold tracking-wider uppercase border-slate-200 dark:border-slate-800"
                                >
                                  {msg.role}
                                </Badge>
                              </div>
                              <span className="text-xs text-slate-400 font-medium">
                                {msg.timestamp}
                              </span>
                            </div>

                            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                              {msg.text}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-500">No messages in discussion thread.</p>
                    )}
                  </div>
                </Card>
              </motion.div>
            )}

            {activeTab === "audit" && (
              <motion.div
                key="audit"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-8 space-y-6 shadow-2xs">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                    Audit & Triage History
                  </h3>
                  {report.auditLog && report.auditLog.length > 0 ? (
                    <div className="space-y-5 relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
                      {report.auditLog.map((log) => (
                        <div key={log.id} className="relative space-y-1">
                          <div className="absolute -left-6 top-1.5 w-3.5 h-3.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-slate-900" />
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{log.action}</span>
                            <span className="text-xs text-slate-400">{log.timestamp}</span>
                          </div>
                          <p className="text-xs text-slate-500">By: {log.actor}</p>
                          {log.note && (
                            <div className="text-sm p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 mt-1.5 border border-slate-200/80 dark:border-slate-800">
                              {log.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No audit activity logged yet.</p>
                  )}
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: TRIAGE ACTION CONTROLS SIDEBAR */}
        <aside className="space-y-6 sticky top-6">
          <Card className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-5 shadow-2xs">
            <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
              <FileCheck className="w-5 h-5 text-blue-600" />
              <span>Triage Audit Decision</span>
            </div>

            {/* Confirmed Severity Selector */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Confirmed Severity Tier
              </Label>
              <div className="grid grid-cols-2 gap-2">
                {(["Critical", "High", "Medium", "Low"] as const).map((sev) => (
                  <Button
                    key={sev}
                    type="button"
                    variant={selectedSeverity === sev ? "default" : "outline"}
                    onClick={() => setSelectedSeverity(sev)}
                    className={`rounded-xl h-10 text-xs font-bold cursor-pointer transition ${
                      selectedSeverity === sev
                        ? sev === "Critical"
                          ? "bg-rose-600 text-white shadow-2xs"
                          : sev === "High"
                          ? "bg-orange-500 text-white shadow-2xs"
                          : sev === "Medium"
                          ? "bg-blue-600 text-white shadow-2xs"
                          : "bg-slate-700 text-white shadow-2xs"
                        : "border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    {sev}
                  </Button>
                ))}
              </div>
            </div>

            {/* Confirmed Bounty Amount */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Confirmed Bounty Amount
              </Label>
              <Input
                value={rewardAmount}
                onChange={(e) => setRewardAmount(e.target.value)}
                placeholder="e.g. $1,800"
                className="h-10 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold"
              />
            </div>

            {/* Admin Note / Rationale */}
            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-900 dark:text-slate-100">
                Triager Rationale Note
              </Label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Internal note or message to include with your decision..."
                rows={4}
                className="w-full p-3.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <Button
                disabled={isSubmitting}
                onClick={() => handleAction("CONFIRMED")}
                className="w-full rounded-xl h-11 font-bold bg-emerald-600 hover:bg-emerald-700 text-white text-sm cursor-pointer shadow-2xs"
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Confirm & Route to Program
              </Button>
              <Button
                variant="outline"
                disabled={isSubmitting}
                onClick={() => handleAction("ESCALATED")}
                className="w-full rounded-xl h-10 font-semibold border-purple-300 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-sm cursor-pointer"
              >
                <AlertTriangle className="w-4 h-4 mr-2 text-purple-600" />
                Escalate to Security Lead
              </Button>
              <Button
                variant="destructive"
                disabled={isSubmitting}
                onClick={() => handleAction("REJECTED")}
                className="w-full rounded-xl h-10 font-semibold text-sm cursor-pointer"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject / Mark Invalid
              </Button>
            </div>
          </Card>
        </aside>
      </div>
    </motion.div>
  );
}
