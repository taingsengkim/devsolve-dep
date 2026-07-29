import React from "react";
import { FileJson, Download, Info, Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ReportSidebarPanels } from "@/components/reports/ReportSidebarPanels";

interface ReportSummaryTabProps {
  severity: string;
  commentText: string;
  isSubmitting: boolean;
  onCommentTextChange: (text: string) => void;
  onSendComment: () => void;
}

export function ReportSummaryTab({
  severity,
  commentText,
  isSubmitting,
  onCommentTextChange,
  onSendComment,
}: ReportSummaryTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column: Main Content */}
      <main className="lg:col-span-2 space-y-6">
        {/* Description Section */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            Description
          </h3>
          <p className="text-base text-slate-700 leading-relaxed font-normal">
            A vulnerability was discovered in the User Profile API endpoint (
            <code className="bg-slate-100 text-blue-700 px-1.5 py-0.5 rounded font-mono text-xs sm:text-sm border border-slate-200">
              /api/v1/profile/[id]
            </code>
            ) where an authenticated user could access and modify any other user&apos;s profile details
            by simply changing the <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono text-xs sm:text-sm">id</code> parameter. The server fails to validate if the authenticated user owns the resource being requested.
          </p>
        </section>

        {/* Impact Section */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            Impact
          </h3>
          <p className="text-base text-slate-700 leading-relaxed font-normal">
            This is a classic Insecure Direct Object Reference (IDOR). Attackers could harvest private information for the entire user base, including email addresses, phone numbers, and physical addresses.
          </p>
        </section>

        {/* Steps to Reproduce Section */}
        <section className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
            Steps to Reproduce
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-base text-slate-700 leading-relaxed font-medium">
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
          <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">
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
                  <span className="text-sm font-bold text-slate-900">hunter_x_ray</span>
                  <span className="text-xs text-slate-400">Oct 24, 14:32</span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
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
                    <span className="text-sm font-bold text-slate-900">Alex (SecOps)</span>
                    <Badge className="bg-indigo-600 text-white text-xs px-1.5 py-0 rounded">Admin</Badge>
                  </div>
                  <span className="text-xs text-slate-400">Oct 24, 16:15</span>
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                  Thanks for the detailed report. We have validated this and our engineering team is working on a fix. This qualifies for our High severity tier.
                </p>
              </div>
            </div>
          </div>

          {/* Comment Input Area */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <textarea
              value={commentText}
              onChange={(e) => onCommentTextChange(e.target.value)}
              placeholder="Add a comment or update..."
              rows={3}
              className="w-full p-3.5 text-sm sm:text-base bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:bg-white transition-all resize-none"
            />
            <div className="flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold gap-1.5 cursor-pointer"
              >
                <Paperclip className="w-4 h-4" />
                <span>Attach file</span>
              </Button>
              <Button
                type="button"
                onClick={onSendComment}
                disabled={isSubmitting || !commentText.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold px-4.5 h-10 gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Right Column: Sidebar */}
      <ReportSidebarPanels severity={severity} />
    </div>
  );
}
