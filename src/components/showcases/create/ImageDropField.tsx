"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Clock,
  ImagePlus,
  Link2,
  Loader2,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateImageFile } from "@/lib/validations/showcase";
import { cn } from "@/lib/utils";

interface ImageDropFieldProps {
  /** A URL already hosted upstream, or one the author pasted. */
  value?: string;
  onChange: (url: string) => void;
  /** A chosen file waiting to be uploaded, held in form state. */
  file?: File | null;
  onFileChange: (file: File | null) => void;
  /** True while the parent is putting this file to its upload route. */
  uploading?: boolean;
  /** Tailwind aspect class — the cover is locked to 16:9. */
  aspectClassName?: string;
  label: string;
  hint?: string;
  error?: string;
  /** Denser variant used inside a build step. */
  compact?: boolean;
}

type Mode = "upload" | "link";

/**
 * Drag-and-drop image field, with pasting a URL as the alternative.
 *
 * Every upload route the backend publishes is scoped to a row that has to
 * exist first — `PUT /showcases/{id}/cover-image`, `PUT
 * /showcase-steps/{showcaseId}/{stepId}/image`. So a chosen file is not sent
 * here: it is handed to the form, previewed locally, and uploaded by the
 * publish sequence once the showcase (or step) it belongs to has been created.
 * A pasted URL needs no upload at all and travels in the create body.
 */
export function ImageDropField({
  value,
  onChange,
  file,
  onFileChange,
  uploading = false,
  aspectClassName = "aspect-video",
  label,
  hint,
  error,
  compact = false,
}: ImageDropFieldProps) {
  const [mode, setMode] = useState<Mode>("upload");
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* An object URL is a document-lifetime handle: without the revoke, every
     image the author trials stays resident. The live one is mirrored in a ref
     so it can be released when it is replaced and again on unmount. */
  const previewRef = useRef<string | null>(null);

  const showPreview = useCallback((next: string | null) => {
    if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    previewRef.current = next;
    setPreview(next);
  }, []);

  useEffect(
    () => () => {
      if (previewRef.current) URL.revokeObjectURL(previewRef.current);
    },
    [],
  );

  const accept = useCallback(
    (candidate: File) => {
      const reason = validateImageFile(candidate);
      if (reason) {
        setLocalError(reason);
        return;
      }

      setLocalError(null);
      showPreview(URL.createObjectURL(candidate));
      onFileChange(candidate);
      // A file replaces whatever URL was there, so the two can't disagree.
      if (value) onChange("");
    },
    [onChange, onFileChange, showPreview, value],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      const dropped = event.dataTransfer.files?.[0];
      if (dropped) accept(dropped);
    },
    [accept],
  );

  const applyLink = () => {
    const url = linkDraft.trim();
    if (!url) return;
    setLocalError(null);
    showPreview(null);
    onFileChange(null);
    onChange(url);
  };

  const clear = () => {
    setLinkDraft("");
    setLocalError(null);
    showPreview(null);
    onFileChange(null);
    onChange("");
  };

  /* The preview only counts while the form still holds the file it was made
     from — a reset upstream clears the field rather than leaving a dead blob. */
  const shown = value || (file ? preview : null);
  const message = error ?? localError;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "font-semibold text-slate-900 dark:text-slate-100",
            compact ? "text-sm" : "text-base",
          )}
        >
          {label}
        </span>

        {!shown && (
          <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-800 dark:bg-slate-900">
            {(["upload", "link"] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-xs font-semibold capitalize transition-colors",
                  mode === option
                    ? "bg-white text-slate-900 shadow-2xs dark:bg-slate-800 dark:text-slate-100"
                    : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-300",
                )}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {shown ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900",
              aspectClassName,
            )}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={shown}
              alt=""
              className="size-full object-cover"
              onError={() => setLocalError("That image could not be loaded")}
            />

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-900/45 backdrop-blur-xs">
                <span className="inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-slate-700">
                  <Loader2 className="size-4 animate-spin" />
                  Uploading…
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={clear}
              aria-label={`Remove ${label.toLowerCase()}`}
              className="absolute right-2.5 top-2.5 inline-flex size-8 items-center justify-center rounded-lg bg-slate-900/75 text-white opacity-0 backdrop-blur transition-opacity hover:bg-rose-600 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <Trash2 className="size-4" />
            </button>
          </motion.div>
        ) : mode === "link" ? (
          <motion.div
            key="link"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={linkDraft}
                onChange={(event) => setLinkDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    applyLink();
                  }
                }}
                placeholder="https://…/cover.png"
                className="h-11 rounded-xl border-slate-300 bg-white pl-9 text-sm dark:border-slate-700"
              />
            </div>
            <Button
              type="button"
              onClick={applyLink}
              className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Use
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="drop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={onDrop}
              className={cn(
                "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed transition-colors",
                /* The placeholder the author sees before choosing anything. */
                "bg-linear-to-br from-slate-100 via-white to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800",
                dragging
                  ? "border-blue-500 bg-blue-50/60"
                  : "border-slate-300 hover:border-blue-400 dark:border-slate-700",
                aspectClassName,
                compact && "min-h-32",
              )}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-white text-blue-600 shadow-2xs dark:bg-slate-800">
                {dragging ? (
                  <Upload className="size-5" />
                ) : (
                  <ImagePlus className="size-5" />
                )}
              </span>

              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                Drop an image or click to browse
              </span>
              <span className="text-xs text-slate-500">
                {hint ?? "PNG, JPG or WebP · up to 5MB · 16:9 works best"}
              </span>
            </button>

            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) => {
                const chosen = event.target.files?.[0];
                if (chosen) accept(chosen);
                // Let the same file be re-picked after clearing it.
                event.target.value = "";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Says plainly that the bytes have not left the browser yet — the
          upload route needs the row this image hangs off to exist first. */}
      {file && !uploading && (
        <p className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
          <Clock className="size-3.5 shrink-0" />
          <span className="truncate">
            {file.name} · uploads when you publish
          </span>
        </p>
      )}

      {message && (
        <p className="flex items-start gap-1.5 text-sm font-medium text-rose-600">
          <X className="mt-0.5 size-3.5 shrink-0" />
          {message}
        </p>
      )}
    </div>
  );
}
