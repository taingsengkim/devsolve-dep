"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { AlertCircle, Loader2, Send } from "lucide-react";
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
import { ImageDropField } from "./ImageDropField";
import { TechStackField } from "./TechStackField";
import { BuildStepsField, createEmptyStep } from "./BuildStepsField";
import { ProjectLinksField } from "./ProjectLinksField";
import { ResourceLinksField } from "./ResourceLinksField";
import { useGetActiveCategoriesQuery } from "@/lib/redux/services/categoriesApi";
import {
  useCreateShowcaseMutation,
  useCreateShowcaseStepMutation,
} from "@/lib/redux/services/showcasesApi";
import {
  createShowcaseSchema,
  type CreateShowcaseFormValues,
  type CreateShowcaseSubmitValues,
} from "@/lib/validations/showcase";

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

interface FormSectionProps {
  n: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}

function FormSection({ n, title, description, children }: FormSectionProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <header className="mb-5 flex items-baseline gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <span className="font-mono text-sm font-bold text-slate-300 tabular-nums dark:text-slate-700">
          {n}
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          {description && (
            <p className="mt-0.5 text-sm text-slate-500">{description}</p>
          )}
        </div>
      </header>
      {children}
    </section>
  );
}

interface CreateShowcaseFormProps {
  /** Where to land after a successful publish. */
  successHref?: string;
  cancelHref?: string;
}

export function CreateShowcaseForm({
  successHref = "/showcases",
  cancelHref = "/showcases",
}: CreateShowcaseFormProps) {
  const router = useRouter();
  const { data: categories = [], isLoading: loadingCategories } =
    useGetActiveCategoriesQuery("SHOWCASE");
  const [createShowcase] = useCreateShowcaseMutation();
  const [createStep] = useCreateShowcaseStepMutation();

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Publishing takes two kinds of request — the showcase, then one per step —
   * and the API offers no bulk variant or transaction. This remembers how far
   * a failed attempt got, so retrying resumes instead of creating a second
   * showcase and re-posting steps that already landed.
   */
  const progress = useRef<{ showcaseId: string | null; postedSteps: number }>({
    showcaseId: null,
    postedSteps: 0,
  });

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
    formState: { errors },
  } = methods;

  /* `useWatch` rather than `watch`: the latter returns a fresh function every
     render, which the React Compiler cannot memoize around. */
  const title = useWatch({ control, name: "title" }) ?? "";
  const overview = useWatch({ control, name: "overview" }) ?? "";

  const onSubmit = async (values: CreateShowcaseSubmitValues) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      if (!progress.current.showcaseId) {
        const showcase = await createShowcase({
          categoryId: values.categoryId,
          title: values.title,
          overview: values.overview,
          coverImageUrl: values.coverImageUrl,
          repoUrl: values.repoUrl || undefined,
          liveUrl: values.liveUrl || undefined,
          videoUrl: values.videoUrl || undefined,
        }).unwrap();

        progress.current.showcaseId = showcase.id;
      }

      const showcaseId = progress.current.showcaseId;

      /* Sequential, not Promise.all: `stepNumber` carries the order and the
         resume counter below is only meaningful if they land in sequence. */
      for (let i = progress.current.postedSteps; i < values.steps.length; i++) {
        const step = values.steps[i];
        await createStep({
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

        progress.current.postedSteps = i + 1;
      }

      router.push(successHref);
    } catch (error) {
      const where = progress.current.showcaseId
        ? `Step ${progress.current.postedSteps + 1} could not be saved. Your showcase was created — publishing again resumes from that step.`
        : "The showcase could not be created.";

      setSubmitError(messageOf(error, where));
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
            >
              <div className="space-y-6">
                <Controller
                  control={control}
                  name="coverImageUrl"
                  render={({ field }) => (
                    <ImageDropField
                      label="Cover image"
                      hint="PNG, JPG or WebP · up to 5MB · shown at 16:9"
                      aspectClassName="aspect-video"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.coverImageUrl?.message}
                    />
                  )}
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
            >
              <BuildStepsField />
            </FormSection>

            <FormSection
              n="03"
              title="Links"
              description="Where the code, the demo, and the supporting material live."
            >
              <div className="space-y-6">
                <ProjectLinksField />

                <div className="space-y-2 border-t border-slate-100 pt-5 dark:border-slate-800">
                  <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Resource links
                  </h3>
                  <p className="pb-1 text-sm text-slate-500">
                    Figma files, API docs, a Postman collection — anything that
                    lives elsewhere.
                  </p>
                  <ResourceLinksField />
                </div>
              </div>
            </FormSection>
          </div>

          {/* ── Sidebar ── */}
          <aside className="space-y-6 lg:sticky lg:top-6">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <h2 className="mb-4 text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Publish
              </h2>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm font-medium text-rose-700"
                >
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <span>{submitError}</span>
                </motion.div>
              )}

              <div className="space-y-2.5">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 w-full rounded-xl bg-blue-600 text-base font-bold text-white shadow-md hover:bg-blue-700"
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

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(cancelHref)}
                  className="h-11 w-full rounded-xl border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900"
                >
                  Cancel
                </Button>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Showcases are published for review before they appear on the
                index.
              </p>
            </section>

            <section className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
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
            </section>
          </aside>
        </div>
      </form>
    </FormProvider>
  );
}
