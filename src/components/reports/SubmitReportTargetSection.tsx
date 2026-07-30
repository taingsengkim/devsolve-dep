"use client";

import React from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Target, CheckCircle2, XCircle, Lock, AlertTriangle } from "lucide-react";
import { SubmitReportFormValues, HTTP_METHODS, ENVIRONMENTS } from "@/lib/validations/report";
import { ProgramItem } from "@/lib/redux/services/programsApi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SubmitReportTargetSectionProps {
  register: UseFormRegister<SubmitReportFormValues>;
  errors: FieldErrors<SubmitReportFormValues>;
  setValue: UseFormSetValue<SubmitReportFormValues>;
  watch: UseFormWatch<SubmitReportFormValues>;
  programs: ProgramItem[];
  isLoading: boolean;
}

const HTTP_METHOD_STYLES: Record<string, { badge: string }> = {
  GET: { badge: "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border border-emerald-200/90 dark:border-emerald-800/80" },
  POST: { badge: "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 border border-blue-200/90 dark:border-blue-800/80" },
  PUT: { badge: "bg-amber-50 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200/90 dark:border-amber-800/80" },
  DELETE: { badge: "bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border border-rose-200/90 dark:border-rose-800/80" },
  PATCH: { badge: "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-200/90 dark:border-purple-800/80" },
  OPTIONS: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700" },
  HEAD: { badge: "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700" },
};

export function SubmitReportTargetSection({
  register,
  errors,
  setValue,
  watch,
  programs,
  isLoading,
}: SubmitReportTargetSectionProps) {
  const selectedEnvironment = watch("environment") || "Production";
  const selectedHttpMethod = watch("httpMethod") || "GET";

  return (
    <div className="space-y-6 font-sans">
      {/* Section Header */}
      <div className="flex items-center gap-3 pb-2">
        <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0 shadow-xs">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Target & Scope
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Identify the exact affected asset within this program's authorized scope
          </p>
        </div>
      </div>

      {/* Program Header Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-xs">
            CV
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                CloudVault Security Program
              </h3>
              <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Private
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              CloudVault Inc. · Max $10,000 · Avg response 2 days
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
          <Lock className="w-4 h-4" />
          <span>Program locked</span>
        </div>
      </div>

      {/* In-Scope Targets Section */}
      <div className="space-y-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            In-Scope Targets
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-900 dark:text-emerald-200 text-sm font-semibold"
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
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
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
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 text-sm font-semibold"
            >
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
              <span>{target}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Inputs Form Section */}
      <div className="space-y-5 pt-4 border-t border-slate-200 dark:border-slate-800">
        {/* Affected URL / Endpoint */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="targetAsset" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Affected URL / Endpoint <span className="text-red-500">*</span>
            </label>
            <span className="text-xs text-slate-500 font-medium">full URL including path and query</span>
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
            <label htmlFor="httpMethod" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              HTTP Method
            </label>
            <Select
              value={selectedHttpMethod}
              onValueChange={(val) =>
                setValue("httpMethod", val as SubmitReportFormValues["httpMethod"], {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            >
              <SelectTrigger
                id="httpMethod"
                className="w-full h-11 px-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                      HTTP_METHOD_STYLES[selectedHttpMethod]?.badge ||
                      HTTP_METHOD_STYLES.GET.badge
                    }`}
                  >
                    {selectedHttpMethod}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg p-1.5 min-w-[140px]">
                {HTTP_METHODS.map((method) => (
                  <SelectItem
                    key={method}
                    value={method}
                    className="rounded-xl cursor-pointer py-2 px-3 text-sm font-semibold"
                  >
                    <span
                      className={`px-2.5 py-0.5 rounded-md text-xs font-bold border ${
                        HTTP_METHOD_STYLES[method]?.badge || HTTP_METHOD_STYLES.GET.badge
                      }`}
                    >
                      {method}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="vulnerableParameter" className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Vulnerable Parameter
              </label>
              <span className="text-xs text-slate-500 font-medium">optional</span>
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
        <div className="space-y-2 pt-1">
          <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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
                  className={`h-11 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? isProduction
                        ? "bg-red-600 text-white shadow-xs"
                        : "bg-blue-600 text-white shadow-xs"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
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
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-sm font-medium text-amber-900 dark:text-amber-300 leading-relaxed">
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <div>
              <span className="font-bold">Production selected.</span> Confirm testing was non-destructive and did not access or retain real user data beyond the minimum needed to demonstrate impact.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

