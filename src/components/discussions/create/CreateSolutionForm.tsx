"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  AlertCircle,
  Check,
  Circle,
  LoaderCircle,
  Network,
  Send,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/reports/MarkdownEditor";
import { useCreateSolutionMutation } from "@/lib/redux/services/solutionsApi";
import type { ProblemResponse } from "@/lib/redux/services/problemsApi";
import { excerptOf } from "@/lib/markdown-excerpt";
import {
  solutionFormSchema,
  type SolutionFormValues,
} from "@/lib/validations/solution";

/**
 * Answering a problem, on its own page.
 *
 * Laid out like `CreateProblemForm` — numbered cards on the left, a sticky
 * column on the right — because the two are the same kind of task and a writer
 * moving between them should not have to relearn the screen. The right column
 * keeps the problem itself in view, which is the thing being answered.
 */

const CARD_CLASS =
  "rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900";

const CONTROL_CLASS =
  "h-12 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700 dark:bg-slate-900";

const MAX_DESCRIPTION = 20_000;
const MIN_DESCRIPTION = 30;

interface CreateSolutionFormProps {
  problemId: string;
  problem?: ProblemResponse;
  /** Where a posted solution lands the author. Defaults to the problem. */
  successHref?: string;
  cancelHref?: string;
  stickyTop?: string;
}

