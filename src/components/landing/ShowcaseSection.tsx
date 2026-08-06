"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Award, Flame, ShieldCheck, Trophy, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionBackdrop, { PRIMARY, SECONDARY } from "./SectionBackdrop";

/* Severity is an ordered scale, so the breakdown rides an ink-weight ramp
   rather than unrelated hues. Each tier is labelled with its count, so the
   ordering never depends on colour alone. */
const TIERS = [
  { key: "critical", label: "Critical", color: SECONDARY },
  { key: "high", label: "High", color: "#94A3B8" },
  { key: "medium", label: "Medium", color: "#E2E8F0" },
] as const;

type Researcher = {
  handle: string;
  rank: number;
  title: string;
  points: number;
  critical: number;
  high: number;
  medium: number;
  solved: number;
  badges: { icon: LucideIcon; label: string }[];
};

const RESEARCHERS: Researcher[] = [
  {
    handle: "0xShadow",
    rank: 1,
    title: "Application security · Go, Rust",
    points: 12400,
    critical: 9,
    high: 21,
    medium: 34,
    solved: 118,
    badges: [
      { icon: Trophy, label: "Top of the board" },
      { icon: ShieldCheck, label: "12 critical findings" },
      { icon: Flame, label: "40-week streak" },
    ],
  },
  {
    handle: "kmartens",
    rank: 2,
    title: "Cloud & infrastructure · AWS",
    points: 9870,
    critical: 6,
    high: 18,
    medium: 41,
    solved: 204,
    badges: [
      { icon: Award, label: "Most accepted answers" },
      { icon: ShieldCheck, label: "Verified researcher" },
    ],
  },
  {
    handle: "h4xor99",
    rank: 3,
    title: "Mobile & API · Android, Kotlin",
    points: 7210,
    critical: 4,
    high: 12,
    medium: 28,
    solved: 76,
    badges: [
      { icon: Zap, label: "Fastest first report" },
      { icon: Flame, label: "18-week streak" },
    ],
  },
];

/* ─── Severity breakdown — stacked bar, 2px surface gaps ───────────── */
function SeverityBar({
  data,
  inView,
  delay = 0,
}: {
  data: Pick<Researcher, "critical" | "high" | "medium">;
  inView: boolean;
  delay?: number;
}) {
  const total = data.critical + data.high + data.medium;
  const segments = [
    { ...TIERS[0], value: data.critical },
    { ...TIERS[1], value: data.high },
    { ...TIERS[2], value: data.medium },
  ];

  return (
    <div className="flex h-1.5 w-full gap-0.5" aria-hidden>
      {segments.map((seg, i) => (
        <motion.span
          key={seg.key}
          className="h-full rounded-full"
          style={{ backgroundColor: seg.color }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${(seg.value / total) * 100}%` } : undefined}
          transition={{ duration: 0.8, delay: delay + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export function ShowcaseSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      <SectionBackdrop seed={5} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end"
        >
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <span className="h-px w-8" style={{ backgroundColor: SECONDARY }} />
              <span
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: SECONDARY }}
              >
                Showcase
              </span>
            </div>
            <h2
              className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
              style={{ color: SECONDARY }}
            >
              Proof, not claims
              <span style={{ color: PRIMARY }}>.</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-relaxed text-slate-500">
            Accepted reports and marked solutions compound into a public profile.
            One link that shows what you found, fixed and answered.
          </p>
        </motion.div>

        {/* Legend — identity never rests on colour alone */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2"
        >
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Findings by severity
          </span>
          {TIERS.map((t) => (
            <span key={t.key} className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: t.color }}
                aria-hidden
              />
              {t.label}
            </span>
          ))}
        </motion.div>

        {/* ── Profile cards ── */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {RESEARCHERS.map((r, i) => (
            <motion.article
              key={r.handle}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col rounded-2xl bg-white p-6 shadow-[0_0_0_1px_rgba(30,41,59,0.08),0_2px_10px_rgba(30,41,59,0.05)] transition-shadow hover:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_10px_28px_-14px_rgba(30,41,59,0.35)]"
            >
              {/* identity */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-base font-bold text-white"
                    style={{ backgroundColor: i === 0 ? PRIMARY : SECONDARY }}
                  >
                    {r.handle.replace(/^0x/, "").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold tracking-tight" style={{ color: SECONDARY }}>
                      {r.handle}
                    </h3>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{r.title}</p>
                  </div>
                </div>

                <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-500">
                  #{r.rank}
                </span>
              </div>

              {/* reputation */}
              <div className="mt-6">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Reputation</p>
                <p
                  className="mt-1 text-3xl font-bold leading-none tracking-tight"
                  style={{ color: SECONDARY }}
                >
                  {r.points.toLocaleString()}
                </p>
              </div>

              {/* severity breakdown */}
              <div className="mt-6">
                <SeverityBar data={r} inView={inView} delay={0.35 + i * 0.12} />
                <dl className="mt-3 flex items-center justify-between text-xs">
                  {[
                    { label: "Critical", value: r.critical },
                    { label: "High", value: r.high },
                    { label: "Medium", value: r.medium },
                  ].map((s) => (
                    <div key={s.label} className="flex items-baseline gap-1.5">
                      <dt className="text-slate-400">{s.label}</dt>
                      <dd className="font-bold" style={{ color: SECONDARY }}>
                        {s.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* badges */}
              <ul className="mt-6 space-y-2 border-t border-slate-200 pt-5">
                {r.badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <li key={b.label} className="flex items-center gap-2.5 text-sm text-slate-500">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Icon className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                      </span>
                      {b.label}
                    </li>
                  );
                })}
              </ul>

              <p className="mt-5 border-t border-slate-200 pt-5 text-sm text-slate-400">
                <span className="font-bold" style={{ color: SECONDARY }}>
                  {r.solved}
                </span>{" "}
                accepted solutions
              </p>
            </motion.article>
          ))}
        </div>

        {/* ── Footer CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-start justify-between gap-5 border-t border-slate-200 pt-8 sm:flex-row sm:items-center"
        >
          <p className="max-w-md text-sm text-slate-500">
            Rankings are weighted by severity and by how often an answer gets reused
            — not by how much you post.
          </p>
          <Link
            href="/leaderboard"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110"
            style={{ backgroundColor: SECONDARY }}
          >
            See the full leaderboard
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default ShowcaseSection;
