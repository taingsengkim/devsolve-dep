"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import {
  Bug,
  Code2,
  FileCode2,
  GitBranch,
  Heart,
  MessageSquare,
  Radar,
  Rocket,
  RotateCw,
  ShieldAlert,
  ShieldCheck,
  Target,
  Terminal,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Brand palette (design.md) ──────────────────────────────────────
   Only the two brand hues live here now. The secondary and muted greys
   moved to Tailwind classes (`text-[#1E293B]`, `text-slate-300`) so each
   can state a dark counterpart; an inline style cannot. */
const PRIMARY = "#2563EB";
const ACCENT = "#10B981";

/* The scene is laid out on a fixed canvas and scaled as one unit, so the
   diagram never reflows into a different composition. */
/* Widened from 1000 to make room for the panels to stand off the hub by the
   same margin the icons do. Costs nothing: available height, not width, is
   what caps the scene at every common viewport. */
const CANVAS_W = 1120;
const CANVAS_H = 400;
const HUB = { x: 520, y: 236 };

/* High enough that available height is what decides the size, not this. */
const MAX_SCALE = 2;

/* The hero is pinned to exactly one viewport, so the scene has to fit
   whatever height is left rather than claim a fixed one. Measuring beats
   breakpoints here — it adapts to any window, not just three of them. */
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ════════════════════════════════════════════════════════════════════
   HEADLINE
   ════════════════════════════════════════════════════════════════════ */