export function CreateSolutionForm({
  problemId,
  problem,
  successHref,
  cancelHref,
  stickyTop = "1.5rem",
}: CreateSolutionFormProps) {
  const router = useRouter();
  const [createSolution, { isLoading: submitting }] =
    useCreateSolutionMutation();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const back = cancelHref ?? `/community/${problemId}`;
  const done = successHref ?? `/community/${problemId}`;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<SolutionFormValues>({
    resolver: zodResolver(solutionFormSchema),
    defaultValues: { description: "", videoUrl: "", diagramUrl: "" },
  });

  /* `useWatch` rather than `watch()`, matching `CreateProblemForm` — the
     latter returns a function the React Compiler cannot memoize safely. */
  const description = useWatch({ control, name: "description" }) ?? "";
  const videoUrl = useWatch({ control, name: "videoUrl" }) ?? "";
  const diagramUrl = useWatch({ control, name: "diagramUrl" }) ?? "";

  const onSubmit = async (values: SolutionFormValues) => {
    setSubmitError(null);
    try {
      await createSolution({
        problemId,
        body: {
          description: values.description,
          // Empty optional fields are dropped rather than sent as "".
          videoUrl: values.videoUrl?.trim() || undefined,
          diagramUrl: values.diagramUrl?.trim() || undefined,
        },
      }).unwrap();

      toast.success("Solution posted", {
        description: "It now appears under this problem.",
      });
      router.push(done);
    } catch (caught) {
      setSubmitError(
        messageOf(caught, "Your solution could not be posted. Try again."),
      );
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="w-full"
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
        {/* ── The answer ── */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card className={CARD_CLASS} aria-labelledby="solution-body-heading">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 font-mono">
                    01
                  </Badge>
                  <div className="space-y-1">
                    <CardTitle>
                      <h2
                        id="solution-body-heading"
                        className="text-lg font-bold"
                      >
                        Your explanation
                      </h2>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      What fixes it, and why. Steps and code blocks are welcome
                      — markdown is rendered as written.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-2 pt-6">
                <div className="flex items-baseline justify-between gap-3">
                  <Label
                    htmlFor="solution-description"
                    className="text-base font-semibold"
                  >
                    Explanation <span className="text-rose-500">*</span>
                  </Label>
                  <span className="text-sm tabular-nums text-slate-400">
                    {description.length.toLocaleString()}/
                    {MAX_DESCRIPTION.toLocaleString()}
                  </span>
                </div>

                <MarkdownEditor
                  id="solution-description"
                  value={description}
                  onChange={(value) =>
                    setValue("description", value ?? "", {
                      shouldValidate: true,
                    })
                  }
                  placeholder={
                    "Start with the fix, then the reasoning.\n\n```ts\n// the change that mattered\n```"
                  }
                  height={420}
                  maxLength={MAX_DESCRIPTION}
                  error={Boolean(errors.description)}
                  disabled={submitting}
                  required
                  ariaDescribedBy="solution-description-error"
                />

                {errors.description && (
                  <p
                    id="solution-description-error"
                    role="alert"
                    className="text-sm font-medium text-rose-600"
                  >
                    {errors.description.message}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04, ease: "easeOut" }}
          >
            <Card className={CARD_CLASS} aria-labelledby="solution-links-heading">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 font-mono">
                    02
                  </Badge>
                  <div className="space-y-1">
                    <CardTitle>
                      <h2
                        id="solution-links-heading"
                        className="text-lg font-bold"
                      >
                        Supporting links
                      </h2>
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Optional. A recording or a diagram often explains a fix
                      faster than prose can.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid gap-5 pt-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label
                    htmlFor="solution-video"
                    className="flex items-center gap-2 text-base font-semibold"
                  >
                    <Video aria-hidden="true" className="size-4 text-slate-400" />
                    Walkthrough video
                  </Label>
                  <Input
                    id="solution-video"
                    {...register("videoUrl")}
                    placeholder="https://…"
                    disabled={submitting}
                    aria-invalid={Boolean(errors.videoUrl)}
                    className={CONTROL_CLASS}
                  />
                  {errors.videoUrl && (
                    <p role="alert" className="text-sm font-medium text-rose-600">
                      {errors.videoUrl.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="solution-diagram"
                    className="flex items-center gap-2 text-base font-semibold"
                  >
                    <Network
                      aria-hidden="true"
                      className="size-4 text-slate-400"
                    />
                    Diagram
                  </Label>
                  <Input
                    id="solution-diagram"
                    {...register("diagramUrl")}
                    placeholder="https://…"
                    disabled={submitting}
                    aria-invalid={Boolean(errors.diagramUrl)}
                    className={CONTROL_CLASS}
                  />
                  {errors.diagramUrl && (
                    <p role="alert" className="text-sm font-medium text-rose-600">
                      {errors.diagramUrl.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* ── What is being answered, and the actions ── */}
        <aside
          className="flex flex-col gap-5 lg:sticky"
          style={{ top: stickyTop } as React.CSSProperties}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04, ease: "easeOut" }}
          >
            <Card className={CARD_CLASS} aria-labelledby="answering-heading">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle>
                  <h2 id="answering-heading" className="text-lg font-bold">
                    Answering
                  </h2>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-6">
                <Link
                  href={`/community/${problemId}`}
                  className="block text-base font-bold text-slate-900 transition-colors hover:text-blue-600 dark:text-slate-100 dark:hover:text-blue-400"
                >
                  {problem?.title ?? "This problem"}
                </Link>

                {problem?.description && (
                  <p className="line-clamp-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                    {excerptOf(problem.description, 220)}
                  </p>
                )}

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  by{" "}
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {problem?.author?.fullName ?? "Unknown author"}
                  </span>
                </p>

                {(problem?.technologies?.length ||
                  problem?.tags?.length) && (
                  <div className="flex flex-wrap gap-1.5 border-t border-slate-100 pt-3 dark:border-slate-800">
                    {(problem?.technologies ?? []).map((tech, i) => (
                      <span
                        key={tech.id ?? `${tech.name}-${i}`}
                        className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
                      >
                        {tech.name}
                      </span>
                    ))}
                    {(problem?.tags ?? []).map((tag, i) => (
                      <span
                        key={tag.id ?? `${tag.name}-${i}`}
                        className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
          >
            <Card className={CARD_CLASS} aria-labelledby="solution-ready-heading">
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle>
                  <h2 id="solution-ready-heading" className="text-lg font-bold">
                    Before you post
                  </h2>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-2.5 pt-6">
                <RequirementRow
                  label={`Explanation (${MIN_DESCRIPTION}+ characters)`}
                  met={description.trim().length >= MIN_DESCRIPTION}
                />
                <RequirementRow
                  label="Walkthrough video"
                  met={videoUrl.trim().length > 0}
                  optional
                />
                <RequirementRow
                  label="Diagram"
                  met={diagramUrl.trim().length > 0}
                  optional
                />
              </CardContent>

              <CardFooter className="flex flex-col gap-2.5">
                {submitError && (
                  <p
                    role="alert"
                    className="flex w-full items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
                  >
                    <AlertCircle
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0"
                    />
                    {submitError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  disabled={submitting}
                  className="h-11 w-full cursor-pointer rounded-xl bg-emerald-600 font-semibold text-white hover:bg-emerald-700"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle
                        data-icon="inline-start"
                        aria-hidden="true"
                        className="animate-spin motion-reduce:animate-none"
                      />
                      Posting…
                    </>
                  ) : (
                    <>
                      <Send data-icon="inline-start" aria-hidden="true" />
                      Post solution
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={submitting}
                  onClick={() => router.push(back)}
                  className="h-11 w-full cursor-pointer rounded-xl"
                >
                  Cancel
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </aside>
      </div>
    </form>
  );
}

function RequirementRow({
  label,
  met,
  optional = false,
}: {
  label: string;
  met: boolean;
  optional?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
        {met ? (
          <Check className="size-4 text-primary" aria-hidden="true" />
        ) : (
          <Circle className="size-4 text-muted-foreground" aria-hidden="true" />
        )}
        <span className="sr-only">
          {met ? "Complete: " : optional ? "Not added: " : "Incomplete: "}
        </span>
        {label}
      </span>
      {optional && <Badge variant="outline">Optional</Badge>}
    </div>
  );
}

/** Pulls something readable out of an RTK Query error. */
function messageOf(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null && "data" in error) {
    const data = (error as { data?: unknown }).data;
    if (typeof data === "string" && data) return data;
    if (typeof data === "object" && data !== null && "message" in data) {
      const message = (data as { message?: unknown }).message;
      if (typeof message === "string" && message) return message;
    }
  }
  return fallback;
}
