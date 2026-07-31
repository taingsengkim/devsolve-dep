"use client";

import React from "react";
import { motion } from "motion/react";

export const ProgramRulesTab: React.FC = () => {
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
          You must follow these rules during your testing. Violations may result in report rejection and account suspension.
        </p>
        <ul className="space-y-3 pt-1">
          {[
            "Automated scanning allowed at up to 5 req/sec",
            "Do not access, modify, or delete customer data",
            "Do not perform DoS or DDoS attacks",
            "Do not engage in social engineering against employees",
            "Test only assets listed in scope",
            "Submit one vulnerability per report",
          ].map((rule, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base text-slate-800 font-medium leading-relaxed">
              <span className="text-slate-400 font-bold text-base select-none">•</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </div>

      <hr className="border-slate-200/80" />

      {/* Exclusions */}
      <div className="space-y-3">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Exclusions
        </h2>
        <p className="text-base text-slate-600 leading-relaxed font-normal">
          Reports covering the following vulnerability types will not be accepted. Save your time and focus on what matters.
        </p>
        <ul className="space-y-3 pt-1">
          {[
            "Self-XSS without demonstrated impact",
            "Clickjacking on pages without sensitive actions",
            "Missing security headers without demonstrated impact",
            "Rate limiting on non-sensitive endpoints",
            "Spam or phishing attacks",
          ].map((exclusion, idx) => (
            <li key={idx} className="flex items-start gap-3 text-base text-slate-800 font-medium leading-relaxed">
              <span className="text-slate-400 font-bold text-base select-none">•</span>
              <span>{exclusion}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};
