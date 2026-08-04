"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { Program } from "@/lib/types/programs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProgramCardProps {
  program: Program;
  hrefPrefix?: string;
  onSeeDetails?: (program: Program) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  hrefPrefix,
  onSeeDetails,
}) => {
  const pathname = usePathname();
  const isBounty =
    program.offersBounties ||
    program.engagementType === "BOUNTY" ||
    program.engagementType === "MANAGED";

  // Determine detail link target based on current path or explicit prop
  const defaultPrefix = pathname?.startsWith("/dashboard")
    ? "/dashboard/programs"
    : "/programs";
  const targetPrefix = hrefPrefix ?? defaultPrefix;
  const detailUrl = `${targetPrefix}/${program.id}`;

  const orgName = program.organizationName || program.handle || "Organization";

  const renderRewards = () => {
    if (isBounty) {
      const min = program.minimumBounty ?? 0;
      const max = program.maximumBounty ?? 0;
      if (min === 0 && max === 0) return "$0";
      return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    }
    const minPts = program.rewards?.[0]?.points ?? 20;
    const maxPts = program.rewards?.[program.rewards.length - 1]?.points ?? 80;
    return `${minPts} - ${maxPts} pts`;
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className="flex flex-col justify-between h-full bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] hover:border-slate-300 transition-all duration-200 group"
    >
      <div className="space-y-4">
        {/* Header section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white shadow-xs shrink-0 ${
                isBounty ? "bg-blue-600" : "bg-emerald-600"
              }`}
            >
              {orgName.slice(0, 2).toUpperCase()}
            </div>

            <div className="min-w-0">
              <Link href={detailUrl}>
                <h2 className="text-lg font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                  {orgName}
                </h2>
              </Link>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge
                  variant="outline"
                  className={`font-medium text-xs ${
                    isBounty
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-emerald-100 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {isBounty ? "Bounty" : "Response"}
                </Badge>

                {/* Status indicator */}
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1 capitalize">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {program.state?.toLowerCase() || "open"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Program Title & Description */}
        <div>
          <Link href={detailUrl}>
            <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1.5 group-hover:text-blue-600 transition-colors">
              {program.name}
            </h3>
          </Link>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 min-h-[2.6rem]">
            {program.description}
          </p>
        </div>

        {/* In-Scope Assets */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 tracking-wider uppercase mb-2">
            IN-SCOPE ASSETS
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {program.inScopeAssets && program.inScopeAssets.length > 0 ? (
              <>
                {program.inScopeAssets.slice(0, 4).map((asset, idx) => {
                  const assetName = typeof asset === "string" ? asset : asset.identifier;
                  const key = typeof asset === "string" ? asset : asset.id || idx;
                  return (
                    <span
                      key={key}
                      className="inline-block px-2.5 py-1 rounded-md bg-slate-100/90 text-slate-700 text-xs font-mono border border-slate-200/80 truncate max-w-[140px]"
                      title={assetName}
                    >
                      {assetName}
                    </span>
                  );
                })}
                {program.inScopeAssets.length > 4 && (
                  <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
                    +{program.inScopeAssets.length - 4} more
                  </span>
                )}
              </>
            ) : (
              <span className="text-xs text-slate-400 italic">No assets listed</span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Rewards</span>
          <p
            className={`text-base font-bold tracking-tight ${
              isBounty ? "text-emerald-600" : "text-indigo-600"
            }`}
          >
            {renderRewards()}
          </p>
        </div>

        <Link href={detailUrl}>
          <Button
            onClick={() => onSeeDetails?.(program)}
            variant="outline"
            className="rounded-xl cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold h-9 px-4"
          >
            See Details
          </Button>
        </Link>
      </div>
    </motion.article>
  );
};