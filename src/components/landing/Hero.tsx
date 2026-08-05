"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  animate,
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpRight,
  Boxes,
  Check,
  Code2,
  Cpu,
  GitBranch,
  Heart,
  Layers,
  Radar,
  Rocket,
  RotateCw,
  ShieldCheck,
  Star,
  Target,
  Terminal,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ────────────────────────────────────────────────────────────────────
   Brand palette (design.md)
   ──────────────────────────────────────────────────────────────────── */
const PRIMARY = "#2563EB"; // Primary Blue  — key actions, highlights
const SECONDARY = "#1E293B"; // Dark Slate  — dark surfaces, headings
const ACCENT = "#10B981"; // Emerald      — status, accent highlights

/* Deterministic PRNG so server and client render identical positions. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ════════════════════════════════════════════════════════════════════
   BACKDROP — a white fold, so every layer stays a whisper: tinted
   aurora, a survey grid that dissolves at the edges, and rising motes.
   ════════════════════════════════════════════════════════════════════ */

type Blob = {
  color: string;
  className: string;
  path: { x: number[]; y: number[]; scale: number[] };
  duration: number;
  opacity: number;
};

const BLOBS: Blob[] = [
  {
    color: PRIMARY,
    className: "left-[-14%] top-[4%] h-[36rem] w-[36rem]",
    path: { x: [0, 90, -40, 0], y: [0, -60, 50, 0], scale: [1, 1.12, 0.94, 1] },
    duration: 26,
    opacity: 0.14,
  },
  {
    color: ACCENT,
    className: "right-[-12%] top-[16%] h-[32rem] w-[32rem]",
    path: { x: [0, -70, 40, 0], y: [0, 70, -30, 0], scale: [1, 0.92, 1.14, 1] },
    duration: 32,
    opacity: 0.13,
  },
  {
    color: "#6366F1",
    className: "bottom-[-10%] left-1/4 h-[28rem] w-[44rem]",
    path: { x: [0, 60, -60, 0], y: [0, -40, 20, 0], scale: [1, 1.08, 0.96, 1] },
    duration: 38,
    opacity: 0.1,
  },
];

function AuroraField() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[120px] ${blob.className}`}
          style={{ backgroundColor: blob.color, opacity: blob.opacity }}
          animate={reduce ? undefined : blob.path}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Survey grid — the "this surface is being scanned" texture, with two
   beams sweeping it like a scanner pass. */
const CELL = 64;

function SurveyGrid() {
  const reduce = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <pattern
            id="hero-grid"
            width={CELL}
            height={CELL}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${CELL} 0 L 0 0 0 ${CELL}`}
              fill="none"
              stroke={SECONDARY}
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="hero-grid-fade" cx="50%" cy="40%" r="72%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="62%" stopColor="#fff" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="hero-grid-mask">
            <rect width="100%" height="100%" fill="url(#hero-grid-fade)" />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hero-grid)"
          mask="url(#hero-grid-mask)"
        />
      </svg>

      <motion.div
        className="absolute inset-y-0 w-px"
        style={{
          background: `linear-gradient(to bottom, transparent, ${PRIMARY}, transparent)`,
        }}
        animate={
          reduce ? undefined : { left: ["6%", "94%"], opacity: [0, 0.4, 0] }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5,
        }}
      />
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
        }}
        animate={
          reduce ? undefined : { top: ["16%", "88%"], opacity: [0, 0.35, 0] }
        }
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 7,
        }}
      />

      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-white to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white to-transparent" />
    </div>
  );
}

const MOTES = (() => {
  const rand = mulberry32(23);
  return Array.from({ length: 18 }, () => ({
    left: 3 + rand() * 94,
    size: 2 + rand() * 3,
    delay: rand() * 16,
    duration: 16 + rand() * 14,
    drift: (rand() - 0.5) * 70,
    emerald: rand() > 0.55,
  }));
})();

