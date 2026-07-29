import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Shield } from "lucide-react";
import { SubmitReportFormValues, VULNERABILITY_CATEGORIES } from "@/lib/validations/report";
import { ProgramItem } from "@/lib/redux/services/programsApi";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SubmitReportTargetSectionProps {
  register: UseFormRegister<SubmitReportFormValues>;
  errors: FieldErrors<SubmitReportFormValues>;
  programs: ProgramItem[];
  isLoading: boolean;
}

export function SubmitReportTargetSection({
  register,
  errors,
  programs,
  isLoading,
}: SubmitReportTargetSectionProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-5">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          1. Target Program & In-Scope Asset
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Target Program Selection */}
        <div className="space-y-2">
          <Label htmlFor="programId" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Target Program <span className="text-red-500">*</span>
          </Label>
          <select
            id="programId"
            {...register("programId")}
            disabled={isLoading}
            className="w-full h-10 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <option value="">Loading programs...</option>
            ) : (
              programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.companyName} — {p.title}
                </option>
              ))
            )}
          </select>
          {errors.programId && (
            <p className="text-xs text-red-500 font-medium">{errors.programId.message}</p>
          )}
        </div>

        {/* Target Asset / Endpoint */}
        <div className="space-y-2">
          <Label htmlFor="targetAsset" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Target Asset / Endpoint <span className="text-red-500">*</span>
          </Label>
          <Input
            id="targetAsset"
            placeholder="e.g. https://api.payments.com/v1/charge or *.acme.com"
            {...register("targetAsset")}
            className="bg-white text-base sm:text-sm border-slate-300"
          />
          {errors.targetAsset && (
            <p className="text-xs text-red-500 font-medium">{errors.targetAsset.message}</p>
          )}
        </div>
      </div>

      {/* Vulnerability Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Vulnerability Category (OWASP / CWE) <span className="text-red-500">*</span>
        </Label>
        <select
          id="category"
          {...register("category")}
          className="w-full h-10 px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
        >
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
    </div>
  );
}
