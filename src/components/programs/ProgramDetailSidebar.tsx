"use client";

import React from "react";
import Link from "next/link";
import { Zap, Calendar, FileText } from "lucide-react";
import { ProgramItem } from "@/lib/types/programs/types";
import { Button } from "@/components/ui/button";

interface ProgramDetailSidebarProps {
  program: ProgramItem;
}

export const ProgramDetailSidebar: React.FC<ProgramDetailSidebarProps> = ({
  program,
}) => {
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
            <dd className="font-semibold text-slate-800">{program.startDate || "June 1, 2025"}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">End Date</dt>
            <dd className="font-semibold text-slate-800">{program.endDate || "Aug 31, 2025"}</dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Status</dt>
            <dd className="font-medium text-slate-600 flex items-center gap-1 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
              {program.status}
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
              {program.stats?.reportsSubmitted || 142}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Active Researchers</dt>
            <dd className="font-bold text-slate-900">
              {program.researchersCount || 89}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-slate-500 font-medium">Program Type</dt>
            <dd className="font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100 text-xs">
              {program.type}
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

        <Link href={`/dashboard/my-reports`} className="block relative z-10">
          <Button className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold gap-2 shadow-sm cursor-pointer">
            <Zap className="w-4 h-4" />
            Submit a Report
          </Button>
        </Link>
      </section>
    </aside>
  );
};
