"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { AlertCircle, Check, Loader2, Send } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MarkdownEditor } from "@/components/reports/MarkdownEditor";
import { ACCENT, PRIMARY } from "@/components/landing/SectionBackdrop";
import { ImageDropField } from "./ImageDropField";
import { TechStackField } from "./TechStackField";
import { BuildStepsField, createEmptyStep } from "./BuildStepsField";
import { ProjectLinksField } from "./ProjectLinksField";
import { ResourceLinksField } from "./ResourceLinksField";
import { useGetActiveCategoriesQuery } from "@/lib/redux/services/categoriesApi";
import {
  useCreateShowcaseMutation,
  useCreateShowcaseStepMutation,
  useUploadShowcaseCoverMutation,
  useUploadShowcaseStepDiagramMutation,
  useUploadShowcaseStepImageMutation,
} from "@/lib/redux/services/showcasesApi";
import {
  createShowcaseSchema,
  type CreateShowcaseFormValues,
  type CreateShowcaseSubmitValues,
} from "@/lib/validations/showcase";
import { cn } from "@/lib/utils";

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

/* ─── Surface ────────────────────────────────────────────────────────────
   The landing sections carry their cards on a hairline ring plus a low
   shadow rather than a border, and lift both toward brand blue on hover.
   Reusing that treatment is most of what ties this form to the home page;
   here the lift is on `focus-within`, so the card being typed into is the
   one that stands up. */
const CARD =
  "rounded-2xl bg-white shadow-[0_0_0_1px_rgba(30,41,59,0.08),0_2px_10px_rgba(30,41,59,0.05)] transition-shadow dark:bg-slate-900 dark:shadow-[0_0_0_1px_rgba(148,163,184,0.14),0_2px_10px_rgba(2,6,23,0.5)]";

const CARD_ACTIVE =
  "focus-within:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_10px_28px_-14px_rgba(30,41,59,0.35)] dark:focus-within:shadow-[0_0_0_1px_rgba(96,165,250,0.45),0_10px_28px_-14px_rgba(2,6,23,0.7)]";

interface FormSectionProps {
  n: string;
  title: string;
  description?: string;
  /** Ticks the step marker once everything required in the section is filled. */
  done?: boolean;
  /** Nothing in the section is required, so it never shows an unfilled marker. */
  optional?: boolean;
  delay?: number;
  children: React.ReactNode;
}

function FormSection({
  n,
  title,
  description,
  done = false,
  optional = false,
  delay = 0,
  children,
}: FormSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(CARD, CARD_ACTIVE, "p-5 sm:p-6")}
    >
      <header className="mb-5 flex items-start gap-3.5 border-b border-slate-100 pb-4 dark:border-slate-800">
        <span
          aria-hidden
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold tabular-nums transition-colors duration-300",
            done
              ? "bg-emerald-500 text-white"
              : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
          )}
        >
          {done ? <Check className="size-4.5" /> : n}
        </span>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {title}
            </h2>
            {optional && (
              <span className="rounded-full border border-slate-200 px-2 py-0.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-400 dark:border-slate-700 dark:text-slate-500">
                Optional
              </span>
            )}
          </div>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {description}
            </p>
          )}
        </div>
      </header>

      {children}
    </motion.section>
  );
}

/* ─── Readiness ──────────────────────────────────────────────────────────
   A long form hides how much of it is actually required. This says so up
   front and keeps saying it while you type, so nobody discovers the missing
   cover image by pressing Publish. */

type Requirement = { label: string; done: boolean; hint?: string };

