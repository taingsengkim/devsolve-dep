"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Heart,
  Radar,
  Rocket,
  RotateCw,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionBackdrop, { ACCENT, PRIMARY, SECONDARY } from "./SectionBackdrop";

const MUTED = "#CBD5E1";

/* Shared editorial vocabulary — hairline borders, square corners, and
   uppercase micro-labels, the same language the rest of the landing page
   is written in. */
const CARD =
  "rounded-lg border border-slate-200 bg-white shadow-[0_18px_40px_-24px_rgba(15,23,42,0.4)] transition-shadow duration-300 hover:shadow-[0_26px_54px_-26px_rgba(37,99,235,0.5)]";
const LABEL = "text-xs font-bold uppercase tracking-[0.16em] text-slate-400";

/* ─── Kinetic headline — per-character rise ────────────────────────── */
function RevealLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const words = text.split(" ");
  let charIndex = 0;

  return (
    <>
      {words.map((word, wi) => (
        <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
          {Array.from(word).map((char) => {
            const i = charIndex++;
            return (
              <motion.span
                key={`${char}-${i}`}
                /* No blur filter: it settles at blur(0px) and leaves every
                   character on its own raster layer for good. */
                initial={{ opacity: 0, y: "0.62em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.62,
                  delay: delay + i * 0.028,
                  ease: [0.34, 1.4, 0.64, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

/* ─── Counting numerals ────────────────────────────────────────────── */
function CountUp({
  to,
  prefix = "",
  decimals = 0,
  delay = 0,
}: {
  to: number;
  prefix?: string;
  decimals?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const value = useMotionValue(0);
  const text = useTransform(
    value,
    (v) =>
      `${prefix}${v.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}`,
  );

  useEffect(() => {
    if (reduce) {
      value.set(to);
      return;
    }

    const controls = animate(value, to, {
      duration: 1.4,
      delay,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [to, delay, reduce, value]);

  return <motion.span>{text}</motion.span>;
}

/* ════════════════════════════════════════════════════════════════════
   THE FLOATING CLUSTER
   Product surfaces, shown rather than claimed. Parallax is translate-only
   — a 3D rotation would rasterise the subtree and soften the text.
   ════════════════════════════════════════════════════════════════════ */

function FloatCard({
  px,
  py,
  depth,
  position,
  delay,
  drift,
  duration,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  position: string;
  delay: number;
  drift: number;
  duration: number;
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth * 0.7);

  return (
    <motion.div
      className={`absolute ${position}`}
      initial={{ opacity: 0, y: 36, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -12 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* parallax lives on its own layer so it never fights the entrance */}
      <motion.div style={{ x, y }}>
        <motion.div
          /* Idle drift pauses under the cursor, and has to settle quickly
             rather than over the drift's own period. */
          animate={reduce || isHovered ? { y: 0 } : { y: [0, drift, 0] }}
          transition={
            isHovered
              ? { duration: 0.3, ease: "easeOut" }
              : { duration, repeat: Infinity, ease: "easeInOut" }
          }
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ── Findings by lifecycle stage ─────────────────────────────────── */
const STAGE_BARS = [
  { label: "Plan", value: 14 },
  { label: "Build", value: 30 },
  { label: "Test", value: 95, peak: true },
  { label: "Triage", value: 68 },
  { label: "Fix", value: 44 },
  { label: "Ship", value: 18 },
];

function StageBarsCard() {
  const reduce = useReducedMotion();

  return (
    <div className={`${CARD} w-71.5 p-4`}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <p
          className="text-sm font-bold tracking-tight"
          style={{ color: SECONDARY }}
        >
          Findings by stage
          <span style={{ color: PRIMARY }}>.</span>
        </p>
        <span className="font-mono text-xs tracking-[0.16em] text-slate-400">
          [ 30D ]
        </span>
      </div>

      <div className="relative mt-5 flex h-30 items-end justify-between gap-2">
        {STAGE_BARS.map((bar, i) => (
          <div
            key={bar.label}
            className="relative flex h-full flex-1 flex-col justify-end"
          >
            {bar.peak && (
              <motion.span
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.4, ease: "easeOut" }}
                className="absolute -top-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-bold tabular-nums text-white"
                style={{ backgroundColor: SECONDARY }}
              >
                38 found
              </motion.span>
            )}

            <motion.span
              className="block w-full rounded-t-sm"
              style={{ backgroundColor: bar.peak ? PRIMARY : "#E2E8F0" }}
              initial={{ height: 0 }}
              animate={{ height: `${bar.value}%` }}
              transition={{
                duration: reduce ? 0 : 0.9,
                delay: 0.9 + i * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 flex justify-between gap-2">
        {STAGE_BARS.map((bar) => (
          <span
            key={bar.label}
            className={`flex-1 text-center text-xs font-medium ${
              bar.peak ? "text-slate-900" : "text-slate-400"
            }`}
          >
            {bar.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── Live triage status ──────────────────────────────────────────── */
function TriageCard() {
  return (
    <div
      className="w-59 rounded-lg border border-white/10 p-4 shadow-[0_22px_50px_-24px_rgba(15,23,42,0.85)] transition-shadow duration-300 hover:shadow-[0_30px_62px_-26px_rgba(15,23,42,0.95)]"
      style={{ backgroundColor: "#0F172A" }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
        <span className="flex items-center gap-2 text-sm font-bold text-white">
          <ShieldCheck className="size-4 text-emerald-400" />
          Report #4821
        </span>
      </div>

      <p className="mt-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
        Rewarded
      </p>
      <div className="mt-1 flex items-end justify-between gap-2">
        <p className="text-3xl font-bold tabular-nums tracking-[-0.04em] text-white">
          <CountUp to={4500} prefix="$" delay={1.3} />
        </p>
        <span className="mb-1 flex items-center gap-0.5 rounded-md bg-emerald-500/15 px-1.5 py-0.5 text-xs font-bold tabular-nums text-emerald-400">
          9.8
          <ArrowUpRight className="size-3" />
        </span>
      </div>

      <p className="mt-3 font-mono text-xs tracking-[0.12em] text-slate-500">
        CRITICAL · TRIAGED 6H
      </p>
    </div>
  );
}

/* ── Severity mix ────────────────────────────────────────────────── */
const R = 46;
const CIRC = 2 * Math.PI * R;

/* Arc lengths and start rotations resolved up front — walking a running
   total during render would mutate across re-renders. */
const SEGMENTS = (() => {
  let travelled = 0;

  return [
    { label: "Critical", fraction: 0.18, color: "#E11D48" },
    { label: "High", fraction: 0.26, color: "#F59E0B" },
    { label: "Medium", fraction: 0.34, color: PRIMARY },
    { label: "Low", fraction: 0.22, color: ACCENT },
  ].map((seg) => {
    const length = seg.fraction * CIRC;
    const rotation = (travelled / CIRC) * 360;
    travelled += length;

    return { ...seg, length, rotation };
  });
})();

function SeverityCard() {
  const reduce = useReducedMotion();

  return (
    <div className={`${CARD} w-67 p-4`}>
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-3">
        <p
          className="text-sm font-bold tracking-tight"
          style={{ color: SECONDARY }}
        >
          Severity mix
          <span style={{ color: ACCENT }}>.</span>
        </p>
        <span className="font-mono text-xs tracking-[0.16em] text-slate-400">
          [ OPEN ]
        </span>
      </div>

      <div className="relative mx-auto mt-4 size-32">
        <svg viewBox="0 0 120 120" className="size-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={R}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth="13"
          />
          {SEGMENTS.map((seg) => (
            <motion.circle
              key={seg.label}
              cx="60"
              cy="60"
              r={R}
              fill="none"
              stroke={seg.color}
              strokeWidth="13"
              strokeLinecap="round"
              strokeDasharray={`${Math.max(seg.length - 5, 1)} ${CIRC}`}
              transform={`rotate(${seg.rotation} 60 60)`}
              initial={{ strokeDashoffset: seg.length }}
              animate={{ strokeDashoffset: 0 }}
              transition={{
                duration: reduce ? 0 : 1.1,
                delay: 1.2,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          ))}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-3xl font-bold tabular-nums tracking-tighter"
            style={{ color: SECONDARY }}
          >
            <CountUp to={128} delay={1.3} />
          </span>
          <span className={LABEL}>reports</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-1.5 border-t border-slate-100 pt-3">
        {SEGMENTS.map((seg) => (
          <span
            key={seg.label}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: seg.color }}
            />
            {seg.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ── The build artefact: a slowly turning isometric block ────────── */
function PrismBlock() {
  const reduce = useReducedMotion();

  return (
    <motion.div
      animate={reduce ? undefined : { rotate: [0, 4, 0, -4, 0] }}
      transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      className="relative size-32"
    >
      <span className="absolute bottom-1 left-1/2 h-4 w-20 -translate-x-1/2 rounded-[50%] bg-slate-900/20 blur-md" />
      <svg viewBox="0 0 120 120" className="relative size-full">
        <defs>
          <linearGradient id="prism-top" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F8FAFC" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
          <linearGradient id="prism-left" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#94A3B8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="prism-right" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="100%" stopColor="#64748B" />
          </linearGradient>
        </defs>

        <polygon points="60,12 104,38 60,64 16,38" fill="url(#prism-top)" />
        <polygon points="16,38 60,64 60,108 16,82" fill="url(#prism-left)" />
        <polygon points="104,38 60,64 60,108 104,82" fill="url(#prism-right)" />

        {!reduce && (
          <motion.polygon
            points="60,12 104,38 60,64 16,38"
            fill="#fff"
            animate={{ opacity: [0, 0.55, 0] }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2.5,
            }}
          />
        )}
      </svg>
    </motion.div>
  );
}

function ShowcaseCluster() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 90, damping: 20, mass: 0.5 };
  const px = useSpring(rawX, spring);
  const py = useSpring(rawY, spring);

  useEffect(() => {
    if (reduce) return;

    const handleMove = (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      rawX.set(
        Math.max(
          -1,
          Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
        ),
      );
      rawY.set(
        Math.max(
          -1,
          Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
        ),
      );
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [rawX, rawY, reduce]);

  return (
    <div ref={ref} className="relative h-100 w-full sm:h-117.5 lg:h-135">
      {/* glow pooled behind the cluster so white cards read on white */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 size-120 max-w-[130vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(37,99,235,0.13), rgba(16,185,129,0.09) 45%, transparent 70%)",
        }}
      />

      {/* Fixed canvas, scaled as a unit so the composition never reflows */}
      <div className="absolute left-1/2 top-1/2 h-130 w-140 -translate-x-1/2 -translate-y-1/2 scale-[0.6] sm:scale-[0.78] lg:scale-100">
        <FloatCard
          px={px}
          py={py}
          depth={10}
          position="left-0 top-28"
          delay={0.75}
          drift={-10}
          duration={7}
        >
          <StageBarsCard />
        </FloatCard>

        <FloatCard
          px={px}
          py={py}
          depth={22}
          position="right-2 top-0"
          delay={0.95}
          drift={11}
          duration={6.2}
        >
          <TriageCard />
        </FloatCard>

        <FloatCard
          px={px}
          py={py}
          depth={16}
          position="bottom-4 right-0"
          delay={1.1}
          drift={-9}
          duration={7.6}
        >
          <SeverityCard />
        </FloatCard>

        <FloatCard
          px={px}
          py={py}
          depth={34}
          position="bottom-0 left-[36%]"
          delay={1.25}
          drift={-14}
          duration={5.4}
        >
          <PrismBlock />
        </FloatCard>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THE SDLC RAIL
   ════════════════════════════════════════════════════════════════════ */

type Stage = { name: string; icon: LucideIcon; caption: string };

const STAGES: Stage[] = [
  {
    name: "Plan",
    icon: Target,
    caption: "Scope your assets, set reward tiers, publish the program.",
  },
  {
    name: "Build",
    icon: Code2,
    caption: "Your team ships — DevSolve keeps watching the attack surface.",
  },
  {
    name: "Test",
    icon: Radar,
    caption: "Researchers probe every in-scope asset and file real findings.",
  },
  {
    name: "Triage",
    icon: ShieldCheck,
    caption: "Reports get validated, scored on CVSS, and rewarded.",
  },
  {
    name: "Fix",
    icon: Wrench,
    caption: "Root cause becomes a patch, reviewed in the open.",
  },
  {
    name: "Deploy",
    icon: Rocket,
    caption: "The fix ships and the finding is verified closed.",
  },
  {
    name: "Share",
    icon: Heart,
    caption: "Write-ups and showcases turn one fix into public knowledge.",
  },
];

function SdlcRail() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduce) return;

    const id = setInterval(
      () => setActive((current) => (current + 1) % STAGES.length),
      1800,
    );

    return () => clearInterval(id);
  }, [reduce]);

  const progress = (active / (STAGES.length - 1)) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.35, ease: [0.22, 1, 0.36, 1] }}
      className="border-t border-slate-200 pb-6 pt-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p
          className="text-sm font-bold tracking-tight"
          style={{ color: SECONDARY }}
        >
          Wired into your development lifecycle
          <span style={{ color: PRIMARY }}>.</span>
        </p>
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          <motion.span
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="inline-flex"
          >
            <RotateCw className="size-3.5" />
          </motion.span>
          Every fix feeds the next cycle
        </p>
      </div>

      {/* Narrow screens scroll the rail rather than shrink the labels past
          readability. `overflow-x-auto` also computes overflow-y to auto, so
          the vertical padding is what keeps the active node's halo from
          being sliced off at the top. */}
      <div className="relative overflow-x-auto pb-1 pt-7 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="relative mx-auto min-w-155 max-w-4xl px-6">
          {/* Track spans first node centre to last — 1.5rem of padding plus
              half of a 5rem stage column. */}
          <div className="absolute inset-x-16 top-5 h-0.5 rounded-full bg-slate-200/90" />

          <motion.div
            className="absolute left-16 top-5 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(to right, ${PRIMARY}, ${ACCENT})`,
              maxWidth: "calc(100% - 8rem)",
            }}
            animate={{ width: `calc((100% - 8rem) * ${progress / 100})` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {!reduce && (
            <motion.span
              className="absolute top-3.75 size-2 rounded-full"
              style={{
                backgroundColor: ACCENT,
                boxShadow: `0 0 12px 3px ${ACCENT}66`,
              }}
              animate={{ left: ["4rem", "calc(100% - 4rem)"] }}
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
                repeatDelay: 1.2,
              }}
            />
          )}

          <ol className="relative flex items-start justify-between">
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const isActive = i === active;
              const isDone = i < active;

              return (
                <li
                  key={stage.name}
                  className="flex w-20 flex-col items-center gap-2"
                >
                  <span className="relative flex size-10 items-center justify-center">
                    {isActive && !reduce && (
                      <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: PRIMARY }}
                        initial={{ opacity: 0.35, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.9 }}
                        transition={{
                          duration: 1.6,
                          repeat: Infinity,
                          ease: "easeOut",
                        }}
                      />
                    )}

                    <motion.span
                      className="relative flex size-10 items-center justify-center rounded-full ring-1 transition-colors duration-300"
                      animate={{ scale: isActive ? 1.12 : 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 22,
                      }}
                      style={
                        isActive
                          ? {
                              backgroundColor: PRIMARY,
                              color: "#fff",
                              boxShadow: `0 8px 20px -8px ${PRIMARY}`,
                            }
                          : isDone
                            ? { backgroundColor: "#ECFDF5", color: ACCENT }
                            : { backgroundColor: "#fff", color: MUTED }
                      }
                    >
                      <Icon className="size-4.5" />
                    </motion.span>
                  </span>

                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      isActive
                        ? "text-slate-900"
                        : isDone
                          ? "text-emerald-600"
                          : "text-slate-400"
                    }`}
                  >
                    {stage.name}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="flex h-10 items-start justify-center pt-2">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-lg text-center text-sm leading-[1.8] text-slate-500 sm:text-[15px]"
          >
            {STAGES[active].caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   WHO IT IS FOR — shown, rather than a traction number we do not have.
   ════════════════════════════════════════════════════════════════════ */

const ROLES = [
  { label: "Hackers", text: "hunt bugs, earn bounties" },
  { label: "Companies", text: "run programs, ship fixes" },
  { label: "Community", text: "solve problems, showcase work" },
];

/* ════════════════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════════════════ */

export function Hero() {
  return (
    // Full bleed, square to the viewport edges. The negative margin cancels
    // the layout's navbar padding so the backdrop runs to the very top and
    // the nav island floats over it.
    <section className="relative -mt-(--navbar-height) bg-white">
      <div className="relative flex min-h-dvh w-full flex-col overflow-hidden">
        <SectionBackdrop seed={2} gridSize={88} />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-6 pb-6 pt-(--navbar-height) sm:px-12 lg:grid-cols-[0.95fr_1.1fr] lg:gap-12">
          {/* ── the pitch ── */}
          <div className="pt-8 lg:pt-0">
            <div className="mb-4 flex items-center gap-2.5">
              <motion.span
                className="h-px"
                style={{ backgroundColor: PRIMARY }}
                initial={{ width: 0 }}
                animate={{ width: 32 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-[0.22em]"
                style={{ color: PRIMARY }}
              >
                Bug bounty · Problems · Showcases
              </span>
            </div>

            <h1
              className="font-bold leading-[1.02] tracking-[-0.045em]"
              style={{ color: SECONDARY, fontSize: "clamp(40px, 5vw, 72px)" }}
            >
              <span className="block">
                <RevealLine text="Find bugs" delay={0.12} />
                <span style={{ color: PRIMARY }}>.</span>
              </span>
              <span className="block">
                <RevealLine text="Share fixes" delay={0.3} />
                <span style={{ color: ACCENT }}>.</span>
              </span>
              <span className="block">
                <RevealLine text="Ship secure" delay={0.5} />
                <span style={{ color: PRIMARY }}>.</span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.78, ease: "easeOut" }}
              className="mt-7 max-w-md text-sm leading-[1.8] text-slate-500 sm:text-[15px]"
            >
              DevSolve joins reward-based bounty programs to a developer
              community that solves problems in the open — so a finding becomes
              a patch, and a patch becomes knowledge anyone can search.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
              className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
            >
              <Link
                href="/account-type"
                className="group inline-flex items-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold text-white transition-[filter] hover:brightness-110"
                style={{
                  backgroundColor: PRIMARY,
                  boxShadow: "0 12px 30px -14px rgba(37,99,235,0.95)",
                }}
              >
                Get started free
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>

              <Link
                href="/programs"
                className="group inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                style={{ color: SECONDARY }}
              >
                Browse live programs
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { delayChildren: 1.05, staggerChildren: 0.1 },
                },
              }}
              className="mt-9 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-slate-200 pt-5"
            >
              {ROLES.map((role) => (
                <motion.li
                  key={role.label}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="flex items-baseline gap-2"
                >
                  <span
                    className="text-xs font-bold uppercase tracking-[0.18em]"
                    style={{ color: SECONDARY }}
                  >
                    {role.label}
                  </span>
                  <span className="text-sm text-slate-400">{role.text}</span>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ── product surfaces ── */}
          <ShowcaseCluster />
        </div>

        {/* ── the lifecycle rail ── */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-12">
          <SdlcRail />
        </div>
      </div>
    </section>
  );
}

export default Hero;
