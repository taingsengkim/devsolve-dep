"use client";

import React from "react";
import { motion } from "motion/react";
import { RuleSection, ProgramDetail } from "@/lib/types/programs/types";

interface ProgramRulesTabProps {
  rulesOfEngagement?: RuleSection;
  exclusions?: RuleSection;
  program?: ProgramDetail; // Fallback in case parent passes program directly!
}

export const ProgramRulesTab: React.FC<ProgramRulesTabProps> = (props) => {
  // Debug Log: Check F12 Console in Browser!
  // console.log("ProgramRulesTab received props:", props);

  // Extract rules from props directly OR from program prop fallback
  const rulesData = props.rulesOfEngagement ?? props.program?.rulesOfEngagement;
  const exclusionsData = props.exclusions ?? props.program?.exclusions;

  // Extract rule arrays safely
  const rulesList = Array.isArray(rulesData?.rules) ? rulesData.rules : [];
  const exclusionsList = Array.isArray(exclusionsData?.rules) ? exclusionsData.rules : [];

  return (
    <motion.div
      key="rules"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-8 text-slate-900"
    >
      {/* Rules of Engagement */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Rules of Engagement
        </h2>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          {rulesData?.description ||
            "You must follow these rules during your testing. Violations may result in report rejection and account suspension."}
        </p>

        {rulesList.length > 0 ? (
          <ul className="space-y-3 pt-1">
            {rulesList.map((rule, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-base text-slate-800 font-medium leading-relaxed"
              >
                <span className="text-slate-400 font-bold text-base select-none">
                  •
                </span>
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 italic">No specific rules specified.</p>
        )}
      </div>

      <hr className="border-slate-200/80" />

      {/* Exclusions */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Exclusions
        </h2>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          {exclusionsData?.description ||
            "Reports covering the following vulnerability types will not be accepted. Save your time and focus on what matters."}
        </p>

        {exclusionsList.length > 0 ? (
          <ul className="space-y-3 pt-1">
            {exclusionsList.map((exclusion, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 text-base text-slate-800 font-medium leading-relaxed"
              >
                <span className="text-slate-400 font-bold text-base select-none">
                  •
                </span>
                <span>{exclusion}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-400 italic">No specific exclusions specified.</p>
        )}
      </div>
    </motion.div>
  );
};