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
    <div className="bg-card rounded-2xl ring-1 ring-foreground/5 dark:ring-foreground/10 p-6 sm:p-8 space-y-6 shadow-xs">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-xl font-bold text-foreground tracking-tight">
            Bounty Reward Matrix
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Bounties are awarded based on CVSS severity rating and business impact.
        </p>
      </div>

      {/* Rewards List Stack */}
      {rewards.length === 0 ? (
        program?.offersBounties && (program?.minimumBounty || program?.maximumBounty) ? (
          <div className="ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-4 sm:p-5 bg-muted/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-black uppercase rounded-full tracking-wider w-fit shrink-0 bg-emerald-600 text-white">
                Bounty Range
              </span>
              <span className="text-sm font-semibold text-foreground leading-snug">
                Standard reward range configured for this program.
              </span>
            </div>
            <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
              ${(program.minimumBounty ?? 0).toLocaleString()} – ${(program.maximumBounty ?? 0).toLocaleString()}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            No specific reward tiers configured.
          </p>
        )
      ) : (
        <div className="flex flex-col gap-3">
          {rewards.map((reward, idx) => {
            const severityKey = (reward.severity || "MEDIUM").toUpperCase() as SeverityLevel;
            const badgeStyle =
              severityBadgeStyles[severityKey] || "bg-slate-500 text-white";
            const description =
              severityDescriptions[severityKey] || "";

            const min = Number(reward.minAmount ?? 0);
            const max = Number(reward.maxAmount ?? 0);
            const points = Number(reward.points ?? 0);

            return (
              <div
                key={reward.id || `${severityKey}-${idx}`}
                className="ring-1 ring-foreground/5 dark:ring-foreground/10 rounded-2xl p-4 sm:p-5 bg-muted/30 hover:bg-muted/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left Side: Badge + Examples */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center px-3 py-1 text-xs font-black uppercase rounded-full tracking-wider w-fit shrink-0 ${badgeStyle}`}
                  >
                    {severityKey}
                  </span>
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {description}
                  </span>
                </div>

                {/* Right Side: Points + Amount Range */}
                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  {points > 0 && (
                    <span className="flex items-center gap-1 text-xs text-amber-600 font-bold bg-amber-50 border border-amber-200/60 px-2.5 py-1 rounded-lg dark:text-amber-300 dark:bg-amber-500/10 dark:border-amber-500/20">
                      <Zap className="w-3.5 h-3.5 fill-amber-500" />
                      {points} pts
                    </span>
                  )}
                  <p className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${min.toLocaleString()} – ${max.toLocaleString()}
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