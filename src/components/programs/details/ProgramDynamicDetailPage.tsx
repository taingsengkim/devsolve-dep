"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { AlertCircle, ArrowLeft, Bookmark } from "lucide-react";
import { useGetProgramByIdQuery } from "@/lib/redux/services/program/programsApi";
import { ProgramDetailHero } from "@/components/programs/ProgramDetailHero";
import { ProgramDetailSidebar } from "@/components/programs/ProgramDetailSidebar";
import {
  ProgramDetailTabNav,
  ProgramDetailTabId,
} from "@/components/programs/details/ProgramDetailTabNav";
import { ProgramOverviewTab } from "@/components/programs/details/ProgramOverviewTab";
import { ProgramScopeTab } from "@/components/programs/details/ProgramScopeTab";
import { ProgramBountyMatrixTab } from "@/components/programs/details/ProgramBountyMatrixTab";
import { ProgramRulesTab } from "@/components/programs/details/ProgramRulesTab";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";

export default function ProgramDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const programId = resolvedParams.id;
  const [activeTab, setActiveTab] = useState<ProgramDetailTabId>("overview");
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  const {
    data: program,
    isLoading,
    isError,
  } = useGetProgramByIdQuery(programId);

  const toggleBookmark = () => {
    setIsBookmarked((prev) => !prev);
  };

  const pathname = usePathname();
  // Determine the base path: if pathname starts with /dashboard/programs, go to /dashboard/programs, else go to /programs
  const isDashboard = pathname.startsWith("/dashboard/programs");
  const backHref = isDashboard ? "/dashboard/programs" : "/programs";

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="space-y-6 w-full pb-12 animate-pulse">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-64 bg-slate-200 rounded-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl" />
              <div className="h-96 bg-slate-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !program) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-4 my-8 max-w-md mx-auto">
          <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
            <AlertCircle className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Program Not Found
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              The program you are looking for does not exist or has been
              removed.
            </p>
          </div>
          <Link href={backHref}>
            <Button
              variant="outline"
              className="rounded-xl font-semibold gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen   text-slate-800 font-sans">
      <main className="w-full  py-8 ">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-8 w-full pb-16"
        >
          {/* TOP ACTION BAR: BACK BUTTON & BOOKMARK BUTTON */}
          <div className="flex items-center justify-between">
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Marketplace
            </Link>
          </div>

          {/* Hero / Header Section */}
          <ProgramDetailHero program={program} />

          {/* Program Navigation Tabs Bar */}
          <ProgramDetailTabNav
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Main Grid Section (2 Columns: Main Content + Sidebar) */}
          <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column: Tab Content */}
            <section className="lg:col-span-2 space-y-8">
              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <ProgramOverviewTab program={program} />
                )}
                {activeTab === "scope" && <ProgramScopeTab program={program} />}
                {activeTab === "bounty-matrix" && (
                  <ProgramBountyMatrixTab program={program} />
                )}
                {activeTab === "rules" && <ProgramRulesTab
  rulesOfEngagement={program?.rulesOfEngagement}
  exclusions={program?.exclusions}
/>}
                
              </AnimatePresence>
            </section>

            {/* Right Column: Sidebar Widgets */}
            <ProgramDetailSidebar program={program} />
          </main>
        </motion.div>
      </main>
    </div>
  );
}
