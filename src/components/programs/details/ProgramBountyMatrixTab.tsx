import React from "react";
import { ProgramDetail, SeverityLevel } from "@/lib/types/programs/types";
import { DollarSign, Zap } from "lucide-react";

// Severity color badge styling mapping
const severityBadgeStyles: Record<SeverityLevel, string> = {
  CRITICAL: "bg-red-600 text-white",
  HIGH: "bg-orange-500 text-white",
  MEDIUM: "bg-amber-500 text-white",
  LOW: "bg-slate-600 text-white",
  NONE: "bg-slate-400 text-white",
};

// Example descriptions corresponding to bug bounty standard categories
const severityDescriptions: Record<SeverityLevel, string> = {
  CRITICAL: "Remote Code Execution (RCE), Authentication Bypass, Full Database Leak",
  HIGH: "Stored XSS, Account Takeover, Privilege Escalation, Broken Access Control",
  MEDIUM: "CSRF on critical actions, IDOR, Server-Side Request Forgery (SSRF)",
  LOW: "Reflected XSS, Open Redirect, Sensitive Information Disclosure",
  NONE: "Informational or low impact issues",
};

export function ProgramBountyMatrixTab({ program }: { program: ProgramDetail }) {
  const rewards = program?.rewards || [];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">
            Bounty Reward Matrix
          </h3>
        </div>
        <p className="text-sm text-slate-500">
          Bounties are awarded based on CVSS severity rating and business impact.
        </p>
      </div>

      {/* Rewards List Stack */}
      {rewards.length === 0 ? (
        <p className="text-sm text-slate-400 italic">
          No specific reward tiers configured.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {rewards.map((reward) => {
            const badgeStyle =
              severityBadgeStyles[reward.severity] || "bg-slate-500 text-white";
            const description =
              severityDescriptions[reward.severity] || "";

            return (
              <div
                key={reward.id}
                className="border border-slate-100 rounded-2xl p-4 sm:p-5 bg-slate-50/40 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Side: Badge + Examples */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-xs font-black uppercase rounded-full tracking-wider w-fit shrink-0 ${badgeStyle}`}
                  >
                    {reward.severity}
                  </span>
                  <span className="text-sm font-semibold text-slate-800 leading-snug">
                    {description}
                  </span>
                </div>

                {/* Right Side: Points + Amount Range */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  {(reward.points ?? 0) > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg">
                      <Zap className="w-3.5 h-3.5 fill-amber-500" />
                      {reward.points} pts
                    </span>
                  )}
                  <p className="text-lg sm:text-xl font-extrabold text-emerald-600">
                    ${(reward.minAmount ?? 0).toLocaleString()} – ${(reward.maxAmount ?? 0).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}