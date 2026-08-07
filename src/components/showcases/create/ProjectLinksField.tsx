"use client";

import React from "react";
import { useFormContext } from "react-hook-form";
// lucide-react v1 dropped its brand icons, so the repo link borrows the
// generic VCS glyph the landing page already uses for source.
import { GitBranch, Globe, Video } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { hostOf, type CreateShowcaseFormValues } from "@/lib/validations/showcase";

type LinkField = {
  name: "repoUrl" | "liveUrl" | "videoUrl";
  label: string;
  placeholder: string;
  icon: LucideIcon;
};

const LINKS: LinkField[] = [
  {
    name: "repoUrl",
    label: "GitHub repo",
    placeholder: "github.com/you/project",
    icon: GitBranch,
  },
  {
    name: "liveUrl",
    label: "Live demo",
    placeholder: "yourproject.com",
    icon: Globe,
  },
  {
    name: "videoUrl",
    label: "Video demo",
    placeholder: "youtube.com/watch?v=…",
    icon: Video,
  },
];

/**
 * The three first-class project links. Each one echoes the host it resolved
 * to, which is how a typo like `guthub.com` becomes visible before publish —
 * the scheme is added at validation time, so what you see is what is stored.
 */
export function ProjectLinksField() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<CreateShowcaseFormValues>();

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const raw = watch(link.name) ?? "";
        const host = hostOf(raw);
        const error = errors[link.name]?.message;

        return (
          <div key={link.name} className="space-y-2">
            <label
              htmlFor={link.name}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-900 dark:text-slate-100"
            >
              <Icon className="size-4 text-slate-400" />
              {link.label}
            </label>

            <Input
              id={link.name}
              inputMode="url"
              placeholder={link.placeholder}
              {...register(link.name)}
              className="h-11 rounded-xl border-slate-300 bg-white text-base dark:border-slate-700"
            />

            {error ? (
              <p className="text-sm font-medium text-rose-600">{error}</p>
            ) : host ? (
              <span className="inline-flex max-w-full items-center gap-1 truncate rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {host}
              </span>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
