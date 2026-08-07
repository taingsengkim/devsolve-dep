"use client";

import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  Copy,
  GripVertical,
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Build guide
          </h3>
          <p className="text-sm text-slate-500">
            Walk through how it was built. At least one step is required.
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-blue-50 px-2.5 py-1 text-sm font-semibold text-blue-700 tabular-nums dark:bg-blue-950/50 dark:text-blue-300">
          {fields.length} {fields.length === 1 ? "step" : "steps"}
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
                  : "border-slate-200 dark:border-slate-800",
              )}
            >
              {/* ── Card header ── */}
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-sm font-bold text-white tabular-nums dark:bg-slate-700">
                  {index + 1}
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
                    <GripVertical className="hidden size-4 text-slate-300 sm:block" />
                  ) : null}
                  {step?.imageUrl ? (
                    <ImageIcon className="size-4 text-slate-400" />
                  ) : null}
                  {step?.diagramUrl ? (
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
