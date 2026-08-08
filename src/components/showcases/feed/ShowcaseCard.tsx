"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Eye, GitBranch, ImageOff, ListOrdered, Play, SquareArrowOutUpRight } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import type { ShowcaseResponse } from "@/lib/redux/services/showcasesApi";
import { cn } from "@/lib/utils";

/**
 * One showcase on the index.
 *
 * Everything rendered here comes off `ShowCasesResponse` — cover, category,
 * author name, view count, step count. There is deliberately no vote or
 * comment count: the list endpoint returns neither, and the per-target vote and
 * comment endpoints would be one request per card.
 */

interface ShowcaseCardProps {
  showcase: ShowcaseResponse;
  index?: number;
}

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

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * The overview is markdown. Excerpts strip the syntax rather than render it —
 * a stray `##` or `[label](url)` in a two-line clamp reads as noise.
 */
export function excerptOf(markdown: string, max = 220): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s{0,3}[-*+]\s+/gm, "")
    .replace(/[*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return plain.length > max ? `${plain.slice(0, max).trimEnd()}…` : plain;
}

export function ShowcaseCard({ showcase, index = 0 }: ShowcaseCardProps) {
  const [coverFailed, setCoverFailed] = useState(false);

  const titleId = `showcase-title-${showcase.id}`;
  const steps = showcase.steps?.length ?? 0;
  const cover = coverFailed ? null : showcase.coverImageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card
        role="article"
        aria-labelledby={titleId}
        className="group relative h-full gap-0 overflow-hidden rounded-2xl bg-card py-0 shadow-xs ring-1 ring-foreground/5 transition-shadow duration-200 hover:shadow-sm hover:ring-foreground/10 focus-within:ring-2 focus-within:ring-primary/40"
      >
        {/* One overlay link covers the card; the external links in the footer
            re-enable pointer events so they stay clickable. */}
        <Link
          href={`/showcases/${showcase.id}`}
          className="absolute inset-0 z-10 rounded-2xl outline-none"
        >
          <span className="sr-only">Open showcase: {showcase.title}</span>
        </Link>

        {/* A plain <img>, not next/image: cover URLs are whatever the author
            uploaded or pasted, and a host the optimizer will not serve should
            degrade to the placeholder rather than throw. */}
        <div className="relative aspect-[16/8] overflow-hidden bg-muted">
          {cover ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={cover}
              alt=""
              loading="lazy"
              onError={() => setCoverFailed(true)}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.015]"
            />
          ) : (
            <div className="flex size-full items-center justify-center bg-linear-to-br from-slate-100 via-white to-blue-50 text-muted-foreground dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
              <ImageOff aria-hidden="true" className="size-7" />
            </div>
          )}
        </div>

        <CardHeader className="pointer-events-none relative px-5 pt-5 pb-0">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            {showcase.categoryName && (
              <Badge variant="secondary" className="rounded-lg text-sm">
                {showcase.categoryName}
              </Badge>
            )}
            {steps > 0 && (
              <Badge variant="ghost" className="rounded-lg text-sm">
                <ListOrdered data-icon="inline-start" aria-hidden="true" />
                {steps} {steps === 1 ? "step" : "steps"}
              </Badge>
            )}
          </div>

          <h3
            id={titleId}
            className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary"
          >
            {showcase.title}
          </h3>
        </CardHeader>

        <CardContent className="pointer-events-none relative px-5 py-3">
          <p className="line-clamp-3 text-base leading-relaxed text-muted-foreground">
            {excerptOf(showcase.overview)}
          </p>
        </CardContent>

        <CardFooter className="pointer-events-none relative mt-auto flex flex-wrap items-center justify-between gap-3 px-5 pt-0 pb-5">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback>{initialsOf(showcase.authorName)}</AvatarFallback>
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

          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <span
              className="flex items-center gap-1.5"
              aria-label={`${showcase.viewCount.toLocaleString()} views`}
            >
              <Eye aria-hidden="true" className="size-4" />
              <span className="tabular-nums">
                {showcase.viewCount.toLocaleString()}
              </span>
            </span>

            {showcase.repoUrl && (
              <ExternalIconLink
                href={showcase.repoUrl}
                label={`Repository for ${showcase.title}`}
              >
                <GitBranch aria-hidden="true" className="size-4" />
              </ExternalIconLink>
            )}
            {showcase.liveUrl && (
              <ExternalIconLink
                href={showcase.liveUrl}
                label={`Live demo of ${showcase.title}`}
              >
                <SquareArrowOutUpRight aria-hidden="true" className="size-4" />
              </ExternalIconLink>
            )}
            {showcase.videoUrl && (
              <ExternalIconLink
                href={showcase.videoUrl}
                label={`Video walkthrough of ${showcase.title}`}
              >
                <Play aria-hidden="true" className="size-4" />
              </ExternalIconLink>
            )}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

function ExternalIconLink({
  href,
  label,
  children,
  className,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={label}
      title={label}
      onClick={(event) => event.stopPropagation()}
      className={cn(
        "pointer-events-auto relative z-20 rounded-lg p-1.5 transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
    >
      {children}
    </a>
  );
}
