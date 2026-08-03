"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Zap, Calendar, FileText, Loader2 } from "lucide-react";
import { Program, ProgramDetail } from "@/lib/types/programs/types";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useKeycloakLogin } from "@/hooks/useKeycloakLogin";

interface ProgramDetailSidebarProps {
  program: ProgramDetail;
}

export const ProgramDetailSidebar: React.FC<ProgramDetailSidebarProps> = ({
  program,
}) => {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const { handleLogin, isLoggingIn } = useKeycloakLogin();

  const handleSubmitReport = () => {
    const targetUrl = `/dashboard/submit-report?programId=${program.id}`;
    if (session?.user) {
      router.push(targetUrl);
    } else {
      handleLogin(targetUrl);
    }
  };

// this is the right bar card in the program detail

  return (
    <aside className="space-y-6">
      {/* Widget 1: Program Timeline */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Program Timeline
        </h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Start Date</dt>
            {/* <dd className="font-semibold text-slate-800">{program.createdAt || "June 1, 2025"}</dd> */}
            <span>{program.createdAt?.split('T')[0]}</span>
          </div>
          {/* <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">End Date</dt>
            <dd className="font-semibold text-slate-800">{ "Aug 31, 2025"}</dd>
          </div> */}
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Status</dt>
            <dd className="font-medium text-slate-600 flex items-center gap-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {program.state}
            </dd>
          </div>
        </dl>
      </section>

      {/* Widget 2: Quick Stats */}
      <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-600" />
          Quick Stats
        </h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Total Reports</dt>
            <dd className="font-bold text-slate-900">
              { 142}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Active Researchers</dt>
            <dd className="font-bold text-slate-900">
              { 89}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Program Type</dt>
            <dd className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100 text-xs">
              {program.engagementType}
            </dd>
          </div>
        </dl>
      </section>

      {/* Widget 3: CTA Card */}
      <section className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-900 text-white p-6 rounded-2xl shadow-md space-y-4 relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-blue-600/20 rounded-full blur-2xl" />
        <div className="space-y-2 relative z-10">
          <h3 className="text-lg font-bold tracking-tight">Ready to start?</h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            Read the scope and rules carefully before testing.
          </p>
        </div>

        <div className="block relative z-10">
          <Button
            onClick={handleSubmitReport}
            disabled={isLoggingIn}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold gap-2 shadow-sm cursor-pointer"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Submit a Report
          </Button>
        </div>
      </section>
    </aside>
  );
};
