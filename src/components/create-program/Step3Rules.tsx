"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface Step3RulesProps {
  rulesOfEngagement: string;
  setRulesOfEngagement: (val: string) => void;
  excludedTypes: string[];
  setExcludedTypes: (types: string[]) => void;
  newExcludedInput: string;
  setNewExcludedInput: (val: string) => void;
  handleAddExcludedType: () => void;
  pocRequirements: string;
  setPocRequirements: (val: string) => void;
}

export function Step3Rules({
  rulesOfEngagement,
  setRulesOfEngagement,
  excludedTypes,
  setExcludedTypes,
  newExcludedInput,
  setNewExcludedInput,
  handleAddExcludedType,
  pocRequirements,
  setPocRequirements,
}: Step3RulesProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        Rules & Exclusions
      </h2>

      {/* Rules of Engagement */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Rules of Engagement
        </label>
        <Textarea
          rows={5}
          value={rulesOfEngagement}
          onChange={(e) => setRulesOfEngagement(e.target.value)}
          className="rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base focus-visible:ring-blue-500 font-mono resize-none p-3.5"
        />
      </div>

      {/* Excluded Vulnerabilities */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Excluded Vulnerability Types ({excludedTypes.length})
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="e.g. DDoS attacks, Spam, Self-XSS"
            value={newExcludedInput}
            onChange={(e) => setNewExcludedInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              (e.preventDefault(), handleAddExcludedType())
            }
            className="h-11 rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base focus-visible:ring-blue-500 flex-1"
          />
          <Button
            type="button"
            onClick={handleAddExcludedType}
            className="rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm h-11 px-6"
          >
            Add
          </Button>
        </div>

        {excludedTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {excludedTypes.map((item, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700"
              >
                {item}
                <button
                  type="button"
                  onClick={() =>
                    setExcludedTypes(
                      excludedTypes.filter((_, i) => i !== idx),
                    )
                  }
                  className="hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Proof of Concept Requirements */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          Proof of Concept (PoC) Requirements
        </label>
        <Textarea
          rows={4}
          value={pocRequirements}
          onChange={(e) => setPocRequirements(e.target.value)}
          className="rounded-xl border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-base focus-visible:ring-blue-500 font-mono resize-none p-3.5"
        />
      </div>
    </div>
  );
}
