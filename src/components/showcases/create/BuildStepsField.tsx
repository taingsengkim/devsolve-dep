"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  ChevronDown,
  Code2,
  Copy,
  ImageIcon,
  Network,
  Plus,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/reports/MarkdownEditor";
import { CodeSnippetField } from "./CodeSnippetField";
import { ImageDropField } from "./ImageDropField";
import type { CreateShowcaseFormValues } from "@/lib/validations/showcase";
import { cn } from "@/lib/utils";

/** A stable key for React and for tracking which cards are open. */
const newKey = () =>
  `step-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

export const createEmptyStep = () => ({
  key: newKey(),
  title: "",
  description: "",
  codeSnippet: "",
  codeLanguage: "typescript",
  imageUrl: "",
  diagramUrl: "",
  /* Chosen files wait here: their upload routes are scoped to a step that has
     to exist first, so the publish sequence sends them. */
  imageFile: undefined,
  diagramFile: undefined,
});

/**
 * The build guide. Steps are numbered from list position — the author never
 * types a number, so deleting or duplicating can't leave 1, 2, 4 behind.
 * Cards start collapsed because a ten-step guide is unreadable otherwise.
 */
export function BuildStepsField() {
  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateShowcaseFormValues>();

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: "steps",
  });

  /* Tracked by each step's own `key`, not by array index or RHF's row id:
     index shifts when a step is deleted, which would leave the open set
     pointing at whichever card slid into that slot. Only the first card is
     open on mount; anything the author just created opens itself. */
  const [open, setOpen] = useState<string[]>(() =>
    fields.length ? [fields[0].key] : [],
  );

  const toggle = (key: string) =>
    setOpen((current) =>
      current.includes(key)
        ? current.filter((value) => value !== key)
        : [...current, key],
    );

  const addStep = () => {
    const step = createEmptyStep();
    append(step);
    setOpen((current) => [...current, step.key]);
  };

  const duplicateStep = (index: number) => {
    const source = watch(`steps.${index}`);
    const copy = {
      ...source,
      key: newKey(),
      title: `${source.title} (copy)`,
    };
    insert(index + 1, copy);
    setOpen((current) => [...current, copy.key]);
  };

  const steps = watch("steps") ?? [];
  const stepErrors = errors.steps;

  /* Only a step carrying both a title and a body satisfies the schema, so
     that is what the marker reports — a numbered tile that has not turned
     green is a step that will fail at publish. */
  const readyCount = steps.filter(
    (step) => step?.title?.trim() && step?.description?.trim(),
  ).length;

  return (
    <div className="space-y-4">
      {/* The section header above already names this, so the toolbar carries
          progress instead of repeating the title. */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Walk through how it was built. At least one step is required.
        </p>
        <span
          className={cn(
            "shrink-0 rounded-lg px-2.5 py-1 text-sm font-semibold tabular-nums transition-colors",
            readyCount === fields.length
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300"
              : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
          )}
        >
          {readyCount}/{fields.length} ready
        </span>
      </div>

      {typeof stepErrors?.message === "string" && (
        <p className="text-sm font-medium text-rose-600">{stepErrors.message}</p>
      )}

      <div className="space-y-3">
        {fields.map((field, index) => {
          const isOpen = open.includes(field.key);
          const step = steps[index];
          const rowError = Array.isArray(stepErrors)
            ? stepErrors[index]
            : undefined;
          const isReady = Boolean(
            step?.title?.trim() && step?.description?.trim(),
          );

          return (
            <motion.div
              key={field.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "overflow-hidden rounded-xl border bg-white transition-colors dark:bg-slate-900",
                rowError
                  ? "border-rose-300 dark:border-rose-900"
                  : isOpen
                    ? "border-blue-300 dark:border-blue-500/40"
                    : "border-slate-200 dark:border-slate-800",
              )}
            >
              {/* ── Card header ── */}
              <div className="flex items-center gap-3 p-3 sm:p-4">
                {/* The number is the step's identity and stays put — the tick
                    rides alongside it rather than replacing it. */}
                <span className="relative shrink-0">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg text-sm font-bold text-white tabular-nums transition-colors duration-300",
                      isReady
                        ? "bg-emerald-500"
                        : "bg-slate-900 dark:bg-slate-700",
                    )}
                  >
                    {index + 1}
                  </span>

                  {isReady && (
                    <motion.span
                      aria-hidden
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 22 }}
                      className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-white text-emerald-600 ring-1 ring-emerald-500/30 dark:bg-slate-900"
                    >
                      <Check className="size-2.5" strokeWidth={4} />
                    </motion.span>
                  )}
                </span>

                <button
                  type="button"
                  onClick={() => toggle(field.key)}
                  className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  aria-expanded={isOpen}
                >
                  <span
                    className={cn(
                      "truncate text-base font-semibold",
                      step?.title
                        ? "text-slate-900 dark:text-slate-100"
                        : "text-slate-400",
                    )}
                  >
                    {step?.title || "Untitled step"}
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-slate-400 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                </button>

                <div className="flex shrink-0 items-center gap-0.5">
                  {/* Attachment hints, so a collapsed card still says what it holds */}
                  {step?.codeSnippet ? (
                    <Code2 className="hidden size-4 text-slate-400 sm:block" />
                  ) : null}
                  {step?.imageUrl || step?.imageFile ? (
                    <ImageIcon className="size-4 text-slate-400" />
                  ) : null}
                  {step?.diagramUrl || step?.diagramFile ? (
                    <Network className="size-4 text-slate-400" />
                  ) : null}

                  <button
                    type="button"
                    onClick={() => duplicateStep(index)}
                    aria-label={`Duplicate step ${index + 1}`}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                  >
                    <Copy className="size-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length <= 1}
                    aria-label={`Delete step ${index + 1}`}
                    className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* ── Card body ── */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                  >
                    <div className="space-y-5 border-t border-slate-100 p-4 dark:border-slate-800 sm:p-5">
                      <div className="space-y-2">
                        <label
                          htmlFor={`step-title-${field.id}`}
                          className="text-sm font-semibold text-slate-900 dark:text-slate-100"
                        >
                          Step title
                        </label>
                        <Input
                          id={`step-title-${field.id}`}
                          maxLength={255}
                          placeholder="e.g. Wire the OAuth callback"
                          {...register(`steps.${index}.title`)}
                          className="h-11 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
                        />
                        {rowError?.title?.message && (
                          <p className="text-sm font-medium text-rose-600">
                            {rowError.title.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          Description
                        </label>
                        <MarkdownEditor
                          value={step?.description ?? ""}
                          onChange={(next) =>
                            setValue(`steps.${index}.description`, next ?? "", {
                              shouldValidate: true,
                            })
                          }
                          placeholder="What happens in this step, and why?"
                          height={220}
                          error={Boolean(rowError?.description)}
                        />
                        {rowError?.description?.message && (
                          <p className="text-sm font-medium text-rose-600">
                            {rowError.description.message}
                          </p>
                        )}
                      </div>

                      <CodeSnippetField
                        value={step?.codeSnippet ?? ""}
                        language={step?.codeLanguage ?? "typescript"}
                        onChange={(next) =>
                          setValue(`steps.${index}.codeSnippet`, next)
                        }
                        onLanguageChange={(next) =>
                          setValue(`steps.${index}.codeLanguage`, next)
                        }
                      />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <ImageDropField
                          compact
                          label="Screenshot"
                          hint="Optional · PNG, JPG or WebP"
                          aspectClassName="aspect-video"
                          value={step?.imageUrl}
                          onChange={(url) =>
                            setValue(`steps.${index}.imageUrl`, url)
                          }
                          file={step?.imageFile ?? null}
                          onFileChange={(next) =>
                            setValue(`steps.${index}.imageFile`, next ?? undefined)
                          }
                        />
                        <ImageDropField
                          compact
                          label="Diagram"
                          hint="Optional · architecture or flow"
                          aspectClassName="aspect-video"
                          value={step?.diagramUrl}
                          onChange={(url) =>
                            setValue(`steps.${index}.diagramUrl`, url)
                          }
                          file={step?.diagramFile ?? null}
                          onFileChange={(next) =>
                            setValue(
                              `steps.${index}.diagramFile`,
                              next ?? undefined,
                            )
                          }
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={addStep}
        className="h-12 w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 text-base font-semibold text-slate-600 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900/60"
      >
        <Plus className="size-4" />
        Add step
      </Button>
    </div>
  );
}