function MoteField() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {MOTES.map((m, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${m.left}%`,
            width: m.size,
            height: m.size,
            backgroundColor: m.emerald ? ACCENT : PRIMARY,
          }}
          animate={{
            y: ["0%", "-1600%"],
            x: [0, m.drift, 0],
            opacity: [0, 0.5, 0.5, 0],
          }}
          transition={{
            duration: m.duration,
            repeat: Infinity,
            delay: m.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SMALL ANIMATED PRIMITIVES
   ════════════════════════════════════════════════════════════════════ */

/* Numbers that tick up once the fold settles — a static figure on a card
   reads as a screenshot, a counting one reads as live. */
function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
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
      })}${suffix}`,
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

function Sparkline() {
  const reduce = useReducedMotion();

  return (
    <svg viewBox="0 0 120 34" className="h-8 w-full" aria-hidden="true">
      <motion.polyline
        points="0,28 16,22 32,25 48,14 64,17 80,8 96,11 120,2"
        fill="none"
        stroke={ACCENT}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduce ? 0 : 1.4, delay: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
}

function MeterBar({
  value,
  color,
  delay,
}: {
  value: number;
  color: string;
  delay: number;
}) {
  const reduce = useReducedMotion();

  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
      <motion.span
        className="block h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: reduce ? 0 : 1, delay, ease: "easeOut" }}
      />
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HEADLINE
   ════════════════════════════════════════════════════════════════════ */

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
                /* No blur filter: it would settle at blur(0px) and leave
                   every character on its own raster layer, softening the
                   headline for good. Offset and opacity carry the reveal. */
                initial={{ opacity: 0, y: "0.55em" }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: delay + i * 0.026,
                  ease: [0.22, 1, 0.36, 1],
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

/* ════════════════════════════════════════════════════════════════════
   THE SDLC PIPELINE
   Seven stages the platform touches. The rail cycles endlessly, because
   a lifecycle that stops is just a checklist.
   ════════════════════════════════════════════════════════════════════ */

type Stage = {
  name: string;
  icon: LucideIcon;
  caption: string;
};

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
    caption: "Reports get validated, scored on CVSS, and rewarded in hours.",
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="mt-4 w-full"
    >
      {/* Narrow screens scroll the rail rather than shrink the labels past
          readability. `overflow-x-auto` also computes overflow-y to auto, so
          the vertical padding is what keeps the active node's halo from being
          sliced off at the top. */}
      <div className="relative overflow-x-auto px-2 pb-2 pt-7 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="relative mx-auto min-w-155 max-w-4xl px-6">
          {/* Track runs first node centre to last node centre — 1.5rem of
              padding plus half of a 5rem stage column. */}
          <div className="absolute inset-x-16 top-5 h-0.5 rounded-full bg-slate-200/90" />

          {/* completed run, redrawn as the cycle advances */}
          <motion.div
            className="absolute left-16 top-5 h-0.5 rounded-full"
            style={{
              background: `linear-gradient(to right, ${PRIMARY}, ${ACCENT})`,
              maxWidth: "calc(100% - 8rem)",
            }}
            animate={{ width: `calc((100% - 8rem) * ${progress / 100})` }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* a pulse that never stops running the pipeline */}
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
                    {/* halo, only on the stage currently running */}
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
                            ? {
                                backgroundColor: "#ECFDF5",
                                color: ACCENT,
                              }
                            : { backgroundColor: "#fff", color: "#94A3B8" }
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

      {/* the running stage explains itself */}
      <div className="relative mt-3 flex h-10 items-start justify-center px-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-lg text-center text-base text-slate-500"
          >
            {STAGES[active].caption}
          </motion.p>
        </AnimatePresence>
      </div>

      <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-400">
        <motion.span
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className="inline-flex"
        >
          <RotateCw className="size-3.5" />
        </motion.span>
        Every fix feeds the next cycle
      </p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THE CARD ARC
   One artefact per lifecycle stage, fanned along a curve.
   ════════════════════════════════════════════════════════════════════ */

type ArcCard = {
  id: string;
  stage: string;
  /* Geometry along the fan, hand-tuned rather than derived so the dark
     cards land where they balance the composition. */
  x: number;
  y: number;
  rotate: number;
  scale: number;
  z: number;
  dark?: boolean;
  /* Outer cards drop away on narrow screens so the arc never crowds. */
  visibility: string;
  body: React.ReactNode;
};

const cardShell =
  "relative flex h-42 w-44 cursor-default flex-col justify-between overflow-hidden rounded-2xl p-3.5 ring-1 transition-shadow duration-300";
/* Opaque, and deliberately no backdrop-blur: a backdrop-filter resamples
   whatever is behind it on every scroll frame, which is what made the cards
   look smeared as the page moved. */
const lightShell = `${cardShell} bg-white ring-slate-900/8 shadow-[0_20px_44px_-20px_rgba(15,23,42,0.45)] hover:shadow-[0_34px_64px_-22px_rgba(37,99,235,0.55)] hover:ring-blue-500/25`;
const darkShell = `${cardShell} bg-slate-950 ring-white/10 shadow-[0_22px_48px_-18px_rgba(15,23,42,0.7)] hover:shadow-[0_34px_64px_-20px_rgba(15,23,42,0.95)] hover:ring-emerald-400/35`;
const eyebrow =
  "text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-400";

const ARC_CARDS: ArcCard[] = [
  {
    id: "plan",
    stage: "Plan",
    x: -430,
    y: 58,
    rotate: -13,
    scale: 0.9,
    z: 10,
    visibility: "hidden lg:block",
    body: (
      <>
        <div>
          <p className={eyebrow}>Plan</p>
          <p className="mt-1.5 text-sm font-semibold leading-tight text-slate-900">
            Program scope
          </p>
        </div>
        <div className="space-y-2">
          <MeterBar value={100} color="#E11D48" delay={1.6} />
          <MeterBar value={62} color={PRIMARY} delay={1.75} />
          <MeterBar value={34} color={ACCENT} delay={1.9} />
        </div>
        <p className="text-xs text-slate-400">
          12 assets · $500–$10k rewards
        </p>
      </>
    ),
  },
  {
    id: "build",
    stage: "Build",
    x: -288,
    y: 20,
    rotate: -8,
    scale: 0.96,
    z: 20,
    visibility: "hidden lg:block",
    body: (
      <>
        <div>
          <p className={eyebrow}>Build</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">
            Build #2841
          </p>
        </div>
        <div className="space-y-1.5">
          {["lint", "unit", "e2e"].map((check, i) => (
            <motion.p
              key={check}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.7 + i * 0.14, duration: 0.35 }}
              className="flex items-center gap-1.5 text-xs font-medium text-slate-600"
            >
              <span className="flex size-3.5 items-center justify-center rounded-full bg-emerald-500 text-white">
                <Check className="size-2" strokeWidth={4} />
              </span>
              {check}
            </motion.p>
          ))}
        </div>
        <p className="font-mono text-xs text-slate-400">a1f39c2</p>
      </>
    ),
  },
  {
    id: "test",
    stage: "Test",
    x: -148,
    y: 2,
    rotate: -4,
    scale: 1,
    z: 30,
    visibility: "block",
    body: (
      <>
        <div>
          <p className={eyebrow}>Test</p>
          <p className="mt-1.5 text-sm font-semibold leading-snug text-slate-900">
            Auth bypass via JWT
          </p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-rose-50 px-2 py-0.5 text-xs font-bold text-rose-600">
              CRITICAL
            </span>
            <span className="text-sm font-bold text-slate-900">
              <CountUp to={9.8} decimals={1} delay={1.6} />
            </span>
          </div>
          <MeterBar value={94} color="#E11D48" delay={1.6} />
          <p className="text-xs text-slate-400">CVSS v3.1 · report #4821</p>
        </div>
      </>
    ),
  },
  {
    id: "triage",
    stage: "Triage",
    x: 0,
    y: -18,
    rotate: 0,
    scale: 1.08,
    z: 40,
    dark: true,
    visibility: "block",
    body: (
      <>
        <div className="flex items-start justify-between">
          <span className="flex size-9 items-center justify-center rounded-xl bg-white/10 text-emerald-400 ring-1 ring-white/15">
            <ShieldCheck className="size-5" />
          </span>
          <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-400">
            VALIDATED
          </span>
        </div>
        <div>
          <p className="text-2xl font-bold tracking-tight text-white">
            <CountUp to={4500} prefix="$" delay={1.5} />
          </p>
          <p className="mt-0.5 text-xs text-slate-400">
            bounty paid · triaged in 6h
          </p>
        </div>
        <Sparkline />
      </>
    ),
  },
  {
    id: "fix",
    stage: "Fix",
    x: 148,
    y: 2,
    rotate: 4,
    scale: 1,
    z: 30,
    visibility: "block",
    body: (
      <>
        <p className={eyebrow}>Fix</p>
        <div className="space-y-1 font-mono text-xs leading-relaxed">
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7, duration: 0.4 }}
            className="truncate rounded bg-rose-50 px-1.5 text-rose-600"
          >
            - verify(token)
          </motion.p>
          <motion.p
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.9, duration: 0.4 }}
            className="truncate rounded bg-emerald-50 px-1.5 text-emerald-700"
          >
            + verify(token, alg)
          </motion.p>
        </div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <GitBranch className="size-3.5" />
          fix/jwt-alg-confusion
        </p>
      </>
    ),
  },
  {
    id: "deploy",
    stage: "Deploy",
    x: 288,
    y: 20,
    rotate: 8,
    scale: 0.96,
    z: 20,
    dark: true,
    visibility: "hidden sm:block",
    body: (
      <>
        <div>
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-slate-500">
            Deploy
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            v2.4.1 shipped
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
          <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white">
            <Check className="size-2.5" strokeWidth={3.5} />
          </span>
          Fix verified closed
        </p>
        <div className="space-y-1.5">
          <span className="block h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.span
              className="block h-full rounded-full bg-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: "99.9%" }}
              transition={{ duration: 1, delay: 2, ease: "easeOut" }}
            />
          </span>
          <p className="text-xs text-slate-500">99.9% uptime held</p>
        </div>
      </>
    ),
  },
  {
    id: "share",
    stage: "Share",
    x: 430,
    y: 58,
    rotate: 13,
    scale: 0.9,
    z: 10,
    visibility: "hidden sm:block",
    body: (
      <>
        <div className="relative h-12 w-full overflow-hidden rounded-lg bg-linear-to-br from-blue-500 to-indigo-600">
          <div className="absolute inset-0 opacity-40 bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,rgba(255,255,255,0.35)_6px,rgba(255,255,255,0.35)_7px)]" />
        </div>
        <div>
          <p className={eyebrow}>Share</p>
          <p className="mt-1 text-sm font-semibold leading-tight text-slate-900">
            Realtime diff viewer
          </p>
        </div>
        <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
          <Heart className="size-3.5 fill-rose-500 text-rose-500" />
          <CountUp to={1284} delay={1.8} /> likes
        </p>
      </>
    ),
  },
];

