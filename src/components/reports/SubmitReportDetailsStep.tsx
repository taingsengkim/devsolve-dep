"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { FileText, Plus, Trash2 } from "lucide-react";
import { SubmitReportFormValues } from "@/lib/validations/report";
import { PocTemplateToolbar } from "@/components/reports/PocTemplateToolbar";

interface SubmitReportDetailsStepProps {
  register: UseFormRegister<SubmitReportFormValues>;
  errors: FieldErrors<SubmitReportFormValues>;
  reproduceStepsList: string[];
  onAddReproduceStep: () => void;
  onRemoveReproduceStep: (index: number) => void;
  onUpdateReproduceStep: (index: number, val: string) => void;
  onInsertTemplate: (template: string) => void;
}

export function SubmitReportDetailsStep({
  register,
  errors,
  reproduceStepsList,
  onAddReproduceStep,
  onRemoveReproduceStep,
  onUpdateReproduceStep,
  onInsertTemplate,
}: SubmitReportDetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Report Details
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Provide clear steps to reproduce and impact explanation
          </p>
        </div>
      </div>

      {/* Description & Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="summaryPoC" className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Vulnerability Description & Summary <span className="text-red-500">*</span>
          </label>
        </div>

        <PocTemplateToolbar onInsertTemplate={onInsertTemplate} />

        <textarea
          id="summaryPoC"
          rows={5}
          placeholder="Describe the root cause, affected parameters, and overall architecture vulnerability..."
          {...register("summaryPoC")}
          className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed font-mono"
        />
        {errors.summaryPoC && (
          <p className="text-xs text-red-500 font-medium">{errors.summaryPoC.message}</p>
        )}
      </div>

      {/* Steps to Reproduce */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Steps to Reproduce <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={onAddReproduceStep}
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Step</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {reproduceStepsList.map((step, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="w-7 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <input
                type="text"
                value={step}
                onChange={(e) => onUpdateReproduceStep(idx, e.target.value)}
                placeholder={`Step ${idx + 1}...`}
                className="flex-1 h-9 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              {reproduceStepsList.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveReproduceStep(idx)}
                  className="w-9 h-9 rounded-xl text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Impact Explanation */}
      <div className="space-y-1.5 pt-2">
        <label htmlFor="impact" className="text-xs font-bold text-slate-900 dark:text-slate-100">
          Impact Explanation <span className="text-red-500">*</span>
        </label>
        <textarea
          id="impact"
          rows={3}
          placeholder="What can an attacker achieve by exploiting this flaw? (e.g. read billing invoices, modify data, escalate privileges)"
          {...register("impact")}
          className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
        />
      </div>

      {/* Suggested Remediation */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <label htmlFor="remediation" className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Suggested Remediation / Fix
          </label>
          <span className="text-xs text-slate-400">optional</span>
        </div>
        <textarea
          id="remediation"
          rows={3}
          placeholder="Suggest code fix or architectural defense (e.g. implement server-side access control check on tenant ID)"
          {...register("remediation")}
          className="w-full p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
        />
      </div>
    </div>
  );
}
