"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Bookmark, Send } from "lucide-react";
import { ProgramItem } from "@/lib/types/programs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProgramDetailHeroProps {
  program: ProgramItem;
}

export const ProgramDetailHero: React.FC<ProgramDetailHeroProps> = ({ program }) => {
  const [isSaved, setIsSaved] = useState(false);
  const pathname = usePathname();

  const backUrl = pathname?.startsWith("/dashboard")
    ? "/dashboard/programs"
    : "/programs";

  return (
    <div className="space-y-6">
      {/* Back to Programs Navigation */}
      <nav aria-label="Back Navigation">
        <Link
          href={backUrl}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Programs</span>
        </Link>
      </nav>

      {/* Program Hero Header */}
      <header className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        {/* Meta Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {program.logoUrl ? (
              <Image
                src={program.logoUrl}
                alt={program.companyName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-contain bg-white p-1 shrink-0"
              />
            ) : (
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl text-white shadow-xs shrink-0 ${
                  program.logoBgColor || "bg-blue-600"
                }`}
              >
                {program.companyName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-base font-bold text-slate-900">{program.companyName}</span>

                {/* Status dot in gray */}
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {program.status}
                </span>

                {/* Type Badge in Gray */}
                <Badge
                  variant="outline"
                  className="bg-slate-100 text-slate-600 border-slate-200 font-medium text-xs"
                >
                  {program.type}
                </Badge>
              </div>
            </div>
          </div>

          {/* Actions: Save & Submit Report */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsSaved(!isSaved)}
              className={`rounded-xl h-10 px-4 font-semibold text-sm cursor-pointer transition-all gap-2 ${
                isSaved
                  ? "bg-blue-50 text-blue-600 border-blue-300"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-blue-600 text-blue-600" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>

            <Link href={`/dashboard/submit-report?programId=${program.id}`}>
              <Button className="rounded-xl h-10 px-5 font-semibold text-sm bg-blue-600 hover:bg-blue-700 text-white cursor-pointer transition-all gap-2 shadow-xs">
                <Send className="w-4 h-4" />
                <span>Submit Report</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            {program.title}
          </h1>
          <p className=" text-base  leading-relaxed max-w-4xl">
            {program.description}
          </p>
        </div>

        {/* Program Tags */}
        <div className="flex flex-wrap gap-2">
          {program.assetCategories.map((cat) => (
            <span
              key={cat}
              className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
            >
              {cat}
            </span>
          ))}
        </div>

        <hr className="border-slate-200/80" />

        {/* Header Stats Bar */}
        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="space-y-1">
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Max Reward
            </dt>
            <dd className="text-xl sm:text-2xl font-bold text-emerald-600 tracking-tight">
              {program.maxReward || program.rewardRange}
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Submissions
            </dt>
            <dd className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {program.stats?.reportsSubmitted || 142}
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Researchers
            </dt>
            <dd className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {program.researchersCount || 89}
            </dd>
          </div>

          <div className="space-y-1">
            <dt className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Closes
            </dt>
            <dd className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {program.endDate || "Aug 31, 2025"}
            </dd>
          </div>
        </dl>
      </header>
    </div>
  );
};
