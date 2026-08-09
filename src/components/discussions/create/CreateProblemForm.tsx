"use client";

import React, { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Controller,
  type FieldPath,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Check,
  Circle,
  LoaderCircle,
  Plus,
  Send,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import type * as z from "zod";
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownEditor } from "@/components/reports/MarkdownEditor";
import { parseApiError } from "@/lib/api/errors";
import { useGetActiveCategoriesQuery } from "@/lib/redux/services/categoriesApi";
import { useCreateProblemMutation } from "@/lib/redux/services/problemsApi";
import {
  createProblemFormSchema,
  SDLC_LABELS,
  SDLC_PHASES,
} from "@/lib/validations/problem";
import { cn } from "@/lib/utils";

type ProblemFormInput = z.input<typeof createProblemFormSchema>;
type ProblemFormValues = z.output<typeof createProblemFormSchema>;

const MAX_TECHNOLOGIES = 20;
const MAX_TAGS = 10;

const SDLC_ITEMS = SDLC_PHASES.map((value) => ({
  value,
  label: SDLC_LABELS[value],
}));

const SDLC_SELECT_ITEMS = [
  { value: null, label: "Not specified" },
  ...SDLC_ITEMS,
];

const CARD_CLASS =
  "rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900";

const CONTROL_CLASS =
  "h-12 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700 dark:bg-slate-900";

const SERVER_FIELDS = new Set([
  "categoryId",
  "title",
  "sdlcPhase",
  "description",
  "technologies",
  "tags",
]);

function serverFieldPath(field: string): FieldPath<ProblemFormInput> | null {
  const normalized = field.replace(/\[(\d+)\]/g, ".$1");

  if (SERVER_FIELDS.has(normalized)) {
    return normalized as FieldPath<ProblemFormInput>;
  }
  if (/^technologies\.\d+\.(name|version)$/.test(normalized)) {
    return normalized as FieldPath<ProblemFormInput>;
  }
  if (/^tags\.\d+$/.test(normalized)) {
    return "tags";
  }

  return null;
}

interface CreateProblemFormProps {
  successHref?: string;
  cancelHref?: string;
  stickyTop?: string;
}

