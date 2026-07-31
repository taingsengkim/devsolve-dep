"use client";

import React from "react";
import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { ProgramItem } from "@/lib/types/programs/types";
import { Badge } from "@/components/ui/badge";

interface ProgramScopeTabProps {
  program: ProgramItem;
}

export const ProgramScopeTab: React.FC<ProgramScopeTabProps> = ({
  program,
}) => {
  return (
    <motion.div
      key="scope"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          In-Scope Targets & Assets
        </h2>
        <p className="text-base text-slate-600 font-normal">
          Only vulnerabilities discovered in targets listed below are eligible for rewards.
        </p>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-sm font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-4 px-5">TARGET ASSET</th>
              <th className="py-4 px-5">TYPE</th>
              <th className="py-4 px-5">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-base">
            {program.inScopeAssets.map((asset, idx) => (
              <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-4 px-5 font-mono font-bold text-slate-900">
                  {asset}
                </td>
                <td className="py-4 px-5">
                  <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
                    {asset.includes("App")
                      ? "Mobile"
                      : asset.includes("api")
                      ? "API"
                      : "Web"}
                  </Badge>
                </td>
                <td className="py-4 px-5">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    In-Scope
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};
