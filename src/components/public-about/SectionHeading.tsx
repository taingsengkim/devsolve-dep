"use client";

import React from "react";
import { motion } from "motion/react";
import { useInk } from "@/components/landing/SectionBackdrop";

export const BRAND_INK = "text-[#2563EB] dark:text-blue-400";

interface SectionHeadingProps {
  kicker: string;
  title: string;
  lede?: string;
  inView: boolean;
}

export function SectionHeading({
  kicker,
  title,
  lede,
  inView,
}: SectionHeadingProps) {
  const ink = useInk();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end dark:border-neutral-800"
    >
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="h-px w-8 bg-[#2563EB] dark:bg-blue-400" />
          <span
            className={`text-xs font-bold uppercase tracking-[0.22em] ${BRAND_INK}`}
          >
            {kicker}
          </span>
        </div>

        <h2
          className="max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
          style={{ color: ink }}
        >
          {title}
          <span className={BRAND_INK}>.</span>
        </h2>
      </div>

      {lede && (
        <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-neutral-400">
          {lede}
        </p>
      )}
    </motion.div>
  );
}
