"use client";

import React from "react";
import { HelpCircle } from "lucide-react";
import type { StepTip } from "./types";

interface CreateProgramTipCardProps {
  tip: StepTip;
}

export function CreateProgramTipCard({ tip }: CreateProgramTipCardProps) {
  return (
    <div className="bg-blue-50/60 dark:bg-blue-950/30 rounded-2xl border border-blue-100 dark:border-blue-900/50 p-5 space-y-2 text-blue-900 dark:text-blue-200">
      <div className="flex items-center gap-2">
        <HelpCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200">
          {tip.title}
        </h4>
      </div>
      <p className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 leading-relaxed">
        {tip.text}
      </p>
    </div>
  );
}
