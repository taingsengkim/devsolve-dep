"use client";

import React, { useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Shield, AlertTriangle } from "lucide-react";
import { SubmitReportFormValues, VULNERABILITY_CATEGORIES } from "@/lib/validations/report";
import { Input } from "@/components/ui/input";

interface SubmitReportClassificationSectionProps {
  register: UseFormRegister<SubmitReportFormValues>;
  errors: FieldErrors<SubmitReportFormValues>;
  setValue: UseFormSetValue<SubmitReportFormValues>;
  watch: UseFormWatch<SubmitReportFormValues>;
}

const SEVERITY_OPTIONS = [
  { id: "CRITICAL", label: "Critical", scoreRange: "9.0–10.0", color: "red" },
  { id: "HIGH", label: "High", scoreRange: "7.0–8.9", color: "orange" },
  { id: "MEDIUM", label: "Medium", scoreRange: "4.0–6.9", color: "amber" },
  { id: "LOW", label: "Low", scoreRange: "0.1–3.9", color: "blue" },
  { id: "INFO", label: "Info", scoreRange: "0.0", color: "slate" },
] as const;

const CWE_MAP: Record<string, { cwe: string; score: string; vector: string }> = {
  "Insecure Direct Object Reference (IDOR)": {
    cwe: "CWE-639",
    score: "8.1",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
  },
  "SQL Injection (SQLi)": {
    cwe: "CWE-89",
    score: "9.8",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H",
  },
  "Remote Code Execution (RCE)": {
    cwe: "CWE-94",
    score: "10.0",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:H/A:H",
  },
  "Cross-Site Scripting (XSS - Stored)": {
    cwe: "CWE-79",
    score: "7.2",
    vector: "CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:C/C:L/I:L/A:N",
  },
  "Cross-Site Scripting (XSS - Reflected)": {
    cwe: "CWE-79",
    score: "6.1",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N",
  },
  "Server-Side Request Forgery (SSRF)": {
    cwe: "CWE-918",
    score: "8.6",
    vector: "CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:C/C:H/I:N/A:N",
  },
};

export function SubmitReportClassificationSection({
  register,
  errors,
  setValue,
  watch,
}: SubmitReportClassificationSectionProps) {
  const selectedSeverity = watch("severity") || "CRITICAL";
  const selectedCategory = watch("category");

  // Auto suggest CWE when category changes
  useEffect(() => {
    if (selectedCategory && CWE_MAP[selectedCategory]) {
      const info = CWE_MAP[selectedCategory];
      setValue("cweIdentifier", info.cwe);
      setValue("cvssScore", info.score);
      setValue("cvssVector", info.vector);
    }
  }, [selectedCategory, setValue]);

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <Shield className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Vulnerability Classification
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Accurate classification speeds up triage and bounty determination
          </p>
        </div>
      </div>

      {/* Inputs Container */}
      <div className="space-y-5">
        {/* Report Title */}
        <div className="space-y-1.5">
          <label htmlFor="title" className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Report Title <span className="text-red-500">*</span>
          </label>
          <Input
            id="title"
            placeholder="e.g. IDOR in /api/v1/invoices/{id} exposes arbitrary billing records"
            {...register("title")}
            className="bg-white dark:bg-slate-900 h-11 text-sm border-slate-300 dark:border-slate-700"
          />
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Include vulnerability type, affected component, and impact in one clear sentence.
          </p>
          {errors.title && (
            <p className="text-xs text-red-500 font-medium">{errors.title.message}</p>
          )}
        </div>

        {/* Vulnerability Type / Category */}
        <div className="space-y-1.5">
          <label htmlFor="category" className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Vulnerability Type <span className="text-red-500">*</span>
          </label>
          <select
            id="category"
            {...register("category")}
            className="w-full h-11 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
          >
            <option value="">Select vulnerability type...</option>
            {VULNERABILITY_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>
          )}
        </div>

        {/* Severity Selector */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Severity <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-5 gap-2">
            {SEVERITY_OPTIONS.map((sev) => {
              const isSelected = selectedSeverity === sev.id;

              return (
                <button
                  key={sev.id}
                  type="button"
                  onClick={() => setValue("severity", sev.id as SubmitReportFormValues["severity"])}
                  className={`h-11 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? sev.id === "CRITICAL"
                        ? "bg-red-600 text-white shadow-xs"
                        : sev.id === "HIGH"
                        ? "bg-orange-600 text-white shadow-xs"
                        : sev.id === "MEDIUM"
                        ? "bg-amber-500 text-white shadow-xs"
                        : sev.id === "LOW"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-700 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {sev.label}
                </button>
              );
            })}
          </div>

          {/* Detailed Severity Breakdown Box */}
          <div className="p-4 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span className="text-xs font-bold text-red-600 dark:text-red-400">
                  Critical
                </span>
              </div>
              <span className="text-xs font-bold text-red-600 dark:text-red-400">
                CVSS 9.0–10.0
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300">
              Full system compromise, data breach, or catastrophic impact
            </p>
            <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
              Typically $3,000–$10,000+
            </div>
          </div>
        </div>

        {/* CWE & CVSS Score Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="cweIdentifier" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                CWE Identifier
              </label>
              <span className="text-xs text-slate-400">auto-suggested</span>
            </div>
            <Input
              id="cweIdentifier"
              placeholder="CWE-79"
              {...register("cweIdentifier")}
              className="bg-white dark:bg-slate-900 h-11 text-sm border-slate-300 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="cvssScore" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                CVSS Score (0.0–10.0)
              </label>
              <span className="text-xs text-slate-400">optional</span>
            </div>
            <Input
              id="cvssScore"
              placeholder="8.1"
              {...register("cvssScore")}
              className="bg-white dark:bg-slate-900 h-11 text-sm border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        {/* CVSS Vector String */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="cvssVector" className="text-xs font-bold text-slate-900 dark:text-slate-100">
              CVSS Vector String
            </label>
            <span className="text-xs text-slate-400">optional</span>
          </div>
          <Input
            id="cvssVector"
            placeholder="CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H"
            {...register("cvssVector")}
            className="bg-white dark:bg-slate-900 h-11 text-sm font-mono border-slate-300 dark:border-slate-700 text-xs"
          />
        </div>
      </div>
    </div>
  );
}