export function CreateProblemForm({
  successHref = "/dashboard/my-community",
  cancelHref = "/community/create",
  stickyTop = "1.5rem",
}: CreateProblemFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tagDraft, setTagDraft] = useState("");
  const [tagDraftError, setTagDraftError] = useState<string | null>(null);

  const {
    data: categories = [],
    isLoading: loadingCategories,
    isError: categoriesFailed,
  } = useGetActiveCategoriesQuery("PROBLEM");
  const [createProblem, { isLoading: mutationLoading }] =
    useCreateProblemMutation();

  const categoryItems = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories],
  );
  const categorySelectItems = useMemo(
    () => [
      {
        value: null,
        label: loadingCategories
          ? "Loading categories…"
          : categoryItems.length === 0
            ? "No categories available"
            : "No category",
      },
      ...categoryItems,
    ],
    [categoryItems, loadingCategories],
  );

  const {
    control,
    register,
    setError,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProblemFormInput, unknown, ProblemFormValues>({
    resolver: zodResolver(createProblemFormSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      description: "",
      technologies: [],
      tags: [],
    },
  });

  const {
    fields: technologyFields,
    append: appendTechnology,
    remove: removeTechnology,
  } = useFieldArray({ control, name: "technologies" });

  const title = useWatch({ control, name: "title" }) ?? "";
  const description = useWatch({ control, name: "description" }) ?? "";
  const categoryId = useWatch({ control, name: "categoryId" });
  const sdlcPhase = useWatch({ control, name: "sdlcPhase" });
  const technologies = useWatch({ control, name: "technologies" }) ?? [];
  const tags = useWatch({ control, name: "tags" }) ?? [];

  const submitting = isSubmitting || mutationLoading;
  const titleLength = title.trim().length;
  const descriptionLength = description.trim().length;
  const titleReady = titleLength >= 10 && titleLength <= 180;
  const descriptionReady =
    descriptionLength >= 20 && descriptionLength <= 20_000;
  const technologiesReady = technologies.every(
    (technology) =>
      technology.name.trim().length >= 1 &&
      technology.name.trim().length <= 100 &&
      (technology.version?.trim().length ?? 0) <= 50,
  );
  const normalizedPendingTag = tagDraft.trim().replace(/^#+/, "");
  const pendingTagLength = normalizedPendingTag.length;
  const pendingTagAddsNewValue =
    pendingTagLength > 0 &&
    !tags.some(
      (tag) => tag.toLowerCase() === normalizedPendingTag.toLowerCase(),
    );
  const tagsReady =
    !tagDraftError &&
    pendingTagLength <= 50 &&
    tags.length + (pendingTagAddsNewValue ? 1 : 0) <= MAX_TAGS;
  const formReady =
    titleReady && descriptionReady && technologiesReady && tagsReady;

  const addTag = () => {
    const tag = tagDraft.trim().replace(/^#+/, "");

    if (!tag) return;
    if (tags.length >= MAX_TAGS) {
      setTagDraftError(`You can add up to ${MAX_TAGS} tags.`);
      return;
    }
    if (tag.length > 50) {
      setTagDraftError("Tags must not exceed 50 characters.");
      return;
    }
    if (tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setTagDraftError("That tag is already included.");
      return;
    }

    setValue("tags", [...tags, tag], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setTagDraft("");
    setTagDraftError(null);
  };

  const removeTag = (tag: string) => {
    setValue(
      "tags",
      tags.filter((value) => value !== tag),
      { shouldDirty: true, shouldValidate: true },
    );
    setTagDraftError(null);
  };

  const onSubmit = async (values: ProblemFormValues) => {
    setSubmitError(null);

    const pendingTag = tagDraft.trim().replace(/^#+/, "");
    let submittedTags = values.tags ?? [];

    if (pendingTag) {
      if (pendingTag.length > 50) {
        setTagDraftError("Tags must not exceed 50 characters.");
        return;
      }

      const alreadyIncluded = submittedTags.some(
        (tag) => tag.toLowerCase() === pendingTag.toLowerCase(),
      );
      if (!alreadyIncluded) {
        if (submittedTags.length >= MAX_TAGS) {
          setTagDraftError(`You can add up to ${MAX_TAGS} tags.`);
          return;
        }
        submittedTags = [...submittedTags, pendingTag];
      }
    }

    try {
      const problem = await createProblem({
        ...values,
        categoryId: values.categoryId || undefined,
        technologies: values.technologies?.map((technology) => ({
          name: technology.name.trim(),
          version: technology.version?.trim() || undefined,
        })),
        tags: submittedTags.map((tag) => tag.trim()),
      }).unwrap();

      toast.success(
        problem.status === "PENDING_APPROVAL"
          ? "Problem submitted for review."
          : "Problem submitted successfully.",
      );
      router.push(successHref);
    } catch (error) {
      const parsed = parseApiError(
        error,
        "The problem could not be submitted. Please try again.",
      );

      for (const [field, message] of Object.entries(parsed.fieldErrors)) {
        const path = serverFieldPath(field);
        if (!path) continue;
        setError(path, {
          type: "server",
          message,
        });
      }

      setSubmitError(parsed.message);
      toast.error(parsed.message);
    }
  };

  return (
    <form
      noValidate
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      className="w-full"
    >
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3 lg:gap-8">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <Card
              className={CARD_CLASS}
              aria-labelledby="problem-details-heading"
            >
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 font-mono">
                    01
                  </Badge>
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle>
                      <h2
                        id="problem-details-heading"
                        className="text-lg font-bold"
                      >
                        Problem details
                      </h2>
                    </CardTitle>
                    <CardDescription>
                      Give the community enough context to understand and
                      reproduce what is going wrong.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <FieldGroup>
                  <Field
                    data-invalid={Boolean(errors.title)}
                    data-disabled={submitting || undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <FieldLabel htmlFor="problem-title">
                        Problem title
                        <span aria-hidden="true" className="text-destructive">
                          *
                        </span>
                        <span className="sr-only"> (required)</span>
                      </FieldLabel>
                      <Badge variant="secondary" className="tabular-nums">
                        {title.length}/180
                      </Badge>
                    </div>
                    <Input
                      id="problem-title"
                      maxLength={180}
                      placeholder="e.g. OAuth callback intermittently loses PKCE state"
                      aria-invalid={Boolean(errors.title)}
                      aria-describedby={
                        errors.title
                          ? "problem-title-error"
                          : "problem-title-help"
                      }
                      required
                      disabled={submitting}
                      className={CONTROL_CLASS}
                      {...register("title")}
                    />
                    <FieldDescription id="problem-title-help">
                      Use 10–180 characters and name the behavior, not only the
                      symptom.
                    </FieldDescription>
                    <FieldError id="problem-title-error">
                      {errors.title?.message}
                    </FieldError>
                  </Field>

                  <Field
                    data-invalid={Boolean(errors.description)}
                    data-disabled={submitting || undefined}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <FieldLabel htmlFor="problem-description">
                        Description
                        <span aria-hidden="true" className="text-destructive">
                          *
                        </span>
                        <span className="sr-only"> (required)</span>
                      </FieldLabel>
                      <Badge variant="secondary" className="tabular-nums">
                        {description.length.toLocaleString()}/20,000
                      </Badge>
                    </div>
                    <Controller
                      control={control}
                      name="description"
                      render={({ field }) => (
                        <MarkdownEditor
                          id="problem-description"
                          name={field.name}
                          value={field.value ?? ""}
                          onChange={(value) => field.onChange(value ?? "")}
                          onBlur={field.onBlur}
                          inputRef={field.ref}
                          placeholder="Explain what you expected, what happened instead, and the smallest set of steps that reproduces it."
                          height={380}
                          maxLength={20_000}
                          error={Boolean(errors.description)}
                          disabled={submitting}
                          required
                          ariaDescribedBy={
                            errors.description
                              ? "problem-description-error"
                              : "problem-description-help"
                          }
                        />
                      )}
                    />
                    <FieldDescription id="problem-description-help">
                      Markdown is supported. Include error output, environment
                      details, and reproduction steps when relevant.
                    </FieldDescription>
                    <FieldError id="problem-description-error">
                      {errors.description?.message}
                    </FieldError>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.08, ease: "easeOut" }}
          >
            <Card
              className={CARD_CLASS}
              aria-labelledby="problem-environment-heading"
            >
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-0.5 font-mono">
                    02
                  </Badge>
                  <div className="flex min-w-0 flex-col gap-1">
                    <CardTitle>
                      <h2
                        id="problem-environment-heading"
                        className="text-lg font-bold"
                      >
                        Environment
                      </h2>
                    </CardTitle>
                    <CardDescription>
                      Add the technologies and versions that matter to this
                      problem. This section is optional.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <FieldSet>
                  <FieldLegend className="sr-only">
                    Technologies
                  </FieldLegend>

                  {technologyFields.length === 0 ? (
                    <FieldDescription>
                      No technologies added. Add one when a runtime, framework,
                      database, or version helps reproduce the issue.
                    </FieldDescription>
                  ) : (
                    <FieldGroup className="gap-4">
                      <AnimatePresence initial={false}>
                        {technologyFields.map((technology, index) => (
                          <motion.div
                            key={technology.id}
                            layout
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.2 }}
                            className="grid grid-cols-1 items-start gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.65fr)_auto]"
                          >
                            <Field
                              data-invalid={Boolean(
                                errors.technologies?.[index]?.name,
                              )}
                              data-disabled={submitting || undefined}
                            >
                              <FieldLabel
                                htmlFor={`problem-technology-${index}`}
                              >
                                Technology
                                <span
                                  aria-hidden="true"
                                  className="text-destructive"
                                >
                                  *
                                </span>
                                <span className="sr-only"> (required)</span>
                              </FieldLabel>
                              <Input
                                id={`problem-technology-${index}`}
                                maxLength={100}
                                placeholder="e.g. Next.js"
                                aria-invalid={Boolean(
                                  errors.technologies?.[index]?.name,
                                )}
                                aria-describedby={
                                  errors.technologies?.[index]?.name
                                    ? `problem-technology-${index}-error`
                                    : undefined
                                }
                                required
                                disabled={submitting}
                                className={CONTROL_CLASS}
                                {...register(`technologies.${index}.name`)}
                              />
                              <FieldError
                                id={`problem-technology-${index}-error`}
                              >
                                {errors.technologies?.[index]?.name?.message}
                              </FieldError>
                            </Field>

                            <Field
                              data-invalid={Boolean(
                                errors.technologies?.[index]?.version,
                              )}
                              data-disabled={submitting || undefined}
                            >
                              <FieldLabel
                                htmlFor={`problem-version-${index}`}
                              >
                                Version
                              </FieldLabel>
                              <Input
                                id={`problem-version-${index}`}
                                maxLength={50}
                                placeholder="e.g. 16.2.10"
                                aria-invalid={Boolean(
                                  errors.technologies?.[index]?.version,
                                )}
                                aria-describedby={
                                  errors.technologies?.[index]?.version
                                    ? `problem-version-${index}-error`
                                    : undefined
                                }
                                disabled={submitting}
                                className={CONTROL_CLASS}
                                {...register(`technologies.${index}.version`)}
                              />
                              <FieldError
                                id={`problem-version-${index}-error`}
                              >
                                {errors.technologies?.[index]?.version?.message}
                              </FieldError>
                            </Field>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-lg"
                              aria-label={`Remove technology ${index + 1}`}
                              disabled={submitting}
                              onClick={() => removeTechnology(index)}
                              className="justify-self-end rounded-xl sm:mt-7"
                            >
                              <Trash2 aria-hidden="true" />
                            </Button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </FieldGroup>
                  )}

                  <FieldError>{errors.technologies?.message}</FieldError>
                </FieldSet>
              </CardContent>

              <CardFooter className="flex-col items-stretch gap-3 border-t border-slate-100 dark:border-slate-800 sm:flex-row sm:items-center sm:justify-between">
                <FieldDescription>
                  {technologyFields.length}/{MAX_TECHNOLOGIES} technologies
                </FieldDescription>
                <Button
                  type="button"
                  variant="outline"
                  disabled={
                    submitting ||
                    technologyFields.length >= MAX_TECHNOLOGIES
                  }
                  onClick={() => appendTechnology({ name: "", version: "" })}
                  className="w-full rounded-xl sm:w-auto"
                >
                  <Plus data-icon="inline-start" aria-hidden="true" />
                  Add technology
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <aside
          className="flex flex-col gap-5 lg:sticky"
          style={{ top: stickyTop } as React.CSSProperties}
        >
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.04, ease: "easeOut" }}
          >
            <Card
              className={CARD_CLASS}
              aria-labelledby="problem-context-heading"
            >
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle>
                  <h2
                    id="problem-context-heading"
                    className="text-lg font-bold"
                  >
                    Context
                  </h2>
                </CardTitle>
                <CardDescription>
                  Help the right people find and understand the problem.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <FieldGroup>
                  <Field
                    data-invalid={Boolean(errors.categoryId)}
                    data-disabled={
                      submitting ||
                      loadingCategories ||
                      categoryItems.length === 0 ||
                      undefined
                    }
                  >
                    <FieldLabel htmlFor="problem-category">
                      Category
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="categoryId"
                      render={({ field }) => (
                        <Select
                          items={categorySelectItems}
                          name={field.name}
                          value={field.value ?? null}
                          onValueChange={(value) =>
                            field.onChange(value ?? undefined)
                          }
                          disabled={
                            submitting ||
                            loadingCategories ||
                            categoryItems.length === 0
                          }
                        >
                          <SelectTrigger
                            ref={field.ref}
                            id="problem-category"
                            onBlur={field.onBlur}
                            aria-invalid={Boolean(errors.categoryId)}
                            aria-describedby={
                              errors.categoryId
                                ? "problem-category-error"
                                : "problem-category-help"
                            }
                            className={cn(CONTROL_CLASS, "w-full")}
                          >
                            <SelectValue
                              placeholder={
                                loadingCategories
                                  ? "Loading categories…"
                                  : categoryItems.length === 0
                                    ? "No categories available"
                                    : "Choose a category"
                              }
                            />
                          </SelectTrigger>
                          <SelectContent
                            alignItemWithTrigger={false}
                            className="rounded-xl"
                          >
                            <SelectGroup>
                              <SelectItem value={null}>No category</SelectItem>
                              {categoryItems.map((item) => (
                                <SelectItem
                                  key={item.value}
                                  value={item.value}
                                >
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldDescription id="problem-category-help">
                      {categoriesFailed
                        ? "Categories could not be loaded. You can still submit without one."
                        : "Optional, but useful for discovery."}
                    </FieldDescription>
                    <FieldError id="problem-category-error">
                      {errors.categoryId?.message}
                    </FieldError>
                  </Field>

                  <Field
                    data-invalid={Boolean(errors.sdlcPhase)}
                    data-disabled={submitting || undefined}
                  >
                    <FieldLabel htmlFor="problem-sdlc-phase">
                      SDLC phase
                    </FieldLabel>
                    <Controller
                      control={control}
                      name="sdlcPhase"
                      render={({ field }) => (
                        <Select
                          items={SDLC_SELECT_ITEMS}
                          name={field.name}
                          value={field.value ?? null}
                          onValueChange={(value) =>
                            field.onChange(value ?? undefined)
                          }
                          disabled={submitting}
                        >
                          <SelectTrigger
                            ref={field.ref}
                            id="problem-sdlc-phase"
                            onBlur={field.onBlur}
                            aria-invalid={Boolean(errors.sdlcPhase)}
                            aria-describedby={
                              errors.sdlcPhase
                                ? "problem-sdlc-phase-error"
                                : "problem-sdlc-phase-help"
                            }
                            className={cn(CONTROL_CLASS, "w-full")}
                          >
                            <SelectValue placeholder="Choose a phase" />
                          </SelectTrigger>
                          <SelectContent
                            alignItemWithTrigger={false}
                            className="rounded-xl"
                          >
                            <SelectGroup>
                              <SelectItem value={null}>Not specified</SelectItem>
                              {SDLC_ITEMS.map((item) => (
                                <SelectItem
                                  key={item.value}
                                  value={item.value}
                                >
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldDescription id="problem-sdlc-phase-help">
                      Optional. Where in the software lifecycle the issue
                      appears.
                    </FieldDescription>
                    <FieldError id="problem-sdlc-phase-error">
                      {errors.sdlcPhase?.message}
                    </FieldError>
                  </Field>
                </FieldGroup>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1, ease: "easeOut" }}
          >
            <Card
              className={CARD_CLASS}
              aria-labelledby="problem-tags-heading"
            >
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <CardTitle>
                  <h2
                    id="problem-tags-heading"
                    className="text-lg font-bold"
                  >
                    Tags
                  </h2>
                </CardTitle>
                <CardDescription>
                  Add focused keywords. Press Enter, comma, or Add after each
                  tag.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Field
                  data-invalid={Boolean(errors.tags) || Boolean(tagDraftError)}
                  data-disabled={
                    submitting || tags.length >= MAX_TAGS || undefined
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <FieldLabel htmlFor="problem-tags">Keywords</FieldLabel>
                    <Badge variant="secondary" className="tabular-nums">
                      {tags.length}/{MAX_TAGS}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="problem-tags"
                      value={tagDraft}
                      maxLength={51}
                      placeholder="e.g. oauth"
                      aria-invalid={
                        Boolean(errors.tags) || Boolean(tagDraftError)
                      }
                      aria-describedby={
                        errors.tags || tagDraftError
                          ? "problem-tags-error"
                          : "problem-tags-help"
                      }
                      disabled={submitting || tags.length >= MAX_TAGS}
                      className={cn(CONTROL_CLASS, "flex-1")}
                      onChange={(event) => {
                        setTagDraft(event.target.value);
                        setTagDraftError(null);
                      }}
                      onKeyDown={(event) => {
                        if (event.key === "Enter" || event.key === ",") {
                          event.preventDefault();
                          addTag();
                        }
                        if (
                          event.key === "Backspace" &&
                          !tagDraft &&
                          tags.length
                        ) {
                          removeTag(tags[tags.length - 1]);
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={
                        submitting ||
                        tags.length >= MAX_TAGS ||
                        pendingTagLength === 0
                      }
                      onClick={addTag}
                      className="h-12 w-full rounded-xl sm:w-auto"
                    >
                      <Plus data-icon="inline-start" aria-hidden="true" />
                      Add
                    </Button>
                  </div>
                  <FieldDescription id="problem-tags-help">
                    The leading # is optional and is removed before submission.
                  </FieldDescription>
                  <FieldError id="problem-tags-error">
                    {tagDraftError ?? errors.tags?.message}
                  </FieldError>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <AnimatePresence initial={false}>
                        {tags.map((tag) => (
                          <motion.div
                            key={tag}
                            layout
                            initial={{ opacity: 0, scale: 0.92 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.92 }}
                            transition={{ duration: 0.15 }}
                          >
                            <Badge
                              variant="tag"
                              className="min-h-8 cursor-pointer px-3 hover:bg-tag/80"
                              render={
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  aria-label={`Remove ${tag} tag`}
                                  disabled={submitting}
                                />
                              }
                            >
                              {tag}
                              <X aria-hidden="true" />
                            </Badge>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </Field>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.16, ease: "easeOut" }}
          >
            <Card
              className={CARD_CLASS}
              aria-labelledby="submit-problem-heading"
            >
              <CardHeader className="border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between gap-3">
                  <CardTitle>
                    <h2
                      id="submit-problem-heading"
                      className="text-lg font-bold"
                    >
                      Submit problem
                    </h2>
                  </CardTitle>
                  <Badge
                    role="status"
                    aria-live="polite"
                    variant={formReady ? "secondary" : "outline"}
                  >
                    {formReady ? "Ready" : "In progress"}
                  </Badge>
                </div>
                <CardDescription>
                  Your post may be held for review before it appears publicly.
                </CardDescription>
              </CardHeader>

              <CardContent className="flex flex-col gap-3">
                <RequirementRow label="A clear title" met={titleReady} />
                <RequirementRow
                  label="A useful description"
                  met={descriptionReady}
                />
                {technologies.length > 0 && (
                  <RequirementRow
                    label="Technology details complete"
                    met={technologiesReady}
                  />
                )}
                {(tags.length > 0 || pendingTagLength > 0) && (
                  <RequirementRow label="Tag limits satisfied" met={tagsReady} />
                )}
                <RequirementRow
                  label="Category selected"
                  met={Boolean(categoryId)}
                  optional
                />
                <RequirementRow
                  label="SDLC phase selected"
                  met={Boolean(sdlcPhase)}
                  optional
                />

                {submitError && (
                  <FieldError className="pt-1">{submitError}</FieldError>
                )}
              </CardContent>

              <CardFooter className="flex-col gap-2 border-t border-slate-100 dark:border-slate-800">
                <motion.div
                  className="w-full"
                  whileHover={submitting ? undefined : { y: -2 }}
                  whileTap={submitting ? undefined : { y: 0, scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitting}
                    className="h-12 w-full rounded-xl text-base font-semibold"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle
                          data-icon="inline-start"
                          aria-hidden="true"
                          className="animate-spin motion-reduce:animate-none"
                        />
                        Submitting…
                      </>
                    ) : (
                      <>
                        <Send data-icon="inline-start" aria-hidden="true" />
                        Submit problem
                      </>
                    )}
                  </Button>
                </motion.div>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={submitting}
                  onClick={() => router.push(cancelHref)}
                  className="h-11 w-full rounded-xl"
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
