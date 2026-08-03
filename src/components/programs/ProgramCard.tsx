"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, ArrowRight } from "lucide-react";
import { Program } from "@/lib/types/programs/types";
import { usePathname } from "next/navigation";

interface ProgramCardProps {
  program: Program;
}

export function ProgramCard({ program }: ProgramCardProps) {
  // Bookmark state (can be initialized from program.isBookmarked if your API provides it)
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevents triggers if nested inside clickable elements
    setIsBookmarked((prev) => !prev);
    // TODO: Call your backend API / RTK Query mutation here to save bookmark status
  };

  // Determine if this is a Bounty vs Response program
  const isBounty = program.offersBounties || program.engagementType === "MANAGED";

  // Badge Styling: Blue for Bounty, Soft Green for Response
  const badgeStyle = isBounty
    ? "bg-blue-50 text-blue-600 border-blue-100/80 group-hover:border-blue-200"
    : "bg-emerald-50 text-emerald-600 border-emerald-100/80 group-hover:border-emerald-200";

  // Header Title Color: Blue for Bounty, Dark Slate for Response
  const companyTitleColor = isBounty ? "text-blue-600" : "text-slate-900 group-hover:text-blue-600 transition-colors";

  // Format Rewards Display
  const renderRewards = () => {
    if (isBounty) {
      const min = program.minimumBounty ?? 0;
      const max = program.maximumBounty ?? 0;
      return (
        <p className="text-[15px] font-extrabold text-emerald-600">
          ${min.toLocaleString()} - ${max.toLocaleString()}
        </p>
      );
    }

    const minPts = program.rewards?.[0]?.points ?? 20;
    const maxPts = program.rewards?.[program.rewards.length - 1]?.points ?? 80;
    return (
      <p className="text-[15px] font-extrabold text-blue-600">
        {minPts} - {maxPts} pts
      </p>
    );
  };

  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard/programs");
  const basePath = isDashboard ? "/dashboard/programs" : "/programs";

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-blue-500/40 hover:shadow-xl hover:shadow-slate-200/60">
      
      {/* BOOKMARK BUTTON (Top Right) */}
      <button
        onClick={toggleBookmark}
        type="button"
        aria-label="Bookmark program"
        className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50/80 active:scale-95 transition-all duration-200 z-10"
      >
        <Bookmark
          className={`w-5 h-5 transition-colors ${
            isBookmarked
              ? "fill-blue-500 stroke-none"
              : ""
          }`}
        />
      </button>

      <div className="space-y-4">
        {/* HEADER: LOGO, ORGANIZATION & BADGES */}
        <div className="flex items-start gap-3.5 pr-8">
          <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200/60 shrink-0 overflow-hidden shadow-sm group-hover:scale-105 group-hover:border-slate-300 transition-all duration-300">
            <Image
              src="https://media.wired.com/photos/5926ffe47034dc5f91bed4e8/3:2/w_2560%2Cc_limit/google-logo.jpg"
              alt={program.handle || "Organization"}
              className="w-full h-full object-cover"
              width={44}
              height={44}
            />
          </div>
          <div>
            <h4 className={`font-bold text-[17px] leading-tight ${companyTitleColor}`}>
              {program.organizationName || "Organization"}
            </h4>
            <div className="flex items-center gap-1.5 mt-1">
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-colors ${badgeStyle}`}>
                {isBounty ? "Bounty" : "Response"}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-[13px] text-slate-500 capitalize">
                {program.state?.toLowerCase() || "Open"}
              </span>
            </div>
          </div>
        </div>

        {/* PROGRAM TITLE & DESCRIPTION */}
        <div className="space-y-1.5">
          <h3 className="font-bold text-slate-900 text-[17px] leading-snug line-clamp-1 group-hover:text-slate-950 transition-colors">
            {program.name}
          </h3>
          <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
            {program.description}
          </p>
        </div>

        {/* IN-SCOPE ASSETS SECTION */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            In-Scope Assets
          </p>
          <div className="flex flex-wrap items-center gap-1.5">
            {program.inScopeAssets && program.inScopeAssets.length > 0 ? (
              <>
                {program.inScopeAssets.slice(0, 2).map((asset, index) => {
                  const assetName = asset.identifier;
                  return (
                    <span
                      key={asset.id || index}
                      className="bg-slate-100/80 group-hover:bg-slate-100 text-slate-700 text-xs font-mono font-medium px-2.5 py-1 rounded-lg border border-slate-200/60 max-w-[200px] truncate transition-colors"
                      title={assetName}
                    >
                      {assetName}
                    </span>
                  );
                })}

                {program.inScopeAssets.length > 2 && (
                  <span className="bg-slate-50 text-slate-500 text-xs font-semibold px-2 py-1 rounded-md border border-slate-200/50">
                    +{program.inScopeAssets.length - 2} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-[13px] text-slate-400 italic">No assets listed</span>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER: REWARDS & HOVERABLE SEE DETAILS BUTTON */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-400 font-medium">Rewards</p>
          {renderRewards()}
        </div>

        <Link
          href={`${basePath}/${program.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900 group-hover:shadow-md active:scale-95 transition-all duration-200"
        >
          <span>See Details</span>
          <ArrowRight className="w-3.5 h-3.5  -translate-x-1 group-hover group-hover:translate-x-0 transition-all duration-200" />
        </Link>
      </div>
    </div>
  );
}