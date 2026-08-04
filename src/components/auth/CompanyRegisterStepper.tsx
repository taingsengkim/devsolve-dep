"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompanyRegisterStepperProps {
  currentStep: 1 | 2 | 3;
}

export function CompanyRegisterStepper({ currentStep }: CompanyRegisterStepperProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        {/* Connector line behind steps */}
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />
        <div
          className="absolute top-4 left-6 h-0.5 bg-blue-600 transition-all duration-500 -z-0"
          style={{
            width: currentStep === 1 ? "0%" : currentStep === 2 ? "50%" : "100%",
          }}
        />

        {/* Step 1 Badge */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              currentStep === 1
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100"
                : currentStep > 1
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
            )}
          >
            {currentStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : "1"}
          </div>
          <span
            className={cn(
              "text-xs font-semibold mt-2 transition-colors",
              currentStep === 1
                ? "text-blue-600 font-bold"
                : currentStep > 1
                  ? "text-slate-800"
                  : "text-slate-400"
            )}
          >
            Your info
          </span>
        </div>

        {/* Step 2 Badge */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              currentStep === 2
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100"
                : currentStep > 2
                  ? "bg-emerald-500 text-white"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
            )}
          >
            {currentStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : "2"}
          </div>
          <span
            className={cn(
              "text-xs font-semibold mt-2 transition-colors",
              currentStep === 2
                ? "text-blue-600 font-bold"
                : currentStep > 2
                  ? "text-slate-800"
                  : "text-slate-400"
            )}
          >
            Company
          </span>
        </div>

        {/* Step 3 Badge */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              currentStep === 3
                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 ring-4 ring-blue-100"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            )}
          >
            3
          </div>
          <span
            className={cn(
              "text-xs font-semibold mt-2 transition-colors",
              currentStep === 3 ? "text-blue-600 font-bold" : "text-slate-400"
            )}
          >
            Verify
          </span>
        </div>
      </div>
    </div>
  );
}
