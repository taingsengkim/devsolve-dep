"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FileJson,
  Download,
  Info,
  Paperclip,
  Send,
  ExternalLink,
  RotateCw,
  SquareCheck,
  Clock,
  Sparkles,
  Eye,
  Share2,
  Pencil,
  XCircle,
  FileText,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  Compass,
  Building2,
} from "lucide-react";

import {
  useGetReportByIdQuery,
  useAddReportCommentMutation,
  RetestItem,
  MOCK_RETEST_HISTORY,
  MOCK_REJECTED_REPORT_DETAIL,
} from "@/lib/redux/services/reportsApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = (params?.id as string) || "1";

  const { data: initialReport, isLoading } = useGetReportByIdQuery(reportId);
  const [addComment, { isLoading: isSubmitting }] = useAddReportCommentMutation();

  // Mode state: allow toggling between Accepted/Triaging view and Rejected view
  const [isForceRejected, setIsForceRejected] = useState<boolean | null>(null);

  const [activeTab, setActiveTab] = useState<"summary" | "retest">("summary");
  const [commentText, setCommentText] = useState("");
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Retest history local state to allow interactive switching between Image 1 & Image 2
  const [retestHistory, setRetestHistory] = useState<RetestItem[]>([]);

  const handleBack = () => {
    router.back();
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    try {
      await addComment({ reportId, text: commentText }).unwrap();
      setCommentText("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  const handleInitiateRetest = () => {
    setRetestHistory(MOCK_RETEST_HISTORY);
  };

  const handleResetRetest = () => {
    setRetestHistory([]);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText("/search?q=%3Cscript%3Ealert(document.domain)%3C/script%3E");
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  if (isLoading || !initialReport) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-blue-200" />
          <span className="text-sm font-medium text-slate-500">Loading report details...</span>
        </div>
      </div>
    );
  }

  // Determine whether to show Rejected view or Standard (Accepted/Triaging) view
  const isRejected =
    isForceRejected !== null
      ? isForceRejected
      : initialReport.status === "REJECTED" || reportId === "5";

  const report = isRejected ? MOCK_REJECTED_REPORT_DETAIL : initialReport;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-16 max-w-7xl mx-auto"
    >
      {/* Demo View Toggle Bar */}
      <div className="flex items-center justify-between p-3 bg-slate-100/90 rounded-2xl border border-slate-200/80 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-blue-600" />
          <span>Report Status Demo View:</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsForceRejected(false)}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              !isRejected
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            Accepted View
          </button>
          <button
            onClick={() => setIsForceRejected(true)}
            className={`px-3 py-1 rounded-xl font-bold transition-all cursor-pointer ${
              isRejected
                ? "bg-rose-600 text-white shadow-xs"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            Rejected View
          </button>
        </div>
      </div>

      {isRejected ? (
        /* ================= REJECTED REPORT DETAIL VIEW (PIXEL PERFECT TO SCREENSHOT) ================= */
        <div className="space-y-6">
          {/* Header Section */}
          <header className="space-y-3">
            {/* Top row: Page title & Back link */}
            <div className="flex items-center justify-between">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                My Reports
              </h1>
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>

            {/* Sub-row: ID Badge & Date */}
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100/80">
                {report.reportId}
              </span>
              <span>&bull;</span>
              <span>{report.submittedAgo}</span>
            </div>

            {/* Title & Action Buttons Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                {report.title}
              </h2>

              <div className="flex items-center gap-3 shrink-0">
                <Button
                  variant="outline"
                  className="rounded-xl border-slate-300 bg-white text-slate-700 font-semibold px-4 py-2 hover:bg-slate-50 text-sm flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Share2 className="w-4 h-4 text-slate-600" />
                  <span>Share</span>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-sm">
                  <Pencil className="w-4 h-4" />
                  <span>Request Review</span>
                </Button>
              </div>
            </div>

            {/* Badges Row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100/80 text-rose-700 border border-rose-200/80">
                <XCircle className="w-3.5 h-3.5 text-rose-600" />
                Rejected (Not Applicable)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                Severity: Medium (5.4)
              </span>
            </div>
          </header>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left Column: Main Content */}
            <main className="lg:col-span-2 space-y-6">
              {/* Rejection Alert Card with Red Left Accent Border */}
              <div className="flex items-start gap-4 p-5 sm:p-6 bg-slate-50/90 border border-slate-200/80 border-l-4 border-l-red-500 rounded-2xl text-slate-900 shadow-2xs">
                <div className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-sm shadow-xs">
                  !
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    This report has been marked as Not Applicable
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    After thorough review, the security team has determined that the reported vulnerability does not pose a functional security risk to the production environment or falls outside the current program scope.
                  </p>
                </div>
              </div>

              {/* Acme Security Team Response Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-4 shadow-2xs">
                <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-md bg-[linear-gradient(135deg,#334155,#1e293b)] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      A
                    </div>
                    <span className="text-sm font-bold text-slate-900">Acme Security Team</span>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">2 hours ago</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed font-normal">
                  &quot;Thank you for your report. After investigation, we have determined that this endpoint is behind a legacy firewall that sanitizes all inputs, making this non-exploitable in a production environment. However, we appreciate the effort and thoroughness of your documentation.&quot;
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/80">
                    Non-Exploitable
                  </span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1 rounded-full border border-slate-200/80">
                    WAF Protection
                  </span>
                </div>
              </div>

              {/* Description & Payload Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 space-y-5 shadow-2xs">
                {/* Heading with Document Icon */}
                <div className="flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600 stroke-[2]" />
                  <h2 className="text-2xl font-bold text-slate-900">Description</h2>
                </div>

                {/* Sub-block 1: DESCRIPTION */}
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                    DESCRIPTION
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    The <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-xs border border-slate-200/60">/search</code> endpoint is vulnerable to Reflected Cross-Site Scripting (XSS) via the <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-xs border border-slate-200/60">q</code> parameter. An attacker can inject malicious JavaScript that executes in the context of the user&apos;s session.
                  </p>
                </div>

                {/* Sub-block 2: PAYLOAD */}
                <div className="space-y-2 pt-2">
                  <h3 className="text-xs font-bold text-slate-900 tracking-wide uppercase">
                    PAYLOAD
                  </h3>
                  <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 font-mono text-xs sm:text-sm text-slate-700 flex items-center justify-between gap-3">
                    <code className="break-all">/search?q=%3Cscript%3Ealert(document.domain)%3C/script%3E</code>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCopyPayload}
                      className="text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg w-8 h-8 shrink-0 cursor-pointer"
                      title="Copy payload"
                    >
                      {copiedPayload ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </main>

            {/* Right Column: Contextual Sidebar */}
            <aside className="space-y-6">
              {/* What's Next Card (Primary Blue Card) */}
              <div className="bg-[#0055d4] text-white rounded-2xl p-6 space-y-4 shadow-md relative overflow-hidden">
                {/* Background decorative watermark */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

                <h3 className="text-xl font-bold tracking-tight text-white">What&apos;s Next?</h3>
                <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                  Don&apos;t let this slow you down. Here are some recommended actions to keep your momentum going.
                </p>

                <div className="space-y-2.5 pt-1">
                  <a
                    href="#"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-xs sm:text-sm font-semibold transition-all border border-white/10 text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-white" />
                      <span>Review Acme Policy</span>
                    </span>
                    <ExternalLink className="w-4 h-4 text-white/80" />
                  </a>

                  <a
                    href="#"
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-xs sm:text-sm font-semibold transition-all border border-white/10 text-white"
                  >
                    <span className="flex items-center gap-2.5">
                      <Compass className="w-4 h-4 text-white" />
                      <span>Find Similar Programs</span>
                    </span>
                    <ChevronRight className="w-4 h-4 text-white/80" />
                  </a>
                </div>
              </div>

              {/* Program Details Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5 shadow-2xs">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  PROGRAM DETAILS
                </h3>

                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <strong className="text-sm font-bold text-slate-900 truncate">
                      Global Enterprise VDP
                    </strong>
                    <a
                      href="#"
                      className="text-xs font-semibold text-blue-600 hover:underline block mt-0.5"
                    >
                      View Policy
                    </a>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Asset Type</span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">REST API</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Environment</span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">Production</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : (
        /* ================= STANDARD ACCEPTED/TRIAGING REPORT DETAIL VIEW ================= */
        <div className="space-y-6">
          {/* Report Header */}
          <header className="space-y-4 pb-4 border-b border-slate-200/80 bg-white p-4 sm:p-6 rounded-2xl shadow-xs border">
            {/* Header Top */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  My Reports
                </h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 border border-blue-200/80">
                  {report.reportId}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={handleBack}
                className="cursor-pointer rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-100 transition-all gap-2 px-3.5 shadow-xs text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            </div>

            {/* Report Title & Subtitle */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{report.program}</span>
                <span>&bull;</span>
                <span>{report.submittedAgo}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {report.title}
              </h2>
            </div>

            {/* Status Tracker */}
            <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-4">
              {/* Step 1: Submitted */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Submitted</span>
              </div>
              <div className="hidden sm:block w-4 h-0.5 bg-slate-200" />

              {/* Step 2: Accepted */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200/80 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Accepted</span>
              </div>
              <div className="hidden sm:block w-4 h-0.5 bg-slate-200" />

              {/* Step 3: Resolved */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium">
                <Circle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>Resolved</span>
              </div>
            </div>
          </header>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-2 border-b border-slate-200/80 px-1">
            <button
              onClick={() => setActiveTab("summary")}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ${
                activeTab === "summary"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Summary
              {activeTab === "summary" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("retest")}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all relative cursor-pointer ml-4 ${
                activeTab === "retest"
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Retest History ({retestHistory.length})
              {activeTab === "retest" && (
                <motion.div
                  layoutId="activeTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                />
              )}
            </button>
          </nav>

          {/* Tab Content Render */}
          {activeTab === "summary" ? (
            /* Main Grid Layout for Summary */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Left Column: Main Content */}
              <main className="lg:col-span-2 space-y-6 sm:space-y-8">
                {/* Description Section */}
                <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Description
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    A vulnerability was discovered in the User Profile API endpoint (
                    <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200">
                      /api/v1/profile/[id]
                    </code>
                    ) where an authenticated user could access and modify any other user&apos;s profile details
                    by simply changing the <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-xs">id</code> parameter. The server fails to validate if the authenticated user owns the resource being requested.
                  </p>
                </section>

                {/* Impact Section */}
                <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Impact
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed font-normal">
                    This is a classic Insecure Direct Object Reference (IDOR). Attackers could harvest private information for the entire user base, including email addresses, phone numbers, and physical addresses.
                  </p>
                </section>

                {/* Steps to Reproduce Section */}
                <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Steps to Reproduce
                  </h3>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 leading-relaxed font-medium">
                    <li>Log in as user A.</li>
                    <li>
                      Intercept the request to{" "}
                      <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200">
                        GET /api/v1/profile/12345
                      </code>{" "}
                      (your ID).
                    </li>
                    <li>
                      Change the ID to{" "}
                      <code className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded font-mono text-xs border border-slate-200">
                        12346
                      </code>{" "}
                      (user B&apos;s ID).
                    </li>
                    <li>Observe that the full profile details for user B are returned, including PII.</li>
                  </ol>
                </section>

                {/* Evidence & Attachments Section */}
                <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 pb-2">
                    EVIDENCE & ATTACHMENTS
                  </h3>
                  <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 hover:bg-slate-100/60 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <FileJson className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800">payload.json</span>
                        <span className="text-[11px] text-slate-400">2.4 KB &bull; JSON</span>
                      </div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-lg text-slate-500 hover:text-blue-600 hover:bg-white cursor-pointer"
                      title="Download Attachment"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </section>

                {/* Activity Feed Section */}
                <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                    Activity Feed
                  </h3>

                  <div className="space-y-4">
                    {/* User Comment */}
                    <div className="flex gap-3.5 items-start">
                      <Avatar className="w-9 h-9 border border-blue-200 shrink-0">
                        <AvatarFallback className="bg-blue-600 text-white font-bold text-xs">
                          H
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-900">hunter_x_ray</span>
                          <span className="text-[11px] text-slate-400">Oct 24, 14:32</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          I&apos;ve attached the proof of concept payload. This works even with standard user privileges. Let me know if you need more info.
                        </p>
                      </div>
                    </div>

                    {/* System Status Update */}
                    <div className="flex items-center gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-700">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                        <Info className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <strong className="font-semibold text-slate-900">DevSolve Team</strong> changed status to &quot;<strong className="text-blue-700">Accepted</strong>&quot; &bull; <span className="text-slate-500">Oct 24, 16:10</span>
                      </div>
                    </div>

                    {/* Admin Comment */}
                    <div className="flex gap-3.5 items-start">
                      <Avatar className="w-9 h-9 border-2 border-indigo-500 shrink-0">
                        <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                          A
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-slate-900">Alex (SecOps)</span>
                            <Badge className="bg-indigo-600 text-white text-[9px] px-1.5 py-0 rounded">Admin</Badge>
                          </div>
                          <span className="text-[11px] text-slate-400">Oct 24, 16:15</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          Thanks for the detailed report. We have validated this and our engineering team is working on a fix. This qualifies for our High severity tier.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Comment Input Area */}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment or update..."
                      rows={3}
                      className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:bg-white transition-all resize-none"
                    />
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold gap-1.5 cursor-pointer"
                      >
                        <Paperclip className="w-3.5 h-3.5" />
                        <span>Attach file</span>
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSendComment}
                        disabled={isSubmitting || !commentText.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold px-4 h-9 gap-2 shadow-sm cursor-pointer disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </Button>
                    </div>
                  </div>
                </section>
              </main>

              {/* Right Column: Sidebar Information */}
              <aside className="space-y-6">
                {/* Severity Panel */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    SEVERITY
                  </h4>
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500 text-white font-bold text-xs shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    High (8.1)
                  </div>
                  <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Confirmed Severity</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80">
                        High (8.1)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Claimed Severity</span>
                      <span className="font-semibold text-slate-700">Critical (9.0)</span>
                    </div>
                  </div>
                </div>

                {/* Reward Panel */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    REWARD
                  </h4>
                  <div className="text-2xl font-black text-slate-900 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-xl border border-emerald-200/80 inline-block">
                    $1,500.00
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    Status: <span className="text-amber-600">Pending Transfer</span>
                  </div>
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5 text-xs text-amber-800">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      Payment is handled off-platform via corporate payroll. Please ensure your wallet details are up to date.
                    </p>
                  </div>
                </div>

                {/* Program Details Panel */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    PROGRAM DETAILS
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                      B
                    </div>
                    <div className="flex flex-col min-w-0">
                      <strong className="text-sm font-bold text-slate-900 truncate">
                        Global Enterprise VDP
                      </strong>
                      <a
                        href="#"
                        className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <span>View Policy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                  <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Asset Type</span>
                      <span className="font-semibold text-slate-800">REST API</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Environment</span>
                      <span className="font-semibold text-slate-800">Production</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            /* Retest History Tab View */
            <div className="w-full space-y-4">
              {/* Quick Demo Toggle State Bar */}
              <div className="flex items-center justify-end gap-2 text-xs">
                <span className="text-slate-400 font-medium">Demo State:</span>
                {retestHistory.length === 0 ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleInitiateRetest}
                    className="text-xs text-blue-600 border-blue-200 bg-blue-50/50 hover:bg-blue-100 rounded-lg cursor-pointer h-7"
                  >
                    Switch to Image 2 (Has Data)
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleResetRetest}
                    className="text-xs text-slate-600 border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-lg cursor-pointer h-7"
                  >
                    Switch to Image 1 (Empty State)
                  </Button>
                )}
              </div>

              {retestHistory.length === 0 ? (
                /* IMAGE 1: Empty State Placeholder */
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-16 flex flex-col items-center justify-center text-center space-y-6 shadow-xs my-2"
                >
                  {/* Center Graphic */}
                  <div className="relative flex items-center justify-center w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-blue-50/70">
                    <span className="absolute top-8 left-10 w-2.5 h-2.5 rounded-full bg-blue-300/80" />
                    <span className="absolute right-8 top-24 w-2 h-2 rounded-full bg-slate-300" />
                    <span className="absolute bottom-10 right-16 w-3 h-3 rounded-full bg-slate-200" />

                    <div className="relative w-28 h-28 bg-white rounded-2xl border border-slate-200/80 shadow-md flex items-center justify-center">
                      <SquareCheck className="w-12 h-12 text-blue-600 stroke-[1.75]" />
                      <div className="absolute -bottom-2 -right-2 bg-blue-100/90 text-slate-700 p-1.5 rounded-full border-2 border-white shadow-xs">
                        <Clock className="w-4 h-4 text-slate-600" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-w-lg">
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      No retest history found
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      This report has not been retested yet. Once the organization marks the fix as ready, you can perform a retest to verify the vulnerability has been properly mitigated.
                    </p>
                  </div>

                  <Button
                    onClick={handleInitiateRetest}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full px-6 py-6 text-sm flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCw className="w-4.5 h-4.5" />
                    <span>Initiate First Retest</span>
                  </Button>
                </motion.div>
              ) : (
                /* IMAGE 2: Retest History Data Table */
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden my-2"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/90 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          <th className="py-4 px-6">REPORT ID & TITLE</th>
                          <th className="py-4 px-6">VERSION</th>
                          <th className="py-4 px-6">STATUS</th>
                          <th className="py-4 px-6">REQUEST DATE</th>
                          <th className="py-4 px-6">BOUNTY BONUS</th>
                          <th className="py-4 px-6 text-center">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {retestHistory.map((item, idx) => (
                          <motion.tr
                            key={item.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            className="hover:bg-slate-50/70 transition-colors group"
                          >
                            <td className="py-4 px-6">
                              <div className="flex flex-col">
                                <span className="text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {item.reportIdTitle}
                                </span>
                                <span className="text-xs text-slate-500 font-medium">
                                  {item.securityCategory}
                                </span>
                              </div>
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className="font-mono text-xs sm:text-sm text-slate-600 font-semibold">
                                {item.version}
                              </span>
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                              {item.status === "PASSED" ? (
                                <Badge className="bg-emerald-100 hover:bg-emerald-200 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 w-fit border border-emerald-200/60 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                  PASSED
                                </Badge>
                              ) : (
                                <Badge className="bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1.5 w-fit border border-rose-200/60 shadow-2xs">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                  FAILED
                                </Badge>
                              )}
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                              <span className="text-xs sm:text-sm text-slate-600 font-medium">
                                {item.requestDate}
                              </span>
                            </td>

                            <td className="py-4 px-6 whitespace-nowrap">
                              {item.bountyBonus ? (
                                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-emerald-700">
                                  <Sparkles className="w-4 h-4 text-emerald-600" />
                                  {item.bountyBonus}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium text-sm">&mdash;</span>
                              )}
                            </td>

                            <td className="py-4 px-6 text-center whitespace-nowrap">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="w-9 h-9 rounded-full text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                                aria-label="View Retest Details"
                              >
                                <Eye className="w-5 h-5" />
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
