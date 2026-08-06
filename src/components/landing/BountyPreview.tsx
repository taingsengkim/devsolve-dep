"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, Bug, Clock3, Cpu, Globe, Shield, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionBackdrop, { ACCENT, PRIMARY, SECONDARY } from "./SectionBackdrop";

/* ─── Programs ──────────────────────────────────────────────────────── */
type Severity = "Critical" | "High" | "Medium";

type Program = {
  name: string;
  tag: string;
  scope: string[];
  min: number;
  max: number;
  severity: Severity;
  reports: number;
  triageDays: number;
  icon: LucideIcon;
};

const FEATURED: Program = {
  name: "Nexus AI",
  tag: "AI / ML",
  scope: ["API", "Web", "LLM"],
  min: 1000,
  max: 50000,
  severity: "Critical",
  reports: 72,
  triageDays: 3,
  icon: Cpu,
};

const PROGRAMS: Program[] = [
  {
    name: "Phantom Finance",
    tag: "Fintech",
    scope: ["Web", "API", "Mobile"],
    min: 500,
    max: 20000,
    severity: "Critical",
    reports: 48,
    triageDays: 5,
    icon: Shield,
  },
  {
    name: "Buildflow Cloud",
    tag: "Cloud",
    scope: ["Web", "Infrastructure"],
    min: 250,
    max: 10000,
    severity: "High",
    reports: 31,
    triageDays: 4,
    icon: Globe,
  },
  {
    name: "DevOps Matrix",
    tag: "DevOps",
    scope: ["CI/CD", "Containers"],
    min: 300,
    max: 8000,
    severity: "Medium",
    reports: 19,
    triageDays: 6,
    icon: Zap,
  },
];

const CEILING = Math.max(FEATURED.max, ...PROGRAMS.map((p) => p.max));

const money = (n: number) => `$${n.toLocaleString()}`;

/* Severity is an ordered scale, so it rides an ink-weight ramp rather than a
   set of unrelated hues — heavier ink reads as more severe. Every chip is
   text-labelled, so the ordering never depends on colour alone. */
const SEVERITY_CHIP: Record<Severity, string> = {
  Critical: "bg-[#1E293B] text-white",
  High: "bg-slate-200 text-slate-700",
  Medium: "border border-slate-200 text-slate-500",
};

/* ─── Reward reach — max payout relative to the highest on the board ── */
function RewardBar({ max, delay = 0 }: { max: number; delay?: number }) {
  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200" aria-hidden>
      <motion.div
        className="h-full"
        style={{ backgroundColor: PRIMARY, borderRadius: "0 4px 4px 0" }}
        initial={{ width: 0 }}
        whileInView={{ width: `${(max / CEILING) * 100}%` }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

/* ─── Live indicator ────────────────────────────────────────────────── */
function LivePill() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-70"
          style={{ backgroundColor: ACCENT }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: ACCENT }}
        />
      </span>
      Accepting reports
    </span>
  );
}

