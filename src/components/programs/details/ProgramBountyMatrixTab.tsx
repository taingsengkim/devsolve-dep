"use client";

import React from "react";
import { motion } from "motion/react";
import { DollarSign } from "lucide-react";
import { ProgramItem } from "@/lib/types/programs/types";

interface ProgramBountyMatrixTabProps {
  program: ProgramItem;
}

export const ProgramBountyMatrixTab: React.FC<ProgramBountyMatrixTabProps> = ({
  program,
}) => {
  return (
    <motion.div
      key="bounty-matrix"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          Bounty Reward Matrix
        </h2>
        <p className="text-base text-slate-600 font-normal">
          Bounties are awarded based on CVSS severity rating and business impact.
        </p>
      </div>

      <div className="space-y-3">
        {(program.bountyMatrix || [
          { severity: "CRITICAL", range: "$5,000 - $10,000", description: "Remote Code Execution (RCE), Authentication Bypass, Full Database Leak" },
          { severity: "HIGH", range: "$2,000 - $5,000", description: "Stored XSS, Account Takeover, Privilege Escalation, Broken Access Control" },
          { severity: "MEDIUM", range: "$500 - $2,000", description: "CSRF on critical actions, IDOR, Server-Side Request Forgery (SSRF)" },
          { severity: "LOW", range: "$100 - $500", description: "Reflected XSS, Open Redirect, Sensitive Information Disclosure" },
        ]).map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-200/90 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    item.severity === "CRITICAL"
                      ? "bg-red-600 text-white"
                      : item.severity === "HIGH"
                      ? "bg-orange-500 text-white"
                      : item.severity === "MEDIUM"
                      ? "bg-amber-500 text-white"
                      : "bg-slate-600 text-white"
                  }`}
                >
                  {item.severity}
                </span>
                <span className="text-base font-semibold text-slate-900">
                  {item.description}
                </span>
              </div>
            </div>
            <span className="text-lg font-bold text-emerald-600 shrink-0">
              {item.range}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};
