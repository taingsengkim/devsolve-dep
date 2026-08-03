"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { ProgramDetail } from "@/lib/types/programs/types";

interface ProgramOverviewTabProps {
  program: ProgramDetail;
}

export const ProgramOverviewTab: React.FC<ProgramOverviewTabProps> = ({
  program,
}) => {

// this is the Overview tab

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8"
    >
      {/* About the Program */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          About the Program
        </h2>
        <p className="text-base font-bold text-slate-900 leading-relaxed">
          Test our cloud infrastructure, API gateways, and core web services for vulnerabilities.
        </p>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          { program.description}
        </p>
      </div>

      <hr className="border-slate-100" />

      {/* Proof of Concept Requirements */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
          Proof of Concept Requirements
        </h2>
        <p className="text-base text-slate-600 font-medium">
          Each report must include the following to be considered valid:
        </p>
        <ul className="space-y-3">
          {(  [
            "Step-by-step reproduction guide",
            "Exact HTTP request/payload (use Burp Suite export)",
            "Screenshot or screen recording demonstrating impact",
            "Affected endpoint and parameter names",
          ]).map((req, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base text-slate-800 font-medium leading-relaxed">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>{req}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
