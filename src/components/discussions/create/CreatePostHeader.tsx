"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface CreatePostHeaderProps {
  title: string;
  subtitle: string;
  badgeText?: string;
  badgeColor?: "blue" | "purple";
  backHref?: string;
}

export function CreatePostHeader({
  title,
  subtitle,
  badgeText,
  badgeColor = "blue",
  backHref = "/discussions",
}: CreatePostHeaderProps) {
  return (
    <div className="space-y-4">
      {/* Back button */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors group"
      >
        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Discussions</span>
      </Link>

      {/* Header title & subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {badgeText && (
              <span
                className={`rounded-lg px-3 py-1 text-xs font-bold ${
                  badgeColor === "purple"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-blue-100 text-blue-800 border border-blue-200"
                }`}
              >
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-base text-slate-700 leading-relaxed">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
