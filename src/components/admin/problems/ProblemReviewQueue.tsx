"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  RotateCcw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProblemDecisionDialog,
  type ProblemDecision,
} from "@/components/admin/problems/ProblemDecisionDialog";
import { ProblemStatusBadge } from "@/components/admin/problems/ProblemStatusBadge";
import { useGetProblemReviewQueueQuery } from "@/lib/redux/services/admin/problemReviewApi";
import type { ProblemResponse } from "@/lib/redux/services/problemsApi";
import { excerptOf } from "@/lib/markdown-excerpt";
import { SDLC_LABELS, type ProblemStatus } from "@/lib/validations/problem";
import { authorNameOf } from "@/lib/discussions/format";

/**
 * The problem approval queue — `GET /api/v1/admin/problems`.
 *
 * A submitted problem sits at `PENDING_APPROVAL` and stays off the public feed
 * until it is published here, so this is the gate between an author pressing
 * Submit and anyone reading the result.
 *
 * Built as a panel rather than a page so it can live as a tab inside the
 * moderation screen, next to the showcase queue.
 */

const STATUS_TABS: { value: ProblemStatus; label: string }[] = [
  { value: "PENDING_APPROVAL", label: "Pending" },
  { value: "PUBLISHED", label: "Published" },
  { value: "REJECTED", label: "Rejected" },
];

/** Where a problem is opened in full. */
export const problemReviewHref = (problemId: string) =>
  `/dashboard/content-moderation/problems/${problemId}`;