function CardArc() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  /* Pointer parallax: the whole fan banks toward the cursor, which is
     what makes it read as a plane in space rather than a flat row. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const spring = { stiffness: 110, damping: 20, mass: 0.6 };
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [10, -10]), spring);
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [-7, 7]), spring);

  useEffect(() => {
    if (reduce) return;

    const handleMove = (event: PointerEvent) => {
      const rect = ref.current?.getBoundingClientRect();
      if (!rect) return;

      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;

      pointerX.set(Math.max(-1, Math.min(1, nx * 2)));
      pointerY.set(Math.max(-1, Math.min(1, ny * 2)));
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, [pointerX, pointerY, reduce]);

  return (
    <div
      ref={ref}
      className="relative mt-12 h-57.5 w-full sm:h-70 lg:h-76"
      style={{ perspective: 1400 }}
    >
      {/* Glow pooled under the fan so white cards separate from white page */}
      <div
        className="pointer-events-none absolute left-1/2 top-6 h-56 w-208 max-w-[120vw] -translate-x-1/2 rounded-[50%] blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(37,99,235,0.16), rgba(16,185,129,0.12) 45%, transparent 72%)",
        }}
      />

      <motion.div
        className="absolute inset-0 origin-top scale-[0.58] sm:scale-[0.78] lg:scale-100"
        style={{ rotateX, rotateY }}
      >
        {ARC_CARDS.map((card, i) => {
          const isHovered = hovered === card.id;
          const isDimmed = hovered !== null && !isHovered;

          return (
            <motion.div
              key={card.id}
              className="absolute left-1/2 top-0"
              style={{ zIndex: isHovered ? 60 : card.z }}
              initial={{ opacity: 0, y: 90, rotate: card.rotate * 2.2 }}
              animate={{ opacity: 1, y: card.y, rotate: card.rotate }}
              /* Lift clear of the fan and straighten toward level. */
              whileHover={{ y: card.y - 22, rotate: card.rotate * 0.3 }}
              onHoverStart={() => setHovered(card.id)}
              onHoverEnd={() => setHovered(null)}
              transition={{
                duration: 0.9,
                /* Deal outward from the centre, like a hand of cards. */
                delay: 0.95 + Math.abs(i - 3) * 0.09,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {/* Focus layer: the hovered card grows while its neighbours
                  recede, so one artefact reads at a time. */}
              <motion.div
                style={{ marginLeft: card.x - 88 }}
                className={card.visibility}
                /* Recede with opacity and scale only — a blur filter here
                   forces a raster layer and softens the text. */
                animate={{
                  scale: isHovered ? card.scale * 1.07 : card.scale * (isDimmed ? 0.96 : 1),
                  opacity: isDimmed ? 0.45 : 1,
                }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  className="relative"
                  /* The idle drift pauses under the cursor — but it has to
                     settle quickly, not over the drift's own 6s period. */
                  animate={
                    reduce || isHovered
                      ? { y: 0 }
                      : { y: [0, i % 2 === 0 ? -9 : 9, 0] }
                  }
                  transition={
                    isHovered
                      ? { duration: 0.35, ease: "easeOut" }
                      : {
                          duration: 6 + i * 0.45,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }
                  }
                >
                  {/* Which lifecycle stage this artefact belongs to */}
                  <motion.span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.6)]"
                    style={{ backgroundColor: SECONDARY }}
                    initial={false}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      y: isHovered ? 0 : 10,
                      scale: isHovered ? 1 : 0.8,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 460,
                      damping: 26,
                    }}
                  >
                    {card.stage}
                  </motion.span>

                  <div className={`${card.dark ? darkShell : lightShell} flex`}>
                    {card.body}

                    {/* Light sweeping across the face on hover */}
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${
                          card.dark
                            ? "rgba(255,255,255,0.16)"
                            : "rgba(255,255,255,0.85)"
                        }, transparent)`,
                      }}
                      initial={false}
                      animate={{ x: isHovered ? "260%" : "-160%" }}
                      /* Snap back instantly, so leaving never sweeps twice. */
                      transition={{
                        duration: isHovered ? 0.85 : 0,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TRUST MARQUEE
   ════════════════════════════════════════════════════════════════════ */

const PARTNERS: { name: string; icon: LucideIcon }[] = [
  { name: "Northwind", icon: Boxes },
  { name: "Railcore", icon: GitBranch },
  { name: "Vertex", icon: Cpu },
  { name: "Mintwave", icon: Layers },
  { name: "Trigger", icon: Radar },
  { name: "Airplane", icon: Terminal },
];

function PartnerMarquee() {
  const reduce = useReducedMotion();
  const row = useMemo(() => [...PARTNERS, ...PARTNERS], []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.7 }}
      className="relative w-full overflow-hidden py-8"
    >
      <div className="absolute inset-y-0 left-0 z-10 w-28 bg-linear-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-28 bg-linear-to-l from-white to-transparent" />

      <motion.div
        className="flex w-max items-center gap-14"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {row.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={`${p.name}-${i}`}
              className="flex shrink-0 items-center gap-2 text-slate-400 transition-colors hover:text-[#1E293B]"
            >
              <Icon className="h-5 w-5" strokeWidth={1.6} />
              <span className="text-base font-semibold tracking-tight">
                {p.name}
              </span>
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════════════════ */

export function Hero() {
  return (
    // The negative margin cancels the layout's navbar padding so the
    // backdrop runs to the very top and the nav island floats over it;
    // the matching top padding keeps the eyebrow clear of the island.
    <section className="relative -mt-(--navbar-height) overflow-hidden bg-white pt-(--navbar-height)">
      <AuroraField />
      <SurveyGrid />
      <MoteField />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pb-4 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-1.5 text-sm font-medium text-slate-600 shadow-[0_0_0_1px_rgba(30,41,59,0.08)]"
        >
          <span className="relative flex size-1.5">
            <span
              className="absolute inline-flex size-full animate-ping rounded-full opacity-75"
              style={{ backgroundColor: ACCENT }}
            />
            <span
              className="relative inline-flex size-1.5 rounded-full"
              style={{ backgroundColor: ACCENT }}
            />
          </span>
          Security across the whole development lifecycle
        </motion.div>

        {/* headline */}
        <h1 className="mt-6 max-w-4xl text-center text-[2.6rem] leading-[1.05] tracking-[-0.045em] text-[#1E293B] sm:text-6xl lg:text-[4.25rem]">
          <span className="block font-bold">
            <RevealLine text="Find every bug." delay={0.15} />
          </span>
          <span className="block font-normal text-slate-500">
            <RevealLine text="Solve every problem." delay={0.4} />
            <motion.span
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 1.05,
                type: "spring",
                stiffness: 320,
                damping: 18,
              }}
              className="ml-[-0.06em] inline-block font-bold"
              style={{ color: PRIMARY }}
            >
              .
            </motion.span>
          </span>
        </h1>

        {/* subtext */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.72, ease: "easeOut" }}
          className="mt-5 max-w-xl text-center text-base leading-relaxed text-slate-500"
        >
          Reward-based bounty programs, real vulnerability triage, and a
          searchable library of validated solutions — wired into every stage
          of how your team already ships.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
            <Link
              href="/account-type"
              className="group inline-flex items-center gap-2.5 rounded-full py-2.5 pl-6 pr-2.5 text-base font-semibold text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.9)] transition-[filter] hover:brightness-110"
              style={{ backgroundColor: PRIMARY }}
            >
              Get started free
              <span
                className="flex size-8 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: ACCENT }}
              >
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
            <Link
              href="/programs"
              className="inline-flex items-center rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1E293B] shadow-[0_0_0_1px_rgba(30,41,59,0.12)] transition-colors hover:bg-slate-50"
            >
              Explore programs
            </Link>
          </motion.div>
        </motion.div>

        {/* social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
        >
          <span className="flex items-center gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 1.1 + i * 0.07,
                  type: "spring",
                  stiffness: 400,
                  damping: 16,
                }}
              >
                <Star className="size-4 fill-amber-400 text-amber-400" />
              </motion.span>
            ))}
          </span>
          <span className="text-sm font-medium text-slate-500">
            <span className="font-bold text-slate-900">4.9/5</span> from 4,900+
            researchers and 120+ security teams
          </span>
        </motion.div>

        <CardArc />
        <SdlcRail />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PartnerMarquee />
      </div>
    </section>
  );
}

export default Hero;
