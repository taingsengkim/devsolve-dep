"use client";

import React from "react";
import { Shield, Bookmark, ArrowRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProgramType, ScopeTarget } from "./types";

interface CreateProgramPreviewProps {
  programName: string;
  description: string;
  programType: ProgramType;
  activeInScope: ScopeTarget[];
  getRewardRange: () => string;
}

export function CreateProgramPreview({
  programName,
  description,
  programType,
  activeInScope,
  getRewardRange,
}: CreateProgramPreviewProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Live Card Preview
        </span>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-blue-200/80 dark:border-blue-900/50 p-6 shadow-xs space-y-5">
        {/* Header: Logo, Org Name, Badge & Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Placeholder Icon / Logo */}
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-blue-600 dark:text-blue-400 leading-tight">
                  CyberShield Inc.
                </h4>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {programType === "BOUNTY" ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
                    Bounty
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50">
                    Response
                  </span>
                )}
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                  •
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium capitalize">
                  open
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            <Bookmark className="w-4 h-4" />
          </button>
        </div>

        {/* Program Title & Short Description */}
        <div className="space-y-1.5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
            {programName || "Program Name Security"}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-normal leading-relaxed line-clamp-3">
            {description ||
              "Protecting core infrastructure, including checkout, merchant services, and peer-to-peer transfers..."}
          </p>
        </div>

        {/* In-Scope Assets Pills */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            IN-SCOPE ASSETS
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {activeInScope.length > 0 ? (
              activeInScope.slice(0, 2).map((item) => (
                <span
                  key={item.id}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono font-medium border border-slate-200/60 dark:border-slate-700/60"
                >
                  {item.target}
                </span>
              ))
            ) : (
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-mono border border-slate-200/60 dark:border-slate-700/60">
                *.example.com
              </span>
            )}

            {activeInScope.length > 2 && (
              <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold">
                +{activeInScope.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Footer / Rewards & Action */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 block">
              Rewards
            </span>
            <span
              className={`text-base font-extrabold ${
                programType === "BOUNTY"
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {getRewardRange()}
            </span>
          </div>

          {programType === "BOUNTY" ? (
            <Button
              type="button"
              size="sm"
              className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900 text-white text-xs font-bold rounded-xl px-4 h-9"
            >
              See Details
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-xl px-4 h-9"
            >
              See Details
              <ArrowRight className="w-3.5 h-3.5 ml-1 text-slate-400" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
