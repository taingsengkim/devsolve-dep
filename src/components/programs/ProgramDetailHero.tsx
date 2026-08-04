"use client";
import Image from "next/image";
import React from "react";
import {
  Bookmark,
  Send,
  Trophy,
  Award,
  Layers,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";
import { Program, ProgramDetail } from "@/lib/types/programs/types";
import { Button } from "@/components/ui/button";
import {
  useGetBookmarkStatusQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
} from "@/lib/redux/services/bookmarksApi";

interface ProgramDetailHeroProps {
  program: ProgramDetail;
}

export function ProgramDetailHero({ program }: ProgramDetailHeroProps) {
  const { data: isSaved } = useGetBookmarkStatusQuery({ type: "PROGRAM", targetId: program.id });
  const [addBookmark, { isLoading: isSaving }] = useAddBookmarkMutation();
  const [removeBookmark, { isLoading: isRemoving }] = useRemoveBookmarkMutation();
  const isToggling = isSaving || isRemoving;

  const handleToggleSave = async () => {
    if (isToggling) return;
    try {
      if (isSaved) {
        await removeBookmark({ type: "PROGRAM", targetId: program.id }).unwrap();
      } else {
        await addBookmark({ type: "PROGRAM", targetId: program.id }).unwrap();
      }
    } catch {
      toast.error("Failed to update bookmark. Please try again.");
    }
  };

  const isBounty = program.offersBounties || program.engagementType === "MANAGED";

  const minBounty = program.minimumBounty ?? 0;
  const maxBounty = program.maximumBounty ?? 0;

  const formattedCreatedDate = program.createdAt
    ? new Date(program.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "N/A";

  const totalAssetsCount = program.assets?.length || 0;

  const assetTypes = Array.from(
    new Set(
      (program.assets || [])
        .map((a) => a.assetType || "Web")
        .filter(Boolean)
    )
  );

  return (
    <div className="relative bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="p-4 sm:p-6 space-y-4">
        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-700 text-base border border-slate-200/60 shrink-0 overflow-hidden">
              <Image
                src="https://media.wired.com/photos/5926ffe47034dc5f91bed4e8/3:2/w_2560%2Cc_limit/google-logo.jpg"
                alt={program.handle || "Organization"}
                className="w-full h-full object-cover"
                width={40}
                height={40}
              />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {program.handle}
                </h1>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                  • {program.state || "Active"}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                    isBounty
                      ? "bg-blue-50 text-blue-600 border-blue-100"
                      : "bg-purple-50 text-purple-600 border-purple-100"
                  }`}
                >
                  {isBounty ? "Bounty" : "Response"}
                </span>
              </div>
              {program.handle && (
                <p className="text-xs font-medium text-slate-400">@{program.handle}</p>
              )}
            </div>
          </div>

          {/* TOP RIGHT BUTTONS */}
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <Button
              onClick={handleToggleSave}
              disabled={isToggling}
              variant="outline"
              size="sm"
              className={`rounded-lg h-9 border-slate-200 text-xs font-semibold gap-1.5 transition-all ${
                isSaved
                  ? "bg-blue-50 text-blue-600 border-blue-200"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Bookmark
                className={`w-3.5 h-3.5 ${isSaved ? "fill-blue-600 text-blue-600" : "text-slate-500"}`}
              />
              {isSaved ? "Saved" : "Save"}
            </Button>
          </div>
        </div>

        {/* PROGRAM NAME – responsive size */}
        {program.description && (
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-black leading-snug w-full line-clamp-2">
            {program.name}
          </p>
        )}

        {/* PROGRAM DESCRIPTION – responsive */}
        {program.description && (
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed w-full line-clamp-2">
            {program.description}
          </p>
        )}

        {/* ASSET TYPE BADGES */}
        {assetTypes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {assetTypes.map((type, i) => (
              <span
                key={i}
                className="bg-slate-50 text-slate-500 text-[10px] font-semibold px-2.5 py-0.5 rounded-md border border-slate-200/60 uppercase tracking-wider"
              >
                {type}
              </span>
            ))}
          </div>
        )}

        {/* STATS ROW – responsive grid with proper gaps */}
        <div className="pt-3 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {/* MIN REWARD */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-slate-400">
              <Award className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isBounty ? "Min Reward" : "Min Points"}
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-800">
              {isBounty ? `$${minBounty.toLocaleString()}` : `${minBounty} pts`}
            </p>
          </div>

          {/* MAX REWARD */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-slate-400">
              <Trophy className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isBounty ? "Max Reward" : "Max Points"}
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-blue-600">
              {isBounty ? `$${maxBounty.toLocaleString()}` : `${maxBounty} pts`}
            </p>
          </div>

          {/* TOTAL ASSETS */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-slate-400">
              <Layers className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Total Assets
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-800">
              {totalAssetsCount}
            </p>
          </div>

          {/* CREATED DATE */}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Created Date
              </span>
            </div>
            <p className="text-sm sm:text-base font-bold text-slate-800">
              <span>{program.createdAt?.split('T')[0]}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}