function RevealWords({ text, delay = 0 }: { text: string; delay?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            /* No blur filter — it settles at blur(0px) and leaves every word
               on its own raster layer, softening the headline for good. */
            initial={{ opacity: 0, y: "0.9em" }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: delay + i * 0.07,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {i < text.split(" ").length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THE HUB — a blue isometric disc with radar rings
   ════════════════════════════════════════════════════════════════════ */

function HubDisc() {
  const reduce = useReducedMotion();

  return (
    <div className="relative size-full">
      {/* breathing glow underneath */}
      <motion.span
        className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: "rgba(37,99,235,0.28)" }}
        animate={
          reduce
            ? undefined
            : { opacity: [0.55, 0.95, 0.55], scale: [1, 1.1, 1] }
        }
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg
        viewBox="0 0 300 220"
        className="relative size-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hub-top" x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%" stopColor="#60A5FA" />
            <stop offset="55%" stopColor={PRIMARY} />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>
          <linearGradient id="hub-side" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#1E3A8A" />
          </linearGradient>
        </defs>

        {/* contact shadow */}
        <ellipse
          cx="150"
          cy="176"
          rx="118"
          ry="24"
          fill="rgba(30,58,138,0.16)"
        />

        {/* rings that keep pulsing outward across the floor */}
        {!reduce &&
          [0, 1, 2].map((i) => (
            <motion.ellipse
              key={i}
              cx="150"
              cy="120"
              rx="70"
              ry="26"
              fill="none"
              stroke={PRIMARY}
              strokeWidth="2"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: [0, 0.5, 0], scale: [0.6, 2.1, 2.1] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeOut",
              }}
              style={{ transformOrigin: "150px 120px" }}
            />
          ))}

        {/* body: side wall then top face */}
        <path
          d="M 32 108 L 32 128 A 118 44 0 0 0 268 128 L 268 108 Z"
          fill="url(#hub-side)"
        />
        <ellipse cx="150" cy="108" rx="118" ry="44" fill="url(#hub-top)" />

        {/* Concentric target rings — the mark stands in the bullseye rather
            than filling it, so all three are back. */}
        {[
          { rx: 102, ry: 38 },
          { rx: 76, ry: 28.3 },
          { rx: 50, ry: 18.6 },
        ].map((ring) => (
          <ellipse
            key={ring.rx}
            cx="150"
            cy="108"
            rx={ring.rx}
            ry={ring.ry}
            fill="none"
            stroke="#fff"
            strokeOpacity="0.9"
            strokeWidth="6"
          />
        ))}

        {/* sheen sweeping across the top face */}
        {!reduce && (
          <motion.ellipse
            cx="150"
            cy="108"
            rx="118"
            ry="44"
            fill="#fff"
            animate={{ opacity: [0, 0.22, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 2.5,
            }}
          />
        )}
      </svg>

      {/* The mark stands upright in the bullseye and hovers above it — an
          object in the scene, not a decal on the surface. The SVG viewBox is
          300x220 on a 300x220 box, so these share units with the ellipses. */}

      {/* Contact shadow, foreshortened to the disc and tied to the hover:
          it tightens as the badge lifts, which is what sells the height. */}
      <motion.span
        className="absolute rounded-[50%] blur-[6px]"
        style={{
          left: 150,
          top: 112,
          width: 84,
          height: 22,
          transform: "translate(-50%, -50%)",
          backgroundColor: "rgba(23,37,84,0.5)",
        }}
        initial={{ opacity: 0 }}
        animate={
          reduce
            ? { opacity: 0.5 }
            : { opacity: [0.55, 0.3, 0.55], scaleX: [1, 0.78, 1] }
        }
        transition={
          reduce
            ? { delay: 0.9 }
            : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }
        }
      />

      <div
        className="absolute"
        style={{
          left: 150,
          top: 54,
          width: 108,
          height: 108,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* rises out of the hub on entry */}
        <motion.div
          className="relative size-full"
          initial={{ opacity: 0, scale: 0.45, y: 54 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            delay: 0.65,
            type: "spring",
            stiffness: 190,
            damping: 17,
          }}
        >
          {/* then never quite settles */}
          <motion.div
            className="relative size-full"
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="absolute -inset-2 rounded-full bg-white/55 blur-lg" />

            <div className="relative size-full overflow-hidden rounded-full bg-white shadow-[0_20px_30px_-8px_rgba(23,37,84,0.55),0_0_0_5px_rgba(255,255,255,0.8)]">
              {/* Copy of app/icon.png in public/ — importing the metadata
                  convention file directly is asking for trouble. */}
              <Image
                src="/devsolve.png"
                alt="DevSolve"
                fill
                sizes="160px"
                priority
                className="object-contain p-1"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   SOURCES — what flows into the platform
   ════════════════════════════════════════════════════════════════════ */

type Source = {
  id: string;
  icon: LucideIcon;
  color: string;
  x: number;
  y: number;
  delay: number;
  drift: number;
};

/* Vertical spread pulled 20% toward the centre line. Height is what caps the
   scene's size, so a flatter composition renders larger at the same fit —
   worth ~18% on its own. Horizontal spread is untouched: width is abundant. */
const SOURCES: Source[] = [
  {
    id: "bug",
    icon: Bug,
    color: "#E11D48",
    x: 34,
    y: 122,
    delay: 0.9,
    drift: -8,
  },
  {
    id: "repo",
    icon: GitBranch,
    color: "#7C3AED",
    x: 140,
    y: 66,
    delay: 1.0,
    drift: 9,
  },
  {
    id: "cli",
    icon: Terminal,
    color: "#F59E0B",
    x: 10,
    y: 225,
    delay: 1.1,
    drift: 7,
  },
  {
    id: "thread",
    icon: MessageSquare,
    color: ACCENT,
    x: 104,
    y: 284,
    delay: 1.2,
    drift: -9,
  },
  {
    id: "cve",
    icon: ShieldAlert,
    color: PRIMARY,
    x: 240,
    y: 151,
    delay: 1.05,
    drift: -7,
  },
  {
    id: "poc",
    icon: FileCode2,
    color: "#0EA5E9",
    x: 252,
    y: 273,
    delay: 1.3,
    drift: 8,
  },
];

const TILE = 52;

function SourceTile({
  source,
  isLit,
  onEnter,
  onLeave,
}: {
  source: Source;
  isLit: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const reduce = useReducedMotion();
  const Icon = source.icon;

  return (
    <motion.div
      className="pointer-events-auto absolute"
      style={{ left: source.x, top: source.y, width: TILE, height: TILE }}
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: source.delay,
        type: "spring",
        stiffness: 320,
        damping: 20,
      }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
    >
      <motion.div
        animate={reduce || isLit ? { y: 0 } : { y: [0, source.drift, 0] }}
        transition={
          isLit
            ? { duration: 0.3, ease: "easeOut" }
            : {
                duration: 5.5 + Math.abs(source.drift) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        <motion.div
          className="flex size-13 items-center justify-center rounded-2xl border border-slate-200/90 bg-white dark:border-slate-700/80 dark:bg-slate-900"
          animate={{
            scale: isLit ? 1.14 : 1,
            boxShadow: isLit
              ? "0 18px 34px -12px rgba(37,99,235,0.55)"
              : "0 10px 24px -14px rgba(15,23,42,0.5)",
          }}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
        >
          <Icon className="size-6" style={{ color: source.color }} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   OUTPUTS — isometric panels the platform produces
   ════════════════════════════════════════════════════════════════════ */

type Panel = {
  id: string;
  label: string;
  action: string;
  x: number;
  y: number;
  delay: number;
  drift: number;
  rows: number[];
};

const PANEL_W = 200;

/* The disc's top face spans x 402–638. The nearest icon sits 98px clear of
   its left edge, so the nearest panel stands 100px clear of its right edge —
   both sides breathe the same amount. */
const PANELS: Panel[] = [
  {
    id: "triage",
    label: "Report #4821",
    action: "Triage & score",
    x: 738,
    y: 241,
    delay: 1.15,
    drift: -9,
    rows: [92, 64, 78],
  },
  {
    id: "bounty",
    label: "Bounty released",
    action: "Pay $4,500",
    x: 806,
    y: 164,
    delay: 1.3,
    drift: 10,
    rows: [78, 96, 54],
  },
  {
    id: "solution",
    label: "Solution published",
    action: "Share write-up",
    x: 874,
    y: 87,
    delay: 1.45,
    drift: -8,
    rows: [64, 84, 92],
  },
];

/* ─── What is actually drawn ───────────────────────────────────────────
   Derived from the layout rather than hardcoded, so the fit and the
   centring can never drift out of sync with the artwork again — moving a
   tile updates both. The canvas box is bigger than its contents, and
   centring the box instead of the drawing is what left the scene sitting
   off to one side. */
const PANEL_H = 78; // label + three rows + padding
const PANEL_SKEW = 17; // skewY(-9deg) across 200px overhangs by ~16
const PILL_OVERHANG = 26; // the action pill sits -left-6 -top-3

const ART = (() => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  const add = (x: number, y: number, w: number, h: number) => {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x + w);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y + h);
  };

  SOURCES.forEach((s) => add(s.x, s.y, TILE, TILE));
  PANELS.forEach((p) =>
    add(
      p.x - PILL_OVERHANG,
      p.y - PANEL_SKEW - 12,
      PANEL_W + PILL_OVERHANG,
      PANEL_H + PANEL_SKEW * 2 + 12,
    ),
  );
  /* Disc plus the badge standing on it; the pulsing floor rings are
     decorative and allowed to run past the edge. */
  add(HUB.x - 118, HUB.y - 110, 236, 200);

  return {
    w: maxX - minX,
    h: maxY - minY,
    dx: CANVAS_W / 2 - (minX + maxX) / 2,
    dy: CANVAS_H / 2 - (minY + maxY) / 2,
  };
})();

function OutputPanel({
  panel,
  isLit,
  onEnter,
  onLeave,
}: {
  panel: Panel;
  isLit: boolean;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className="pointer-events-auto absolute"
      style={{ left: panel.x, top: panel.y, width: PANEL_W }}
      initial={{ opacity: 0, x: 40, y: panel.y < HUB.y ? -20 : 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.8,
        delay: panel.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      onHoverStart={onEnter}
      onHoverEnd={onLeave}
    >
      <motion.div
        animate={reduce || isLit ? { y: 0 } : { y: [0, panel.drift, 0] }}
        transition={
          isLit
            ? { duration: 0.3, ease: "easeOut" }
            : {
                duration: 6 + Math.abs(panel.drift) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
      >
        {/* 2D skew only — a real 3D rotation would rasterise the subtree */}
        <motion.div
          className="relative rounded-xl border border-slate-200/90 bg-white p-3.5 dark:border-slate-700/80 dark:bg-slate-900"
          style={{ transform: "skewY(-9deg)" }}
          animate={{
            boxShadow: isLit
              ? "0 26px 50px -18px rgba(37,99,235,0.5)"
              : "0 16px 36px -20px rgba(15,23,42,0.55)",
          }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            {panel.label}
          </p>

          <div className="mt-2.5 space-y-1.5">
            {panel.rows.map((w, i) => (
              <motion.span
                key={i}
                className="block h-1.5 rounded-full bg-slate-100 dark:bg-slate-700/70"
                initial={{ width: 0 }}
                animate={{ width: `${w}%` }}
                transition={{
                  duration: 0.6,
                  delay: panel.delay + 0.35 + i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* the blue action pill, lifted off the panel like the reference */}
          <motion.span
            className="absolute -left-6 -top-3 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
            style={{
              backgroundColor: PRIMARY,
              boxShadow: "0 10px 22px -8px rgba(37,99,235,0.9)",
            }}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: isLit ? 1.06 : 1 }}
            transition={{
              delay: panel.delay + 0.3,
              type: "spring",
              stiffness: 400,
              damping: 22,
            }}
          >
            {panel.action}
          </motion.span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CONNECTORS — dashed lines in, solid beams out, both carrying pulses
   ════════════════════════════════════════════════════════════════════ */

type Point = { x: number; y: number };

/**
 * Routes a trace the way a PCB does: a straight run, a 45° chamfer that
 * absorbs the whole offset, then a straight run into the pad. Whichever
 * axis has more room carries the runs.
 */
function buildTrace(from: Point, to: Point, tail = 20) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const run = Math.abs(dx);
  const rise = Math.abs(dy);
  const sx = Math.sign(dx) || 1;
  const sy = Math.sign(dy) || 1;

  if (run >= rise) {
    const lead = run - rise > tail * 2 ? tail : 0;
    const b2 = { x: to.x - sx * lead, y: to.y };
    const b1 = { x: b2.x - sx * rise, y: from.y };
    return {
      d: `M ${from.x} ${from.y} H ${b1.x} L ${b2.x} ${b2.y} H ${to.x}`,
      bends: [b1, b2],
    };
  }

  const lead = rise - run > tail * 2 ? tail : 0;
  const b2 = { x: to.x, y: to.y - sy * lead };
  const b1 = { x: from.x, y: b2.y - sy * run };
  return {
    d: `M ${from.x} ${from.y} V ${b1.y} L ${b2.x} ${b2.y} V ${to.y}`,
    bends: [b1, b2],
  };
}

/* Hex chatter that rides the wire — decorative, but it is what makes the
   trace read as a bus carrying something rather than a drawn line. */
const IN_CODE = [
  "0x4F 1011",
  "SEV:9.8",
  "1101 0x2A",
  "POST /report",
  "CVE-24-9",
  "0xE1 0011",
];
const OUT_CODE = ["ACK 0x1F", "PAY 4500", "PUB 0x7C"];

/* Entry and exit pads, evenly spaced so they read as a bus. */
const IN_BUS_X = HUB.x - 104;
const OUT_BUS_X = HUB.x + 100;

type Trace = {
  id: string;
  d: string;
  bends: Point[];
  to: Point;
  tone: string;
  code: string;
  delay: number;
  dur: number;
};

const TRACES: Trace[] = [
  ...SOURCES.map((s, i) => {
    const from = { x: s.x + TILE / 2, y: s.y + TILE / 2 };
    const to = { x: IN_BUS_X, y: HUB.y - 28 + i * 11 };

    return {
      id: s.id,
      ...buildTrace(from, to),
      to,
      tone: PRIMARY,
      code: IN_CODE[i % IN_CODE.length],
      delay: i * 0.62,
      dur: 6.5 + i * 0.7,
    };
  }),
  ...PANELS.map((p, i) => {
    const from = { x: OUT_BUS_X, y: HUB.y - 24 + i * 12 };
    const to = { x: p.x - 6, y: p.y + 34 };

    return {
      id: p.id,
      ...buildTrace(from, to),
      to,
      tone: ACCENT,
      code: OUT_CODE[i % OUT_CODE.length],
      delay: 0.5 + i * 0.8,
      dur: 5.5 + i * 0.6,
    };
  }),
];

function ConnectorField({ lit }: { lit: string | null }) {
  const reduce = useReducedMotion();

  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Bloom on the packets only — never on anything carrying real text */}
        <filter id="trace-bloom" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* The glyph stream needs a referencable copy of each route */}
        {TRACES.map((trace) => (
          <path key={trace.id} id={`trace-${trace.id}`} d={trace.d} />
        ))}
      </defs>

      {/* Bus bars where the traces land on the hub */}
      {[
        { x: IN_BUS_X, y: HUB.y - 34, h: 66, tone: PRIMARY },
        { x: OUT_BUS_X, y: HUB.y - 30, h: 48, tone: ACCENT },
      ].map((bus) => (
        <motion.rect
          key={bus.x}
          x={bus.x - 1.5}
          y={bus.y}
          width={3}
          height={bus.h}
          rx={1.5}
          fill={bus.tone}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 0.35, scaleY: 1 }}
          transition={{ duration: 0.6, delay: 1.5, ease: "easeOut" }}
          style={{ transformOrigin: `${bus.x}px ${bus.y + bus.h / 2}px` }}
        />
      ))}

      {TRACES.map((trace, i) => {
        const isLit = lit === trace.id;

        return (
          <g key={trace.id}>
            {/* the etched wire */}
            <motion.path
              d={trace.d}
              stroke={isLit ? trace.tone : "#94A3B8"}
              strokeOpacity={isLit ? 0.85 : 0.28}
              strokeWidth={isLit ? 1.8 : 1.25}
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.9,
                delay: 0.85 + i * 0.07,
                ease: "easeOut",
              }}
            />

            {/* current flowing down it, never stopping */}
            {!reduce && (
              <motion.path
                d={trace.d}
                stroke={trace.tone}
                strokeWidth={isLit ? 1.8 : 1.25}
                strokeDasharray="4 10"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: isLit ? 0.95 : 0.45,
                  strokeDashoffset: [0, -28],
                }}
                transition={{
                  opacity: { duration: 0.4 },
                  strokeDashoffset: {
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />
            )}

            {/* solder pads at every corner */}
            {trace.bends.map((bend, bi) => (
              <motion.rect
                key={bi}
                x={bend.x - 2.6}
                y={bend.y - 2.6}
                width={5.2}
                height={5.2}
                fill={isLit ? trace.tone : "#CBD5E1"}
                transform={`rotate(45 ${bend.x} ${bend.y})`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: isLit ? 1.35 : 1 }}
                transition={{
                  delay: 1.35 + i * 0.05 + bi * 0.06,
                  type: "spring",
                  stiffness: 420,
                  damping: 20,
                }}
                style={{ transformOrigin: `${bend.x}px ${bend.y}px` }}
              />
            ))}

            {/* terminal pad on the bus */}
            <motion.circle
              cx={trace.to.x}
              cy={trace.to.y}
              r={2.8}
              fill={trace.tone}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: isLit ? 1 : 0.6, scale: 1 }}
              transition={{ delay: 1.5 + i * 0.04, duration: 0.4 }}
            />

            {/* hex chatter riding the wire — SMIL, because startOffset is an
                SVG attribute rather than a style */}
            {!reduce && (
              <text
                fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                fontSize="8.5"
                fontWeight="700"
                letterSpacing="0.6"
                fill={trace.tone}
                opacity={isLit ? 0.95 : 0.5}
              >
                <textPath href={`#trace-${trace.id}`} startOffset="-18%">
                  {trace.code}
                  <animate
                    attributeName="startOffset"
                    from="-18%"
                    to="104%"
                    dur={`${trace.dur}s`}
                    begin={`${1.9 + trace.delay}s`}
                    repeatCount="indefinite"
                  />
                </textPath>
              </text>
            )}

            {/* the packet itself, blooming as it runs */}
            {!reduce && (
              <motion.path
                d={trace.d}
                stroke={trace.tone}
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#trace-bloom)"
                pathLength={1}
                strokeDasharray="0.05 1"
                initial={{ strokeDashoffset: 1, opacity: 0 }}
                animate={{ strokeDashoffset: 0, opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  delay: 2 + trace.delay,
                  ease: "easeInOut",
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THE SCENE
   ════════════════════════════════════════════════════════════════════ */

function ParallaxLayer({
  px,
  py,
  depth,
  children,
}: {
  px: MotionValue<number>;
  py: MotionValue<number>;
  depth: number;
  children: React.ReactNode;
}) {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth * 0.6);

  return (
    <motion.div className="absolute inset-0" style={{ x, y }}>
      {children}
    </motion.div>
  );
}

function IntegrationScene() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState<string | null>(null);
  const [scale, setScale] = useState(0.6);

  /* Fit the fixed canvas into whatever the flex row leaves over, capped at
     1:1 so it never blows up on a tall window. */
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;

      setScale(Math.min(width / ART.w, height / ART.h, MAX_SCALE));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const spring = { stiffness: 80, damping: 20, mass: 0.5 };
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
    <div ref={ref} className="relative min-h-0 w-full flex-1">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translate(-50%, -50%) scale(${scale}) translate(${ART.dx}px, ${ART.dy}px)`,
        }}
      >
        <ConnectorField lit={lit} />

        <ParallaxLayer px={px} py={py} depth={16}>
          {SOURCES.map((source) => (
            <SourceTile
              key={source.id}
              source={source}
              isLit={lit === source.id}
              onEnter={() => setLit(source.id)}
              onLeave={() => setLit(null)}
            />
          ))}
        </ParallaxLayer>

        <ParallaxLayer px={px} py={py} depth={6}>
          <div
            className="absolute"
            style={{
              left: HUB.x - 150,
              top: HUB.y - 110,
              width: 300,
              height: 220,
            }}
          >
            <HubDisc />
          </div>
        </ParallaxLayer>

        <ParallaxLayer px={px} py={py} depth={26}>
          {PANELS.map((panel) => (
            <OutputPanel
              key={panel.id}
              panel={panel}
              isLit={lit === panel.id}
              onEnter={() => setLit(panel.id)}
              onLeave={() => setLit(null)}
            />
          ))}
        </ParallaxLayer>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THE LIFECYCLE STRIP — where the reference puts its logo row
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

function LifecycleStrip() {
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
      transition={{ duration: 0.7, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full shrink-0 border-t border-slate-200/80 pt-2 dark:border-slate-800/80"
    >
      {/* Narrow screens scroll the rail rather than shrink the labels past
          readability. `overflow-x-auto` also computes overflow-y to auto, so
          the top padding is what keeps the active node's halo from being
          sliced off. */}
      <div className="pointer-events-auto relative overflow-x-auto pb-1 pt-6 scrollbar-none [&::-webkit-scrollbar]:hidden">
        <div className="relative mx-auto min-w-155 max-w-4xl px-6">
          {/* Track spans first node centre to last — 1.5rem of padding plus
              half of a 5rem stage column. */}
          <div className="absolute inset-x-16 top-5 h-0.5 rounded-full bg-slate-200/90 dark:bg-slate-700/70" />

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

                    {/* The two resting states are classes rather than inline
                        styles so they can be restated for dark; only the
                        active node keeps its inline brand fill, which reads
                        the same on either surface. */}
                    <motion.span
                      className={`relative flex size-10 items-center justify-center rounded-full ring-1 transition-colors duration-300 ${
                        isActive
                          ? ""
                          : isDone
                            ? "bg-emerald-50 text-emerald-500 dark:bg-emerald-500/15 dark:text-emerald-400"
                            : "bg-white text-slate-300 dark:bg-slate-800 dark:text-slate-600"
                      }`}
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
                          : undefined
                      }
                    >
                      <Icon className="size-4.5" />
                    </motion.span>
                  </span>

                  <span
                    className={`text-sm font-semibold transition-colors duration-300 ${
                      isActive
                        ? "text-slate-900 dark:text-slate-100"
                        : isDone
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-400 dark:text-slate-600"
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

      {/* The loop hint and the running caption share one line — two rows of
          label here is the difference between a big scene and a cramped one. */}
      <div className="flex h-6 items-center justify-center gap-2">
        <motion.span
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
          className="inline-flex shrink-0 text-slate-400 dark:text-slate-600"
        >
          <RotateCw className="size-3.5" />
        </motion.span>

        <AnimatePresence mode="wait">
          <motion.p
            key={active}
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -7 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="truncate text-center text-sm text-slate-500 dark:text-slate-400"
          >
            {STAGES[active].caption}
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THE BACKDROP
   A live surface rather than a flat fill: drifting light, a survey grid
   whose tiles lift under the cursor, cells that pulse on their own, and
   two scan beams.
   ════════════════════════════════════════════════════════════════════ */

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

const CELL = 68;

const BLOBS = [
  {
    color: PRIMARY,
    className: "left-[-12%] top-[-10%] h-[34rem] w-[34rem]",
    path: { x: [0, 80, -40, 0], y: [0, -50, 40, 0], scale: [1, 1.12, 0.94, 1] },
    duration: 28,
    opacity: 0.1,
  },
  {
    color: "#8B5CF6",
    className: "right-[-10%] top-[4%] h-[30rem] w-[30rem]",
    path: { x: [0, -64, 32, 0], y: [0, 60, -26, 0], scale: [1, 0.92, 1.14, 1] },
    duration: 34,
    opacity: 0.09,
  },
  {
    color: ACCENT,
    className: "bottom-[-18%] left-[36%] h-[26rem] w-[40rem]",
    path: { x: [0, 56, -56, 0], y: [0, -34, 18, 0], scale: [1, 1.08, 0.96, 1] },
    duration: 40,
    opacity: 0.09,
  },
];

const PULSES = (() => {
  const rand = mulberry32(11);
  return Array.from({ length: 10 }, () => ({
    cx: rand(),
    cy: rand(),
    color: rand() > 0.5 ? PRIMARY : ACCENT,
    delay: rand() * 9,
    duration: 3.5 + rand() * 3,
  }));
})();

/* The tile lift is pure CSS hover — no per-frame JS for a few hundred cells.
   Kept deliberately shallow: it should read as the surface breathing under
   the cursor, not as tiles jumping. Eased out both ways, and slower on the
   way back so the trail settles rather than snaps. */
const GRID_TILE =
  "relative border-b border-r border-slate-900/[0.045] transition-all duration-[650ms] ease-[cubic-bezier(0.33,1,0.68,1)] hover:z-10 hover:scale-[1.035] hover:rounded-lg hover:border-transparent hover:bg-white hover:shadow-[0_5px_16px_-9px_rgba(37,99,235,0.3),0_0_0_1px_rgba(37,99,235,0.07)] hover:duration-[340ms] dark:border-white/[0.045] dark:hover:bg-slate-800/70 dark:hover:shadow-[0_5px_16px_-9px_rgba(37,99,235,0.55),0_0_0_1px_rgba(96,165,250,0.14)]";

function HeroBackdrop() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (!width || !height) return;

      setGrid({
        cols: Math.ceil(width / CELL),
        rows: Math.ceil(height / CELL),
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { cols, rows } = grid;

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {/* soft light pooled behind the headline, the way the reference lifts
          its centre out of a flat grey field */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "var(--hero-glow)" }}
      />

      {BLOBS.map((blob, i) => (
        <motion.div
          key={i}
          className={`pointer-events-none absolute rounded-full blur-[120px] ${blob.className}`}
          style={{ backgroundColor: blob.color, opacity: blob.opacity }}
          animate={reduce ? undefined : blob.path}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* The interactive surface. Sized to the box rather than auto-fill so
          the tiles always land flush with the edges. */}
      {cols > 0 && (
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {Array.from({ length: cols * rows }, (_, i) => (
            <span key={i} className={GRID_TILE} />
          ))}
        </div>
      )}

      {/* cells that light on their own, snapped to the same grid */}
      {cols > 0 &&
        !reduce &&
        PULSES.map((pulse, i) => (
          <motion.span
            key={i}
            className="pointer-events-none absolute"
            style={{
              left: `${(Math.floor(pulse.cx * cols) / cols) * 100}%`,
              top: `${(Math.floor(pulse.cy * rows) / rows) * 100}%`,
              width: `${100 / cols}%`,
              height: `${100 / rows}%`,
              backgroundColor: pulse.color,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.09, 0] }}
            transition={{
              duration: pulse.duration,
              repeat: Infinity,
              delay: pulse.delay,
              ease: "easeInOut",
              repeatDelay: 4,
            }}
          />
        ))}

      {!reduce && (
        <>
          <motion.div
            className="pointer-events-none absolute inset-y-0 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${PRIMARY}, transparent)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ left: ["8%", "92%"], opacity: [0, 0.32, 0] }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 6,
            }}
          />
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ top: ["18%", "86%"], opacity: [0, 0.28, 0] }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 8,
            }}
          />
        </>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HERO
   ════════════════════════════════════════════════════════════════════ */

export function Hero() {
  return (
    // The negative margin cancels the layout's navbar padding so the
    // backdrop runs to the very top and the nav island floats over it.
    <section className="relative -mt-(--navbar-height) h-dvh overflow-hidden bg-[#F7F8FB] dark:bg-slate-950">
      <HeroBackdrop />

      {/* Deliberately not max-w-7xl: capping the column at 1280 capped the
          scene's width too. Each text block carries its own measure instead,
          which lets the diagram use the full window.

          pointer-events-none is what lets the backdrop tiles stay hoverable
          underneath — a transparent div still captures the cursor over its
          whole box, so the interactive bits opt back in individually. */}
      <div className="pointer-events-none relative z-10 flex h-full w-full flex-col items-center px-6 pb-2 pt-(--navbar-height) sm:px-10">
        {/* In a 100vh hero every unit of rhythm here is a unit the scene does
            not get, so the type block is deliberately tight. */}
        <h1
          /* Colour is a class, not an inline style, so the dark variant can
             reach it. #1E293B is the brand secondary. */
          className="mt-[1.5vh] max-w-3xl shrink-0 text-center font-semibold leading-[1.05] tracking-[-0.035em] text-[#1E293B] sm:mt-[2.2vh] dark:text-slate-50"
          /* vh in the clamp as well as vw: on a short window the headline has
             to give height back to the scene, not just on a narrow one. */
          style={{
            fontSize: "clamp(26px, min(3.6vw, 5.8vh), 52px)",
          }}
        >
          <span className="block">
            <RevealWords text="Turn Found Bugs" delay={0.12} />
          </span>
          <span className="block">
            <RevealWords text="into Shipped Fixes" delay={0.34} />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.68, ease: "easeOut" }}
          className="mt-3 max-w-xl shrink-0 text-center text-sm leading-[1.6] text-slate-500 sm:text-[15px] dark:text-slate-400"
        >
          Bounty programs, real vulnerability triage, and a community that
          solves problems in the open — wired into every stage of how your team
          already ships.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
          className="pointer-events-auto mt-4 flex shrink-0 flex-wrap items-center justify-center gap-3"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
            <Link
              href="/account-type"
              className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-[filter] hover:brightness-110"
              style={{
                backgroundColor: PRIMARY,
                boxShadow: "0 14px 30px -12px rgba(37,99,235,0.85)",
              }}
            >
              Get started free
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
            <Link
              href="/programs"
              className="inline-flex items-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.4)] transition-colors hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-100 dark:shadow-[0_6px_18px_-10px_rgba(2,6,23,0.8)] dark:hover:bg-slate-800"
            >
              Browse programs
            </Link>
          </motion.div>
        </motion.div>

        <IntegrationScene />

        <LifecycleStrip />
      </div>
    </section>
  );
}

export default Hero;
