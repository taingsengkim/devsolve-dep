"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Link2, Trash2, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { validateIconFile } from "@/lib/validations/category";
import { cn } from "@/lib/utils";

/**
 * What should happen to the icon when the dialog is saved.
 *
 * Upload is deliberately deferred rather than fired on file-select: the
 * endpoint is `PUT /categories/{id}/icon`, so on create there is no id yet,
 * and on edit an immediate upload would survive Cancel. Holding an intent
 * makes both flows behave the same and keeps Cancel honest.
 */
export type IconIntent =
  | { kind: "keep" }
  | { kind: "file"; file: File }
  | { kind: "url"; url: string }
  | { kind: "remove" };

interface CategoryIconFieldProps {
  /** The icon already stored on the category, if it has one. */
  currentUrl?: string;
  value: IconIntent;
  onChange: (intent: IconIntent) => void;
}

export function CategoryIconField({
  currentUrl,
  value,
  onChange,
}: CategoryIconFieldProps) {
  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkDraft, setLinkDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  /* Derived rather than stored: holding the handle in state would mean an
     effect writing state on every intent change, and a render cascade with
     it. The effect below only cleans up. */
  const objectUrl = useMemo(
    () => (value.kind === "file" ? URL.createObjectURL(value.file) : null),
    [value],
  );

  useEffect(() => {
    if (!objectUrl) return;
    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  const accept = (file: File) => {
    const reason = validateIconFile(file);
    if (reason) {
      setError(reason);
      return;
    }
    setError(null);
    onChange({ kind: "file", file });
  };

  const preview =
    value.kind === "file"
      ? objectUrl
      : value.kind === "url"
        ? value.url
        : value.kind === "keep"
          ? (currentUrl ?? null)
          : null;

  const clear = () => {
    setLinkDraft("");
    setError(null);
    // Only an icon that exists upstream needs deleting; anything staged in
    // this session just goes back to whatever was there before.
    onChange(currentUrl ? { kind: "remove" } : { kind: "keep" });
  };

  return (
    /* min-w-0: this sits in a grid track, and grid items refuse to shrink
       below their content without it. */
    <div className="min-w-0 space-y-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Icon
        </span>

        {!preview && (
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

      {preview ? (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt=""
              className="size-full object-contain p-1.5"
              onError={() => setError("That image could not be loaded")}
            />
          </span>

          {/* Deliberately not the file name or the URL: either can be
              arbitrarily long, and a grid item defaults to min-width:auto, so
              one long unbroken string would widen the whole dialog instead of
              truncating. These labels are fixed-length by construction. */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {value.kind === "file"
                ? "New upload"
                : value.kind === "url"
                  ? "From URL"
                  : "Current icon"}
            </p>
            <p className="text-xs text-slate-500">
              {value.kind === "keep" ? "Unchanged" : "Applied when you save"}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
              aria-label="Replace icon"
            >
              <Upload className="size-4" />
            </button>
            <button
              type="button"
              onClick={clear}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
              aria-label="Remove icon"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      ) : mode === "link" ? (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={linkDraft}
              onChange={(event) => setLinkDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  if (linkDraft.trim())
                    onChange({ kind: "url", url: linkDraft.trim() });
                }
              }}
              placeholder="https://…/icon.svg"
              className="h-11 rounded-xl border-slate-300 bg-white pl-9 text-base dark:border-slate-700"
            />
          </div>
          <Button
            type="button"
            onClick={() =>
              linkDraft.trim() && onChange({ kind: "url", url: linkDraft.trim() })
            }
            className="h-11 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Use
          </Button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            const file = event.dataTransfer.files?.[0];
            if (file) accept(file);
          }}
          className={cn(
            "flex w-full items-center gap-3 rounded-xl border-2 border-dashed p-4 text-left transition-colors",
            dragging
              ? "border-blue-500 bg-blue-50/60"
              : "border-slate-300 hover:border-blue-400 dark:border-slate-700",
          )}
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-2xs dark:bg-slate-800">
            <ImagePlus className="size-5" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Drop an icon or click to browse
            </span>
            <span className="block text-xs text-slate-500">
              PNG, JPG, WebP or SVG · up to 1MB
            </span>
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/svg+xml"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) accept(file);
          // Let the same file be re-picked after a rejected attempt.
          event.target.value = "";
        }}
      />

      {error && <p className="text-sm font-medium text-rose-600">{error}</p>}
    </div>
  );
}