function RequirementRow({ label, done, hint }: Requirement) {
  return (
    <li className="flex items-start gap-2.5">
      <motion.span
        aria-hidden
        animate={{ scale: done ? [1, 1.18, 1] : 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={cn(
          "mt-px flex size-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
          done
            ? "bg-emerald-500 text-white"
            : "border-2 border-dashed border-slate-300 dark:border-slate-700",
        )}
      >
        {done && <Check className="size-3" strokeWidth={3.5} />}
      </motion.span>

      <span className="min-w-0">
        <span
          className={cn(
            "block text-sm font-semibold transition-colors",
            done
              ? "text-slate-400 line-through decoration-slate-300 dark:text-slate-500"
              : "text-slate-700 dark:text-slate-200",
          )}
        >
          {label}
        </span>
        {hint && (
          <span className="block text-sm text-slate-400 dark:text-slate-500">
            {hint}
          </span>
        )}
      </span>
    </li>
  );
}

/** What one step of a publish attempt got through, for resuming after a failure. */
type StepProgress = { id: string; imageDone: boolean; diagramDone: boolean };

interface CreateShowcaseFormProps {
  /** Where to land after a successful publish. */
  successHref?: string;
  cancelHref?: string;
  /**
   * Offset the sticky sidebar parks at, which depends on what it sticks
   * against. The dashboard scrolls inside a `<main>` that already starts
   * below its header, so the default is a plain gap; a public page sticks
   * against the viewport and has to clear the fixed navbar itself.
   */
  stickyTop?: string;
}

export function CreateShowcaseForm({
  successHref = "/showcases",
  cancelHref = "/showcases",
  stickyTop = "1.5rem",
}: CreateShowcaseFormProps) {
  const router = useRouter();
  const { data: categories = [], isLoading: loadingCategories } =
    useGetActiveCategoriesQuery("SHOWCASE");
  const [createShowcase] = useCreateShowcaseMutation();
  const [createStep] = useCreateShowcaseStepMutation();
  const [uploadCover] = useUploadShowcaseCoverMutation();
  const [uploadStepImage] = useUploadShowcaseStepImageMutation();
  const [uploadStepDiagram] = useUploadShowcaseStepDiagramMutation();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  /** Drives the cover field's own overlay, which `submitting` is too coarse for. */
  const [uploadingCover, setUploadingCover] = useState(false);

  /**
   * Publishing is a sequence, not one request: the showcase, its cover image,
   * then each step followed by that step's own images. Every image route is
   * scoped to a row that has to exist first, and the API offers no bulk
   * variant or transaction.
   *
   * This remembers exactly what landed, so retrying after a failure resumes
   * rather than creating a second showcase or a duplicate step. Steps are keyed
   * by their stable form key rather than by position: an author who reorders or
   * deletes a step between attempts would otherwise have the next attempt
   * attach an image to whichever step slid into that slot.
   */
  const progress = useRef<{
    showcaseId: string | null;
    coverDone: boolean;
    steps: Record<string, StepProgress>;
  }>({ showcaseId: null, coverDone: false, steps: {} });

  const methods = useForm<
    CreateShowcaseFormValues,
    unknown,
    CreateShowcaseSubmitValues
  >({
    resolver: zodResolver(createShowcaseSchema),
    mode: "onBlur",
    defaultValues: {
      coverImageUrl: "",
      title: "",
      categoryId: "",
      overview: "",
      techStack: [],
      steps: [createEmptyStep()],
      repoUrl: "",
      liveUrl: "",
      videoUrl: "",
      resourceLinks: [],
    },
  });

  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = methods;

  /* `useWatch` rather than `watch`: the latter returns a fresh function every
     render, which the React Compiler cannot memoize around. */
  const title = useWatch({ control, name: "title" }) ?? "";
  const overview = useWatch({ control, name: "overview" }) ?? "";
  const coverImageUrl = useWatch({ control, name: "coverImageUrl" }) ?? "";
  const coverImageFile = useWatch({ control, name: "coverImageFile" });
  const categoryId = useWatch({ control, name: "categoryId" }) ?? "";
  const steps = useWatch({ control, name: "steps" }) ?? [];

  /* A step only counts once it carries both of the fields the schema demands
     — a titled step with an empty body would fail validation at submit.
     Left unmemoized on purpose: a guide is a handful of entries, and the
     `?? []` above hands `useMemo` a fresh array every render anyway. */
  const readySteps = steps.filter(
    (step) => step?.title?.trim() && step?.description?.trim(),
  ).length;

  /* Every step has to be complete, not just one: the schema validates each
     entry in the array, so a half-filled step 3 fails the publish exactly
     the way an empty guide would. */
  const guideDone = steps.length > 0 && readySteps === steps.length;

  /* Either half of the cover control satisfies the requirement — see the
     schema's refine, which is what actually gates the publish. */
  const coverReady = coverImageUrl.trim().length > 0 || Boolean(coverImageFile);

  const requirements: Requirement[] = [
    { label: "Cover image", done: coverReady },
    { label: "Project title", done: title.trim().length > 0 },
    { label: "Overview", done: overview.trim().length > 0 },
    { label: "Category", done: categoryId.length > 0 },
    {
      label: "Build guide",
      done: guideDone,
      hint:
        steps.length > 0
          ? `${readySteps} of ${steps.length} ${steps.length === 1 ? "step" : "steps"} complete`
          : "Add at least one step",
    },
  ];

  const metCount = requirements.filter((r) => r.done).length;
  const ready = metCount === requirements.length;
  const projectSectionDone =
    coverReady && title.trim().length > 0 && overview.trim().length > 0;

  /* Only after a submit attempt — nagging about incomplete fields on a form
     nobody has tried to send yet is noise. */
  const blocked = isSubmitted && Object.keys(errors).length > 0;

  const onSubmit = async (values: CreateShowcaseSubmitValues) => {
    setSubmitting(true);
    setSubmitError(null);

    /* Named so a failure can say which request it was, since the sequence
       below spans several of them. */
    let stage = "The showcase could not be created.";

    try {
      if (!progress.current.showcaseId) {
        const showcase = await createShowcase({
          categoryId: values.categoryId,
          title: values.title,
          overview: values.overview,
          /* A pasted URL travels in the body; a chosen file goes to the
             cover-image route below, once there is an id to put it against. */
          coverImageUrl: values.coverImageUrl || undefined,
          repoUrl: values.repoUrl || undefined,
          liveUrl: values.liveUrl || undefined,
          videoUrl: values.videoUrl || undefined,
        }).unwrap();

        progress.current.showcaseId = showcase.id;
      }

      const showcaseId = progress.current.showcaseId;

      if (values.coverImageFile && !progress.current.coverDone) {
        stage =
          "Your showcase was created, but the cover image could not be uploaded. Publishing again retries just that.";
        setUploadingCover(true);
        try {
          await uploadCover({
            id: showcaseId,
            file: values.coverImageFile,
          }).unwrap();
        } finally {
          setUploadingCover(false);
        }
        progress.current.coverDone = true;
      }

      /* Sequential, not Promise.all: `stepNumber` carries the order, and each
         step's images can only be sent after that step exists. */
      for (let i = 0; i < values.steps.length; i++) {
        const step = values.steps[i];
        stage = `Step ${i + 1} could not be saved. Your showcase was created — publishing again resumes from there.`;

        let posted = progress.current.steps[step.key];
        if (!posted) {
          const created = await createStep({
            showcaseId,
            body: {
              stepNumber: i + 1,
              title: step.title,
              description: step.description,
              codeSnippet: step.codeSnippet || undefined,
              imageUrl: step.imageUrl || undefined,
              diagramUrl: step.diagramUrl || undefined,
            },
          }).unwrap();

          posted = {
            id: created.id,
            imageDone: !step.imageFile,
            diagramDone: !step.diagramFile,
          };
          progress.current.steps[step.key] = posted;
        }

        if (step.imageFile && !posted.imageDone) {
          stage = `The screenshot on step ${i + 1} could not be uploaded. Publishing again retries from there.`;
          await uploadStepImage({
            showcaseId,
            stepId: posted.id,
            file: step.imageFile,
          }).unwrap();
          posted.imageDone = true;
        }

        if (step.diagramFile && !posted.diagramDone) {
          stage = `The diagram on step ${i + 1} could not be uploaded. Publishing again retries from there.`;
          await uploadStepDiagram({
            showcaseId,
            stepId: posted.id,
            file: step.diagramFile,
          }).unwrap();
          posted.diagramDone = true;
        }
      }

      router.push(successHref);
    } catch (error) {
      setSubmitError(messageOf(error, stage));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      {/* `handleSubmit` is bound inside the event handler rather than during
          render, so the resume ref `onSubmit` closes over is only ever read
          on submit. */}
      <form
        onSubmit={(event) => void handleSubmit(onSubmit)(event)}
        className="w-full"
      >
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {/* ── Main column ── */}
          <div className="space-y-6 lg:col-span-2">
            <FormSection
              n="01"
              title="The project"
              description="What it is, and the first thing anyone will see."
              done={projectSectionDone}
            >
              <div className="space-y-6">
                {/* Two fields behind one control: a pasted URL lands in
                    `coverImageUrl`, a chosen file waits in `coverImageFile`
                    until the showcase exists to hang it off. */}
                <ImageDropField
                  label="Cover image"
                  hint="PNG, JPG or WebP · up to 5MB · shown at 16:9"
                  aspectClassName="aspect-video"
                  value={coverImageUrl}
                  onChange={(url) =>
                    setValue("coverImageUrl", url, { shouldValidate: true })
                  }
                  file={coverImageFile ?? null}
                  onFileChange={(next) =>
                    setValue("coverImageFile", next ?? undefined, {
                      shouldValidate: true,
                    })
                  }
                  uploading={uploadingCover}
                  error={errors.coverImageUrl?.message}
                />

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <label
                      htmlFor="showcase-title"
                      className="text-base font-semibold text-slate-900 dark:text-slate-100"
                    >
                      Project title
                    </label>
                    <span className="text-sm font-medium text-slate-400 tabular-nums">
                      {title.length}/255
                    </span>
                  </div>
                  <Input
                    id="showcase-title"
                    maxLength={255}
                    placeholder="e.g. A self-hosted OAuth gateway with per-tenant key rotation"
                    {...register("title")}
                    className="h-12 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
                  />
                  {errors.title?.message && (
                    <p className="text-sm font-medium text-rose-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <label className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      Overview
                    </label>
                    <span className="text-sm text-slate-400">
                      Two to four sentences reads best
                    </span>
                  </div>
                  <MarkdownEditor
                    value={overview}
                    onChange={(next) =>
                      setValue("overview", next ?? "", { shouldValidate: true })
                    }
                    placeholder="What the project does, why you built it, and what makes it worth a look. This doubles as the excerpt on the showcase index."
                    height={260}
                    error={Boolean(errors.overview)}
                  />
                  {errors.overview?.message && (
                    <p className="text-sm font-medium text-rose-600">
                      {errors.overview.message}
                    </p>
                  )}
                </div>
              </div>
            </FormSection>

            <FormSection
              n="02"
              title="Build guide"
              description="The part people come for. Number them by order, not by hand."
              done={guideDone}
              delay={0.08}
            >
              <BuildStepsField />
            </FormSection>

            <FormSection
              n="03"
              title="Links"
              description="Where the code, the demo, and the supporting material live."
              optional
              delay={0.16}
            >
              <div className="space-y-6">
                <ProjectLinksField />

                <div className="space-y-2 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Resource links
                  </h3>
                  <p className="pb-1 text-sm text-slate-500 dark:text-slate-400">
                    Figma files, API docs, a Postman collection — anything that
                    lives elsewhere.
                  </p>
                  <ResourceLinksField />
                </div>
              </div>
            </FormSection>
          </div>

          {/* ── Sidebar ──
              Category sits above Publish deliberately: it is a required field
              that lives out here, and burying it under the button is how it
              gets missed. */}
          <aside
            className="space-y-5 lg:sticky"
            style={{ top: stickyTop } as React.CSSProperties}
          >
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(CARD, CARD_ACTIVE, "space-y-5 p-5")}
            >
              <div className="space-y-2">
                <label
                  htmlFor="showcase-category"
                  className="text-base font-semibold text-slate-900 dark:text-slate-100"
                >
                  Category
                </label>

                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value || undefined}
                      onValueChange={field.onChange}
                      disabled={loadingCategories}
                    >
                      <SelectTrigger
                        id="showcase-category"
                        className="h-12 w-full rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
                      >
                        <SelectValue
                          placeholder={
                            loadingCategories
                              ? "Loading categories…"
                              : "Choose a category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 bg-white p-1">
                        {/* The value is the id, not the name: `categoryId` is
                            a UUID upstream and the proxy rejects anything
                            else. */}
                        {categories.map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.id}
                            className="cursor-pointer rounded-lg py-2.5 text-base font-medium"
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {errors.categoryId?.message && (
                  <p className="text-sm font-medium text-rose-600">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                <Controller
                  control={control}
                  name="techStack"
                  render={({ field }) => (
                    <TechStackField
                      value={field.value ?? []}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(CARD, "p-5")}
            >
              {/* The landing page's eyebrow rule, so the panel reads as part
                  of the same system as the sections behind it. */}
              <div className="mb-3 flex items-center gap-2.5">
                <span className="h-px w-6 bg-slate-900 dark:bg-slate-100" />
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-slate-900 dark:text-slate-100">
                  Publish
                </span>
              </div>

              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {ready ? "Everything's in place." : "Still needed"}
                </p>
                <span className="text-sm font-bold text-slate-900 tabular-nums dark:text-slate-100">
                  {metCount}/{requirements.length}
                </span>
              </div>

              {/* Blue→green, the same ramp the landing page's lifecycle rail
                  runs on: in progress on the left, done on the right. */}
              <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: `linear-gradient(to right, ${PRIMARY}, ${ACCENT})`,
                  }}
                  initial={false}
                  animate={{
                    width: `${(metCount / requirements.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>

              <ul className="mt-4 space-y-2.5">
                {requirements.map((requirement) => (
                  <RequirementRow key={requirement.label} {...requirement} />
                ))}
              </ul>

              {blocked && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-800 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-200"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>
                    Publishing is blocked — the highlighted fields need
                    attention.
                  </span>
                </motion.div>
              )}

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700 dark:border-rose-500/25 dark:bg-rose-500/10 dark:text-rose-200"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{submitError}</span>
                </motion.div>
              )}

              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
                {/* The hero's pill and its brand glow. Never disabled on an
                    incomplete form — the field-level errors are what explain
                    the problem, and a dead button explains nothing. */}
                <motion.div
                  whileHover={submitting ? undefined : { y: -2 }}
                  whileTap={submitting ? undefined : { y: 0, scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    disabled={submitting}
                    style={{
                      backgroundColor: PRIMARY,
                      boxShadow: "0 14px 30px -12px rgba(37,99,235,0.85)",
                    }}
                    className="h-12 w-full rounded-full text-base font-bold text-white transition-[filter] hover:brightness-110"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-5 animate-spin" />
                        Publishing…
                      </>
                    ) : (
                      <>
                        <Send className="size-4.5" />
                        Publish showcase
                      </>
                    )}
                  </Button>
                </motion.div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(cancelHref)}
                  className="h-11 w-full rounded-full border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </Button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                Showcases are published for review before they appear on the
                index.
              </p>
            </motion.section>
          </aside>
        </div>
      </form>
    </FormProvider>
  );
}