/* ─── Section ───────────────────────────────────────────────────────── */
export function BountyPreview() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const FeaturedIcon = FEATURED.icon;

  return (
    <section ref={ref} className="relative overflow-hidden bg-slate-50 py-20 sm:py-24">
      <SectionBackdrop seed={4} gridSize={88} />

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
              <span className="h-px w-8" style={{ backgroundColor: PRIMARY }} />
              <span
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: PRIMARY }}
              >
                Live programs
              </span>
            </div>
            <h2
              className="text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
              style={{ color: SECONDARY }}
            >
              Where the bounties are
              <span style={{ color: PRIMARY }}>.</span>
            </h2>
          </div>

          <Link
            href="/programs"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-2.5 text-sm font-semibold shadow-[0_0_0_1px_rgba(30,41,59,0.12)] transition-colors hover:bg-slate-100 sm:self-auto"
            style={{ color: SECONDARY }}
          >
            All programs
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* ── Featured program + program ledger ── */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-2xl bg-white p-7 shadow-[0_0_0_1px_rgba(30,41,59,0.08),0_2px_10px_rgba(30,41,59,0.05)] lg:col-span-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <FeaturedIcon className="h-5 w-5" style={{ color: PRIMARY }} />
                </span>
                <div>
                  <h3 className="text-lg font-bold tracking-tight" style={{ color: SECONDARY }}>
                    {FEATURED.name}
                  </h3>
                  <p className="text-sm text-slate-400">{FEATURED.tag}</p>
                </div>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.14em]"
                style={{ backgroundColor: "#EFF6FF", color: PRIMARY }}
              >
                Featured
              </span>
            </div>

            {/* Scope */}
            <div className="mt-6 flex flex-wrap gap-2">
              {FEATURED.scope.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* Max payout — the number this card leads with */}
            <div className="mt-7">
              <p className="text-sm font-medium text-slate-500">Maximum payout</p>
              <p
                className="mt-1 text-5xl font-bold leading-none tracking-tighter sm:text-6xl"
                style={{ color: SECONDARY }}
              >
                {money(FEATURED.max)}
              </p>
              <p className="mt-2 text-sm text-slate-400">
                Range {money(FEATURED.min)} – {money(FEATURED.max)}
              </p>
              <div className="mt-4">
                <RewardBar max={FEATURED.max} delay={0.35} />
              </div>
            </div>

            {/* Metrics */}
            <dl className="mt-7 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Reports</dt>
                <dd
                  className="mt-1.5 flex items-center gap-1.5 text-lg font-bold"
                  style={{ color: SECONDARY }}
                >
                  <Bug className="h-4 w-4 text-slate-300" aria-hidden />
                  {FEATURED.reports}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Triage</dt>
                <dd
                  className="mt-1.5 flex items-center gap-1.5 text-lg font-bold"
                  style={{ color: SECONDARY }}
                >
                  <Clock3 className="h-4 w-4 text-slate-300" aria-hidden />
                  {FEATURED.triageDays}d
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-[0.14em] text-slate-400">Top tier</dt>
                <dd className="mt-1.5">
                  <span
                    className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold ${SEVERITY_CHIP[FEATURED.severity]}`}
                  >
                    {FEATURED.severity}
                  </span>
                </dd>
              </div>
            </dl>

            <div className="mt-7 flex items-center justify-between gap-4 border-t border-slate-200 pt-6">
              <LivePill />
              <Link
                href="/programs"
                className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110"
                style={{ backgroundColor: PRIMARY }}
              >
                View program
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </motion.article>

          {/* Ledger — hairline rows rather than a four-up card grid */}
          <div className="lg:col-span-7">
            <div className="flex items-baseline justify-between border-b border-slate-200 pb-3">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                Also accepting reports
              </span>
              <span className="text-xs font-medium text-slate-400">
                Reward reach vs. {money(CEILING)}
              </span>
            </div>

            {PROGRAMS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="border-b border-slate-200"
                >
                  <Link
                    href="/programs"
                    className="group -mx-4 block rounded-xl px-4 py-6 transition-colors hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100">
                          <Icon className="h-4.5 w-4.5 text-slate-500" />
                        </span>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3
                              className="truncate text-base font-bold tracking-tight"
                              style={{ color: SECONDARY }}
                            >
                              {p.name}
                            </h3>
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
                              {p.tag}
                            </span>
                          </div>
                          <p className="mt-1 truncate text-sm text-slate-400">
                            {p.scope.join(" · ")}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center gap-4 sm:gap-6">
                        <span
                          className={`hidden rounded-lg px-2.5 py-1 text-xs font-bold sm:inline-block ${SEVERITY_CHIP[p.severity]}`}
                        >
                          {p.severity}
                        </span>
                        <span className="hidden items-center gap-1.5 text-sm font-semibold text-slate-500 sm:inline-flex">
                          <Bug className="h-3.5 w-3.5 text-slate-300" aria-hidden />
                          {p.reports}
                        </span>
                        <ArrowUpRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-slate-600" />
                      </div>
                    </div>

                    {/* Reward range + reach */}
                    <div className="mt-4 flex items-center gap-4 pl-13">
                      <span className="w-40 shrink-0 text-sm font-semibold" style={{ color: SECONDARY }}>
                        {money(p.min)} – {money(p.max)}
                      </span>
                      <RewardBar max={p.max} delay={0.3 + i * 0.1} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Company CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl p-7 sm:flex-row sm:items-center"
          style={{ backgroundColor: SECONDARY }}
        >
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
              <Bug className="h-5 w-5 text-white" aria-hidden />
            </span>
            <div>
              <p className="text-base font-bold text-white">Running security in-house?</p>
              <p className="mt-0.5 text-sm text-slate-400">
                Publish a program, set your own tiers, and let the board do the triage queue.
              </p>
            </div>
          </div>

          <Link
            href="/account-type"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:brightness-110"
            style={{ backgroundColor: PRIMARY }}
          >
            Launch a program
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default BountyPreview;
