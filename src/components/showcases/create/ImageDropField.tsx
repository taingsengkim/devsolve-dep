"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImagePlus, Link2, Loader2, Trash2, Upload, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUploadShowcaseImageMutation } from "@/lib/redux/services/showcasesApi";
import { validateImageFile } from "@/lib/validations/showcase";
import { cn } from "@/lib/utils";

interface ImageDropFieldProps {
  value?: string;
  onChange: (url: string) => void;
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
 * Drag-and-drop image field. The file is uploaded the moment it is chosen
 * rather than at submit, so the form only ever holds a URL and publishing
 * stays a single fast request.
 *
 * The backend publishes no general upload route yet (see `showcasesApi`), so
 * a failed upload drops the author into the link mode instead of dead-ending.
 */
export function ImageDropField({
  value,
  onChange,
  aspectClassName = "aspect-video",
  label,
  hint,
  error,
  compact = false,
}: ImageDropFieldProps) {
  const [uploadImage, { isLoading }] = useUploadShowcaseImageMutation();
  const [mode, setMode] = useState<Mode>("upload");
  const [dragging, setDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* The object URL is a document-lifetime handle — without this the blob
     stays resident for every image the author trials. */
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const accept = async (file: File) => {
    const reason = validateImageFile(file);
    if (reason) {
      setLocalError(reason);
      return;
    }

    setLocalError(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const { url } = await uploadImage(file).unwrap();
      onChange(url);
    } catch {
      setPreview(null);
      URL.revokeObjectURL(objectUrl);
      setMode("link");
      setLocalError(
        "Upload isn't available yet — paste an image URL instead.",
      );
    }
  };

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) void accept(file);
    // `accept` is stable enough for this handler's purpose.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clear = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(null);
    setLinkDraft("");
    onChange("");
  };

  const shown = value || preview;
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

            {isLoading && (
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
                    if (linkDraft.trim()) onChange(linkDraft.trim());
                  }
                }}
                placeholder="https://…/cover.png"
                className="h-11 rounded-xl border-slate-300 bg-white pl-9 text-sm dark:border-slate-700"
              />
            </div>
            <Button
              type="button"
              onClick={() => linkDraft.trim() && onChange(linkDraft.trim())}
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
                {isLoading ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : dragging ? (
                  <Upload className="size-5" />
                ) : (
                  <ImagePlus className="size-5" />
                )}
              </span>

              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                {isLoading ? "Uploading…" : "Drop an image or click to browse"}
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
                const file = event.target.files?.[0];
                if (file) void accept(file);
                // Let the same file be re-picked after a failed upload.
                event.target.value = "";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {message && (
        <p className="flex items-start gap-1.5 text-sm font-medium text-rose-600">
          <X className="mt-0.5 size-3.5 shrink-0" />
          {message}
        </p>
      )}
    </div>
  );
}
