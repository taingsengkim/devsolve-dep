"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Target, CheckCircle2, XCircle, Lock, AlertTriangle } from "lucide-react";
import { SubmitReportFormValues, HTTP_METHODS, ENVIRONMENTS } from "@/lib/validations/report";
import { ProgramItem } from "@/lib/redux/services/programsApi";
import { Input } from "@/components/ui/input";

interface SubmitReportTargetSectionProps {
  register: UseFormRegister<SubmitReportFormValues>;
  errors: FieldErrors<SubmitReportFormValues>;
  setValue: UseFormSetValue<SubmitReportFormValues>;
  watch: UseFormWatch<SubmitReportFormValues>;
  programs: ProgramItem[];
  isLoading: boolean;
}

export function SubmitReportTargetSection({
  register,
  errors,
  setValue,
  watch,
  programs,
  isLoading,
}: SubmitReportTargetSectionProps) {
  const selectedEnvironment = watch("environment") || "Production";

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Target & Scope
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Identify the exact affected asset within this program's scope
          </p>
        </div>
      </div>

      {/* Program Header Banner */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
            CV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                CloudVault Security Program
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                Private
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              CloudVault Inc. · Max $10,000 · Avg response 2 days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
          <Lock className="w-3.5 h-3.5" />
          <span>Program locked</span>
        </div>
      </div>

      {/* In-Scope Targets Section */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            In-Scope Targets
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            You are authorized to test these assets only.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {[
            "api.nexacloud.com",
            "dashboard.nexacloud.com",
            "auth.nexacloud.com",
            "*.nexacloud.com (excluding out-of-scope)",
          ].map((target) => (
            <div
              key={target}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-sm font-medium"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Out-of-Scope Targets Section */}
      <div className="space-y-3 pt-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Out-of-Scope Targets
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Do not test these assets under any circumstances.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {[
            "cdn.nexacloud.com",
            "status.nexacloud.com",
            "Third-party integrations",
            "Production customer databases",
          ].map((target) => (
            <div
              key={target}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 text-sm font-medium"
            >
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs Form Section */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Affected URL / Endpoint */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="targetAsset" className="text-xs font-bold text-slate-900 dark:text-slate-100">
              Affected URL / Endpoint <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-400">full URL including path and query</span>
          </div>
          <Input
            id="targetAsset"
            placeholder="https://api.example.com/v1/invoices/1337"
            {...register("targetAsset")}
            className="bg-white dark:bg-slate-900 h-11 text-sm border-slate-300 dark:border-slate-700"
          />
          {errors.targetAsset && (
            <p className="text-xs text-red-500 font-medium">{errors.targetAsset.message}</p>
          )}
        </div>

        {/* HTTP Method & Vulnerable Parameter */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="httpMethod" className="text-xs font-bold text-slate-900 dark:text-slate-100">
              HTTP Method
            </label>
            <select
              id="httpMethod"
              {...register("httpMethod")}
              className="w-full h-11 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
            >
              {HTTP_METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="vulnerableParameter" className="text-xs font-bold text-slate-900 dark:text-slate-100">
                Vulnerable Parameter
              </label>
              <span className="text-xs text-slate-400">optional</span>
            </div>
            <Input
              id="vulnerableParameter"
              placeholder="e.g. user_id, redirect_uri"
              {...register("vulnerableParameter")}
              className="bg-white dark:bg-slate-900 h-11 text-sm border-slate-300 dark:border-slate-700"
            />
          </div>
        </div>

        {/* Environment Selection */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Environment <span className="text-red-500">*</span>
          </label>

          <div className="grid grid-cols-3 gap-3">
            {ENVIRONMENTS.map((env) => {
              const isSelected = selectedEnvironment === env;
              const isProduction = env === "Production";

              return (
                <button
                  key={env}
                  type="button"
                  onClick={() => setValue("environment", env as "Production" | "Staging" | "Development")}
                  className={`h-11 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isSelected
                      ? isProduction
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  {env}
                </button>
              );
            })}
          </div>
        </div>

        {/* Production Warning Callout */}
        {selectedEnvironment === "Production" && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-900/60 text-xs font-medium text-amber-900 dark:text-amber-300 leading-relaxed">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Production selected.</span> Confirm testing was non-destructive and did not access or retain real user data beyond the minimum needed to demonstrate impact.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
