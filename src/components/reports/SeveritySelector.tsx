"use client";

import React from "react";
import { Check } from "lucide-react";

export type SeverityValue = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

interface SeverityOption {
  value: SeverityValue;
  label: string;
  cvss: string;
  description: string;
  colorClass: string;
  bgSelectedClass: string;
  borderSelectedClass: string;
}

const SEVERITY_OPTIONS: SeverityOption[] = [
  {
    value: "CRITICAL",
    label: "Critical",
    cvss: "9.0 - 10.0",
    description: "RCE, SQLi, Auth Bypass, full system compromise",
    colorClass: "text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800",
    bgSelectedClass: "bg-red-50/90 dark:bg-red-950/80",
    borderSelectedClass: "border-red-500 ring-2 ring-red-500/20",
  },
  {
    value: "HIGH",
    label: "High",
    cvss: "7.0 - 8.9",
    description: "Stored XSS, SSRF, Privilege Escalation, IDOR with sensitive data",
    colorClass: "text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/60 border-orange-200 dark:border-orange-800",
    bgSelectedClass: "bg-orange-50/90 dark:bg-orange-950/80",
    borderSelectedClass: "border-orange-500 ring-2 ring-orange-500/20",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    cvss: "4.0 - 6.9",
    description: "Reflected XSS, CSRF, Rate limit bypass, Sensitive info leak",
    colorClass: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
    bgSelectedClass: "bg-amber-50/90 dark:bg-amber-950/80",
    borderSelectedClass: "border-amber-500 ring-2 ring-amber-500/20",
  },
  {
    value: "LOW",
    label: "Low",
    cvss: "0.1 - 3.9",
    description: "Open redirect, Clickjacking, Mixed content, Path disclosure",
    colorClass: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    bgSelectedClass: "bg-emerald-50/90 dark:bg-emerald-950/80",
    borderSelectedClass: "border-emerald-500 ring-2 ring-emerald-500/20",
  },
  {
    value: "INFO",
    label: "Info",
    cvss: "0.0",
    description: "Security best practice recommendations, Header hardening",
    colorClass: "text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
    bgSelectedClass: "bg-slate-100/90 dark:bg-slate-800/90",
    borderSelectedClass: "border-slate-500 ring-2 ring-slate-500/20",
  },
];

interface SeveritySelectorProps {
  value: SeverityValue;
  onChange: (val: SeverityValue) => void;
}

export const SeveritySelector: React.FC<SeveritySelectorProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Claimed Severity <span className="text-red-500">*</span>
        </label>
        <span className="text-xs text-slate-400 font-medium">CVSS v3.1 Scale</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SEVERITY_OPTIONS.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                isSelected
                  ? `${option.bgSelectedClass} ${option.borderSelectedClass}`
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${option.colorClass}`}>
                  {option.label}
                </span>

                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 block">
                  CVSS {option.cvss}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-tight">
                  {option.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
