"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  AlertCircle,
  ChevronRight,
  Clock,
  Eye,
  GitBranch,
  ImageOff,
  Play,
  RotateCcw,
  SquareArrowOutUpRight,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { MarkdownView } from "@/components/showcases/detail/MarkdownView";
import {
  useGetShowcaseByIdQuery,
  useGetShowcaseStepsQuery,
  useIncrementShowcaseViewsMutation,
  type ShowcaseStepResponse,
} from "@/lib/redux/services/showcasesApi";
import { cn } from "@/lib/utils";

/**
 * One showcase in full: `GET /api/v1/showcases/{id}` for the project and
 * `GET /api/v1/showcase-steps/{showcaseId}` for the guide when the showcase
 * response does not carry it.
 *
 * The read is also recorded once per mount through
 * `POST /api/v1/showcases/{id}/views`, which the proxy leaves open to
 * signed-out visitors.
 */

interface ShowcaseDetailProps {
  id: string;
}

const CARD =
  "rounded-2xl bg-card shadow-xs ring-1 ring-foreground/5";

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
}

function formatDate(iso?: string) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function ShowcaseDetail({ id }: ShowcaseDetailProps) {
  const { data: showcase, isLoading, isError, error, refetch } =
    useGetShowcaseByIdQuery(id);

  /* The showcase response is documented to include its steps; the dedicated
     endpoint is the fallback for when it comes back without them. */
  const embeddedSteps = showcase?.steps;
  const { data: fetchedSteps } = useGetShowcaseStepsQuery(id, {
    skip: !showcase || (embeddedSteps?.length ?? 0) > 0,
  });

  const steps = [...(embeddedSteps?.length ? embeddedSteps : fetchedSteps ?? [])]
    .sort((a, b) => a.stepNumber - b.stepNumber);

  /* Once per mount, and never twice in development's double-invoked effects. */
  const [incrementViews] = useIncrementShowcaseViewsMutation();
  const counted = useRef(false);

  useEffect(() => {
    if (counted.current) return;
    counted.current = true;
    void incrementViews(id);
  }, [id, incrementViews]);

  if (isLoading) return <DetailSkeleton />;

  if (isError || !showcase) {
    const status =
      typeof error === "object" && error !== null && "status" in error
        ? (error as { status?: number }).status
        : undefined;

    return (
      <DetailError
        title={status === 404 ? "Showcase not found" : "Something went wrong"}
        message={
          status === 404
            ? "It may have been removed, or the link may be wrong."
            : "This showcase could not be loaded right now."
        }
        onRetry={status === 404 ? undefined : () => void refetch()}
      />
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6"
    >
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground"
      >
        <Link href="/" className="transition-colors hover:text-foreground">
          Home
        </Link>
        <ChevronRight aria-hidden="true" className="size-4" />
        <Link
          href="/showcases"
          className="transition-colors hover:text-foreground"
        >
          Showcases
        </Link>
        <ChevronRight aria-hidden="true" className="size-4" />
        <span aria-current="page" className="truncate font-semibold text-foreground">
          {showcase.title}
        </span>
      </nav>

      <header className={cn(CARD, "overflow-hidden")}>
        <Cover url={showcase.coverImageUrl} title={showcase.title} />

        <div className="flex flex-col gap-4 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            {showcase.categoryName && (
              <Badge variant="secondary" className="rounded-lg text-sm">
                {showcase.categoryName}
              </Badge>
            )}
            {showcase.reviewStatus !== "APPROVED" && (
              <Badge variant="ghost" className="rounded-lg text-sm">
                <Clock data-icon="inline-start" aria-hidden="true" />
                {showcase.reviewStatus === "PENDING"
                  ? "Awaiting review"
                  : "Changes requested"}
              </Badge>
            )}
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {showcase.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            <div className="flex min-w-0 items-center gap-2.5">
              <Avatar size="sm">
                <AvatarFallback>
                  {initialsOf(showcase.authorName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-sm font-semibold text-foreground">
                  {showcase.authorName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {formatDate(showcase.createdAt)}
                </span>
              </div>
            </div>

            <span
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"
              aria-label={`${showcase.viewCount.toLocaleString()} views`}
            >
              <Eye aria-hidden="true" className="size-4" />
              <span className="tabular-nums">
                {showcase.viewCount.toLocaleString()}
              </span>
              views
            </span>
          </div>

          {(showcase.liveUrl || showcase.repoUrl || showcase.videoUrl) && (
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              {showcase.liveUrl && (
                <ExternalLink href={showcase.liveUrl} primary>
                  <SquareArrowOutUpRight
                    data-icon="inline-start"
                    aria-hidden="true"
                  />
                  Live demo
                </ExternalLink>
              )}
              {showcase.repoUrl && (
                <ExternalLink href={showcase.repoUrl}>
                  <GitBranch data-icon="inline-start" aria-hidden="true" />
                  Repository
                </ExternalLink>
              )}
              {showcase.videoUrl && (
                <ExternalLink href={showcase.videoUrl}>
                  <Play data-icon="inline-start" aria-hidden="true" />
                  Walkthrough
                </ExternalLink>
              )}
            </div>
          )}
        </div>
      </header>

      <section aria-label="Overview" className={cn(CARD, "p-5 sm:p-6")}>
        <SectionEyebrow>Overview</SectionEyebrow>
        <MarkdownView source={showcase.overview} className="mt-3" />
      </section>

      {steps.length > 0 && (
        <section aria-label="Build guide" className="flex flex-col gap-4">
          <div className={cn(CARD, "flex items-center justify-between p-5")}>
            <SectionEyebrow>Build guide</SectionEyebrow>
            <span className="text-sm font-semibold tabular-nums text-muted-foreground">
              {steps.length} {steps.length === 1 ? "step" : "steps"}
            </span>
          </div>

          {steps.map((step, index) => (
            <StepBlock key={step.id} step={step} position={index + 1} />
          ))}
        </section>
      )}
    </motion.article>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="h-px w-6 bg-foreground" />
      <span className="text-xs font-bold uppercase tracking-[0.22em] text-foreground">
        {children}
      </span>
    </div>
  );
}

function Cover({ url, title }: { url?: string; title: string }) {
  const [failed, setFailed] = useState(false);
  const shown = failed ? null : url;

  return (
    <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
      {shown ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={shown}
          alt={`${title} cover`}
          onError={() => setFailed(true)}
          className="size-full object-cover"
        />
      ) : (
        <div className="flex size-full items-center justify-center bg-linear-to-br from-slate-100 via-white to-blue-50 text-muted-foreground dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
          <ImageOff aria-hidden="true" className="size-8" />
        </div>
      )}
    </div>
  );
}

function StepBlock({
  step,
  position,
}: {
  step: ShowcaseStepResponse;
  position: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(CARD, "p-5 sm:p-6")}
    >
      <div className="flex items-start gap-3.5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-foreground font-mono text-sm font-bold tabular-nums text-background">
          {position}
        </span>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-foreground">
          {step.title}
        </h2>
      </div>

      <MarkdownView source={step.description} className="mt-4" />

      {step.codeSnippet && (
        <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-relaxed text-slate-100 ring-1 ring-foreground/10">
          <code className="font-mono">{step.codeSnippet}</code>
        </pre>
      )}

      {(step.imageUrl || step.diagramUrl) && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {step.imageUrl && (
            <StepImage url={step.imageUrl} caption="Screenshot" />
          )}
          {step.diagramUrl && (
            <StepImage url={step.diagramUrl} caption="Diagram" />
          )}
        </div>
      )}
    </motion.div>
  );
}

