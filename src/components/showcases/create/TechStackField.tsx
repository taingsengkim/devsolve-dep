"use client";

import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, X } from "lucide-react";
import {
  MAX_TECH,
  TECH_SUGGESTIONS,
  canonicalizeTech,
} from "@/lib/validations/showcase";
import { cn } from "@/lib/utils";

interface TechStackFieldProps {
  value: string[];
  onChange: (next: string[]) => void;
}

/**
 * Chip input with autocomplete over a known list, and free entry for anything
 * not on it. Every value goes through `canonicalizeTech` first: the
 * showcase_tech table is unique per showcase, so `react`, `React` and
 * `ReactJS` must not arrive as three rows.
 */
export function TechStackField({ value, onChange }: TechStackFieldProps) {
  const [draft, setDraft] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const full = value.length >= MAX_TECH;

  const matches = useMemo(() => {
    const query = draft.trim().toLowerCase();
    const unpicked = TECH_SUGGESTIONS.filter((tech) => !value.includes(tech));
    if (!query) return unpicked.slice(0, 8);
    return unpicked
      .filter((tech) => tech.toLowerCase().includes(query))
      .slice(0, 8);
  }, [draft, value]);

  const add = (raw: string) => {
    const tech = canonicalizeTech(raw);
    if (!tech || full || value.includes(tech)) {
      setDraft("");
      return;
    }
    onChange([...value, tech]);
    setDraft("");
    inputRef.current?.focus();
  };

  const remove = (tech: string) => onChange(value.filter((t) => t !== tech));

  /** True when the draft is a new value rather than one already listed. */
  const canonicalDraft = canonicalizeTech(draft);
  const showCustom =
    canonicalDraft.length > 0 &&
    !value.includes(canonicalDraft) &&
    !matches.some((tech) => tech === canonicalDraft);

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label
          htmlFor="tech-stack-input"
          className="text-base font-semibold text-slate-900 dark:text-slate-100"
        >
          Tech stack
        </label>
        <span className="text-sm font-medium text-slate-400 tabular-nums">
          {value.length}/{MAX_TECH}
        </span>
      </div>

      <div
        className={cn(
          "rounded-xl border border-slate-300 bg-white p-2.5 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-600/15 dark:border-slate-700 dark:bg-slate-900",
        )}
      >
        {value.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1.5">
            <AnimatePresence initial={false}>
              {value.map((tech) => (
                <motion.span
                  key={tech}
                  layout
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => remove(tech)}
                    aria-label={`Remove ${tech}`}
                    className="text-blue-500 transition-colors hover:text-rose-600"
                  >
                    <X className="size-3.5" />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}

        <div className="relative flex items-center gap-2">
          <Search className="size-4 shrink-0 text-slate-400" />
          <input
            id="tech-stack-input"
            ref={inputRef}
            value={draft}
            disabled={full}
            onChange={(event) => {
              setDraft(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            /* A click on a suggestion blurs the input first, so closing is
               deferred past the mousedown that selects it. */
            onBlur={() => window.setTimeout(() => setOpen(false), 120)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault();
                if (draft.trim()) add(draft);
              }
              if (event.key === "Backspace" && !draft && value.length) {
                remove(value[value.length - 1]);
              }
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder={
              full
                ? `Limit of ${MAX_TECH} reached`
                : "Search or add a technology…"
            }
            className="w-full bg-transparent text-base text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:text-slate-200"
          />
        </div>

        {open && !full && (matches.length > 0 || showCustom) && (
          <div className="relative">
            <div className="absolute inset-x-0 top-2 z-20 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-800 dark:bg-slate-900">
              {matches.map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => add(tech)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  {tech}
                  <Plus className="size-3.5" />
                </button>
              ))}

              {showCustom && (
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => add(draft)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 dark:hover:bg-slate-800"
                >
                  Add “{canonicalDraft}”
                  <Plus className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