export function ProblemReviewQueue() {
  const [status, setStatus] = useState<ProblemStatus>("PENDING_APPROVAL");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetProblemReviewQueueQuery({
      status,
      page,
      size: pageSize,
      // Longest-waiting first, so nothing sits at the back of the queue.
      sort: "createdAt,ASC",
    });

  const [decisionFor, setDecisionFor] = useState<ProblemResponse | null>(null);
  const [decision, setDecision] = useState<ProblemDecision | null>(null);

  const items = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-4">
      {/* Status tabs, in the same segmented style as the page's own tabs. */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-2xs sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-800/80">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatus(tab.value);
                setPage(0);
              }}
              aria-pressed={status === tab.value}
              className={`cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                status === tab.value
                  ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-900 dark:text-slate-100"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <p className="px-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="font-bold tabular-nums text-slate-800 dark:text-slate-100">
            {totalElements}
          </span>{" "}
          {status === "PENDING_APPROVAL"
            ? totalElements === 1
              ? "problem waiting"
              : "problems waiting"
            : "in this list"}
        </p>
      </div>

      {isError ? (
        <PanelCard
          tone="error"
          title="Something went wrong"
          body={messageOf(error, "The problem queue could not be loaded.")}
          action={
            <Button
              type="button"
              onClick={() => void refetch()}
              className="rounded-xl"
            >
              <RotateCcw data-icon="inline-start" aria-hidden="true" />
              Try again
            </Button>
          }
        />
      ) : isLoading ? (
        <QueueSkeleton />
      ) : items.length === 0 ? (
        <PanelCard
          tone="empty"
          title={
            status === "PENDING_APPROVAL"
              ? "Nothing waiting for review"
              : status === "PUBLISHED"
                ? "No published problems yet"
                : "Nothing rejected"
          }
          body={
            status === "PENDING_APPROVAL"
              ? "Every submitted problem has a decision. New ones land here the moment an author submits."
              : status === "PUBLISHED"
                ? "Approved problems appear here, and on the public problem feed."
                : "Problems you turn away stay here."
          }
        />
      ) : (
        <div
          aria-busy={isFetching}
          className={`space-y-3 transition-opacity duration-150 ${
            isFetching ? "opacity-70" : ""
          }`}
        >
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <QueueRow
                key={item.id}
                item={item}
                busy={Boolean(item.id) && decisionFor?.id === item.id}
                onDecide={(next) => {
                  setDecisionFor(item);
                  setDecision(next);
                }}
              />
            ))}
          </AnimatePresence>

          {/* Server-side paging: `page` is 0-based upstream, so the number on
              screen is the state plus one. */}
          <div className="flex flex-col justify-between gap-4 border-t border-slate-200/80 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center dark:border-slate-800 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span id="problem-queue-rows">Rows per page</span>
              <div className="w-20">
                <Select
                  value={String(pageSize)}
                  onValueChange={(value: string | null) => {
                    if (!value) return;
                    setPageSize(Number(value));
                    setPage(0);
                  }}
                >
                  <SelectTrigger
                    aria-labelledby="problem-queue-rows"
                    className="h-8 rounded-xl border-slate-200 bg-white text-xs font-semibold dark:border-slate-800 dark:bg-slate-900"
                  >
                    <SelectValue placeholder={String(pageSize)} />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50].map((option) => (
                      <SelectItem key={option} value={String(option)}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <span className="ml-2">
                Showing {page * pageSize + 1}–
                {Math.min((page + 1) * pageSize, totalElements)} of{" "}
                {totalElements}
              </span>
            </div>

            <div className="flex items-center gap-2 self-center sm:self-auto">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={page === 0}
                onClick={() => setPage((current) => Math.max(0, current - 1))}
                className="rounded-xl"
              >
                <ChevronLeft data-icon="inline-start" aria-hidden="true" />
                Previous
              </Button>
              <span className="text-xs font-bold tabular-nums text-slate-700 dark:text-slate-300">
                {page + 1} / {Math.max(1, totalPages)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={page + 1 >= totalPages}
                onClick={() => setPage((current) => current + 1)}
                className="rounded-xl"
              >
                Next
                <ChevronRight data-icon="inline-end" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <ProblemDecisionDialog
        problemId={decisionFor?.id ?? ""}
        title={decisionFor?.title ?? ""}
        decision={decision}
        isOpen={Boolean(decisionFor?.id && decision)}
        onClose={() => {
          setDecisionFor(null);
          setDecision(null);
        }}
      />
    </div>
  );
}

function QueueRow({
  item,
  busy,
  onDecide,
}: {
  item: ProblemResponse;
  busy: boolean;
  onDecide: (decision: ProblemDecision) => void;
}) {
  const isPending = item.status === "PENDING_APPROVAL";
  const description = item.description ?? "";
  const warnings = item.contentWarnings ?? [];
  const technologies = item.technologies ?? [];
  const tags = item.tags ?? [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs dark:border-slate-800 dark:bg-slate-900 ${
        busy ? "opacity-60" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <ProblemStatusBadge status={item.status} />
        {item.category?.name && (
          <span className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300">
            {item.category.name}
          </span>
        )}
        {item.sdlcPhase && (
          <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {SDLC_LABELS[item.sdlcPhase]}
          </span>
        )}
        {isPending && item.createdAt && (
          <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            {waitingSince(item.createdAt)}
          </span>
        )}
      </div>

      {/* The backend's own automated flags. Whatever tripped them is the first
          thing a reviewer should read the description for. */}
      {warnings.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertTriangle
            aria-hidden="true"
            className="size-4 shrink-0 text-amber-600 dark:text-amber-400"
          />
          <span className="text-xs font-bold text-amber-800 dark:text-amber-200">
            Flagged automatically:
          </span>
          <span className="text-xs font-medium text-amber-800 dark:text-amber-200">
            {warnings.join(", ")}
          </span>
        </div>
      )}

      <div className="min-w-0">
        <h3 className="truncate text-base font-bold text-slate-900 dark:text-slate-100">
          {item.title ?? "Untitled problem"}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {excerptOf(description, 220)}
        </p>
      </div>

      {(technologies.length > 0 || tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {technologies.map((tech, index) => (
            <span
              key={tech.id ?? `${tech.name}-${index}`}
              className="rounded-lg border border-slate-200 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              {tech.name}
              {tech.version ? ` ${tech.version}` : ""}
            </span>
          ))}
          {tags.map((tag, index) => (
            <span
              key={tag.id ?? `${tag.name}-${index}`}
              className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="truncate text-xs font-semibold text-slate-600 dark:text-slate-300">
          by {authorNameOf(item.author)}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          {item.id && (
            <Link
              href={problemReviewHref(item.id)}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 px-3 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              <Eye className="size-3.5" />
              Review in full
            </Link>
          )}

          {isPending && item.id && (
            <>
              <button
                type="button"
                disabled={busy}
                onClick={() => onDecide("REJECTED")}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 px-3 text-xs font-bold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50 dark:border-rose-500/30 dark:text-rose-300 dark:hover:bg-rose-500/10"
              >
                <XCircle className="size-3.5" />
                Reject
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => onDecide("PUBLISHED")}
                className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3 text-xs font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                <CheckCircle2 className="size-3.5" />
                Approve
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function waitingSince(iso: string) {
  const submitted = new Date(iso);
  if (Number.isNaN(submitted.getTime())) return "";

  const days = Math.floor((Date.now() - submitted.getTime()) / 86_400_000);
  if (days <= 0) return "Submitted today";
  if (days === 1) return "Waiting 1 day";
  return `Waiting ${days} days`;
}

function PanelCard({
  tone,
  title,
  body,
  action,
}: {
  tone: "empty" | "error";
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Card className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`mx-auto flex size-14 items-center justify-center rounded-2xl ${
          tone === "error"
            ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-300"
            : "bg-slate-100 text-slate-400 dark:bg-slate-800"
        }`}
      >
        {tone === "error" ? (
          <AlertCircle className="size-7" />
        ) : (
          <ShieldCheck className="size-7" />
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          {title}
        </h3>
        <p className="mx-auto max-w-md text-sm text-slate-500 dark:text-slate-400">
          {body}
        </p>
      </div>
      {action && <div className="flex justify-center">{action}</div>}
    </Card>
  );
}

function QueueSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading the problem queue"
      className="animate-pulse space-y-3"
    >
      <span className="sr-only">Loading the problem queue…</span>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex gap-2">
            <div className="h-6 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-6 w-24 rounded-lg bg-slate-200 dark:bg-slate-800" />
          </div>
          <div className="h-5 w-3/5 rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="h-4 w-full rounded-lg bg-slate-200 dark:bg-slate-800" />
          <div className="mt-1 flex justify-between">
            <div className="h-6 w-28 rounded-lg bg-slate-200 dark:bg-slate-800" />
            <div className="h-8 w-56 rounded-xl bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
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