function StepImage({ url, caption }: { url: string; caption: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <figure className="flex flex-col gap-1.5">
      <div className="overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={caption}
          loading="lazy"
          onError={() => setFailed(true)}
          className="w-full object-cover"
        />
      </div>
      <figcaption className="text-sm text-muted-foreground">
        {caption}
      </figcaption>
    </figure>
  );
}

function ExternalLink({
  href,
  primary = false,
  children,
}: {
  href: string;
  primary?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className={cn(
        buttonVariants({ variant: primary ? "default" : "secondary" }),
        "rounded-xl",
      )}
    >
      {children}
    </a>
  );
}

function DetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading showcase"
      className="flex animate-pulse flex-col gap-6"
    >
      <span className="sr-only">Loading showcase…</span>
      <div className="h-4 w-56 rounded-lg bg-muted" />
      <div className={cn(CARD, "overflow-hidden")}>
        <div className="aspect-[16/7] w-full bg-muted" />
        <div className="flex flex-col gap-3 p-5 sm:p-6">
          <div className="h-6 w-28 rounded-lg bg-muted" />
          <div className="h-8 w-3/4 rounded-lg bg-muted" />
          <div className="h-10 w-52 rounded-lg bg-muted" />
        </div>
      </div>
      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className={cn(CARD, "flex flex-col gap-3 p-5 sm:p-6")}>
          <div className="h-6 w-40 rounded-lg bg-muted" />
          <div className="h-4 w-full rounded-lg bg-muted" />
          <div className="h-4 w-5/6 rounded-lg bg-muted" />
        </div>
      ))}
    </div>
  );
}

function DetailError({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className={cn(
        CARD,
        "flex flex-col items-center gap-4 p-10 text-center sm:p-12",
      )}
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300">
        <AlertCircle aria-hidden="true" className="size-7" />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-base leading-relaxed text-muted-foreground">
          {message}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {onRetry && (
          <Button
            type="button"
            size="lg"
            onClick={onRetry}
            className="rounded-xl"
          >
            <RotateCcw data-icon="inline-start" aria-hidden="true" />
            Try again
          </Button>
        )}
        <Link
          href="/showcases"
          className={cn(
            buttonVariants({ variant: "secondary", size: "lg" }),
            "rounded-xl",
          )}
        >
          Back to showcases
        </Link>
      </div>
    </div>
  );
}
