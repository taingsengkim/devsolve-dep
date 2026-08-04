import React from "react";
import {
  Share2,
  Pencil,
  FileText,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
  Compass,
  ChevronRight,
  Building2,
} from "lucide-react";
import { ReportItem } from "@/lib/types/reports/types";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/reports/StatusBadge";
import SeverityBadge from "@/components/reports/SeverityBadge";

interface RejectedReportViewProps {
  report: ReportItem | { title: string; [key: string]: any };
  copiedPayload: boolean;
  onCopyPayload: () => void;
}

export function RejectedReportView({
  report,
  copiedPayload,
  onCopyPayload,
}: RejectedReportViewProps) {
  return (
    <div className="space-y-6">
      {/* Report Title & Status Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-6 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {report.title}
          </h2>

          <div className="flex items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              className="rounded-xl border-slate-200 bg-white text-slate-700 font-semibold px-4 py-2 hover:bg-slate-100 text-sm flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4 text-slate-600" />
              <span>Share</span>
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl text-sm flex items-center gap-2 cursor-pointer shadow-xs">
              <Pencil className="w-4 h-4" />
              <span>Request Review</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <StatusBadge status="REJECTED" />
          <SeverityBadge severity="MEDIUM" />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Content */}
        <main className="lg:col-span-2 space-y-6">
          {/* Rejection Alert Card */}
          <div className="flex items-start gap-4 p-5 sm:p-6 bg-slate-50/90 border border-slate-200/80 border-l-4 border-l-red-500 rounded-2xl text-slate-900 shadow-2xs">
            <div className="w-8 h-8 rounded-full bg-red-500 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-sm shadow-xs">
              !
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                This report has been marked as Not Applicable
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                After thorough review, the security team has determined that the reported vulnerability does not pose a functional security risk to the production environment or falls outside the current program scope.
              </p>
            </div>
          </div>

          {/* Acme Security Team Response Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[linear-gradient(135deg,#334155,#1e293b)] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs">
                  A
                </div>
                <span className="text-sm font-bold text-slate-900">Acme Security Team</span>
              </div>
              <span className="text-xs text-slate-400 font-medium">2 hours ago</span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 italic leading-relaxed font-normal">
              &quot;Thank you for your report. After investigation, we have determined that this endpoint is behind a legacy firewall that sanitizes all inputs, making this non-exploitable in a production environment. However, we appreciate the effort and thoroughness of your documentation.&quot;
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="bg-slate-100 text-slate-600 text-sm font-semibold px-3.5 py-1 rounded-full border border-slate-200/80">
                Non-Exploitable
              </span>
              <span className="bg-slate-100 text-slate-600 text-sm font-semibold px-3.5 py-1 rounded-full border border-slate-200/80">
                WAF Protection
              </span>
            </div>
          </div>

          {/* Description & Payload Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 space-y-5 shadow-xs">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-blue-600 stroke-[2]" />
              <h2 className="text-2xl font-bold text-slate-900">Description</h2>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                DESCRIPTION
              </h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                The <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-xs sm:text-sm border border-slate-200/60">/search</code> endpoint is vulnerable to Reflected Cross-Site Scripting (XSS) via the <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-xs sm:text-sm">q</code> parameter. An attacker can inject malicious JavaScript that executes in the context of the user&apos;s session.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
                PAYLOAD
              </h3>
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-4 font-mono text-sm sm:text-base text-slate-700 flex items-center justify-between gap-3">
                <code className="break-all">/search?q=%3Cscript%3Ealert(document.domain)%3C/script%3E</code>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={onCopyPayload}
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
          {/* What's Next Card */}
          <div className="bg-[#0055d4] text-white rounded-2xl p-6 space-y-4 shadow-md relative overflow-hidden">
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

            <h3 className="text-xl font-bold tracking-tight text-white">What&apos;s Next?</h3>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed font-normal">
              Don&apos;t let this slow you down. Here are some recommended actions to keep your momentum going.
            </p>

            <div className="space-y-2.5 pt-1">
              <a
                href="#"
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-sm sm:text-base font-semibold transition-all border border-white/10 text-white"
              >
                <span className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-white" />
                  <span>Review Acme Policy</span>
                </span>
                <ExternalLink className="w-4 h-4 text-white/80" />
              </a>

              <a
                href="#"
                className="flex items-center justify-between p-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-sm sm:text-base font-semibold transition-all border border-white/10 text-white"
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
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 space-y-5 shadow-xs">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              PROGRAM DETAILS
            </h3>

            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex flex-col min-w-0">
                <strong className="text-base font-bold text-slate-900 truncate">
                  Global Enterprise VDP
                </strong>
                <a
                  href="#"
                  className="text-sm font-semibold text-blue-600 hover:underline block mt-0.5"
                >
                  View Policy
                </a>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">Asset Type</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">REST API</span>
              </div>
              <div>
                <span className="text-xs sm:text-sm text-slate-500 font-medium block">Environment</span>
                <span className="text-sm sm:text-base font-bold text-slate-900 block mt-0.5">Production</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
