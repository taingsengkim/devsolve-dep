"use client";

import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ProgramItem } from "@/lib/types/programs/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProgramCardProps {
  program: ProgramItem;
  onSeeDetails: (program: ProgramItem) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onSeeDetails,
}) => {
  const isBounty = program.type === "Bounty";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: "easeOut" } }}
      className="flex flex-col justify-between h-full bg-white rounded-2xl p-6 border border-slate-200 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.08)] hover:border-slate-300 transition-all duration-200"
    >
      <div className="space-y-4">
        {/* Header section */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4 min-w-0">
            {program.logoUrl ? (
              <Image
                src={program.logoUrl}
                alt={program.companyName}
                width={80}
                height={80}
                className="w-20 h-20 rounded-2xl object-contain shrink-0 bg-white p-1"
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

            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-900 truncate">
                {program.companyName}
              </h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {/* Type Badge in Gray */}
                <Badge
                  variant="outline"
                  className="bg-slate-100 text-slate-600 border-slate-200 font-medium text-xs"
                >
                  {program.type}
                </Badge>

                {/* Status indicator in Gray */}
                <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  {program.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Program Title & Description */}
        <div>
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1.5 group-hover:text-blue-600 transition-colors">
            {program.title}
          </h3>
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
            {program.inScopeAssets.slice(0, 4).map((asset, idx) => (
              <span
                key={idx}
                className="inline-block px-2.5 py-1 rounded-md bg-slate-100/90 text-slate-700 text-xs font-mono border border-slate-200/80 truncate max-w-[140px]"
                title={asset}
              >
                {asset}
              </span>
            ))}
            {program.inScopeAssets.length > 4 && (
              <span className="inline-block px-2 py-1 rounded-md bg-slate-100 text-slate-500 text-xs font-medium">
                +{program.inScopeAssets.length - 4} more
              </span>
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
            {program.rewardRange}
          </p>
        </div>

        <Button
          onClick={() => onSeeDetails(program)}
          variant="outline"
          className="rounded-xl cursor-pointer border-slate-300 text-slate-700 hover:bg-slate-900 hover:text-white transition-all text-sm font-semibold h-9 px-4"
        >
          See Details
        </Button>
      </div>
    </motion.article>
  );
};
