"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  Bug,
  Command,
  Search,
  ShieldCheck,
  Terminal,
  Boxes,
  GitBranch,
  Cpu,
  Layers,
  Radar,
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

/* ────────────────────────────────────────────────────────────────────
   Aurora field — slow drifting light in brand colors
   ──────────────────────────────────────────────────────────────────── */
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
    className: "left-[-12%] top-[8%] h-[34rem] w-[34rem]",
    path: { x: [0, 90, -40, 0], y: [0, -60, 50, 0], scale: [1, 1.12, 0.94, 1] },
    duration: 26,
    opacity: 0.16,
  },
  {
    color: ACCENT,
    className: "right-[-10%] top-[22%] h-[30rem] w-[30rem]",
    path: { x: [0, -70, 40, 0], y: [0, 70, -30, 0], scale: [1, 0.92, 1.14, 1] },
    duration: 32,
    opacity: 0.14,
  },
  {
    color: SECONDARY,
    className: "bottom-[-8%] left-1/3 h-[26rem] w-[40rem]",
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
          className={`absolute rounded-full blur-[110px] ${blob.className}`}
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

/* ────────────────────────────────────────────────────────────────────
   Silk backdrop — layered bezier strands that drift like fabric.
   Three tinted layers cross-fade to give the ribbon its iridescence.
   ──────────────────────────────────────────────────────────────────── */
function useSilkStrands(count: number, seed: number, squeeze = 1) {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const t = i / (count - 1);
        const y = 90 + t * 360 + seed;
        const amp = (140 - t * 96) * squeeze;
        return [
          `M -160 ${y + 210}`,
          `C 240 ${y - amp}, 540 ${y + amp * 1.55}, 820 ${y - amp * 0.35}`,
          `S 1320 ${y + amp * 0.9}, 1640 ${y - 150}`,
        ].join(" ");
      }),
    [count, seed, squeeze],
  );
}

function SilkBackdrop() {
  const reduce = useReducedMotion();
  const base = useSilkStrands(26, 130, 0.72);
  const blue = useSilkStrands(40, 0, 1);
  const emerald = useSilkStrands(30, 60, 0.86);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 720"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="silk-fade" cx="62%" cy="52%" r="62%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="68%" stopColor="#fff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="silk-mask">
            <rect width="1440" height="720" fill="url(#silk-fade)" />
          </mask>

          <linearGradient id="silk-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={PRIMARY} stopOpacity="0" />
            <stop offset="45%" stopColor={PRIMARY} stopOpacity="0.85" />
            <stop offset="100%" stopColor={SECONDARY} stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="silk-accent" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={SECONDARY} stopOpacity="0.1" />
            <stop offset="55%" stopColor={ACCENT} stopOpacity="0.8" />
            <stop offset="100%" stopColor={ACCENT} stopOpacity="0" />
          </linearGradient>
        </defs>

        <g mask="url(#silk-mask)">
          {/* structural layer — dark slate, sets the fold */}
          <motion.g
            style={{ filter: "blur(1.4px)", transformOrigin: "60% 50%" }}
            animate={
              reduce
                ? undefined
                : { rotate: [0, 1.4, 0], y: [0, 22, 0], scaleY: [1, 1.06, 1] }
            }
            transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
          >
            {base.map((d, i) => (
              <path
                key={`s-${i}`}
                d={d}
                fill="none"
                stroke={SECONDARY}
                strokeOpacity={0.07}
                strokeWidth={1}
              />
            ))}
          </motion.g>

          {/* primary-blue sheen */}
          <motion.g
            style={{ transformOrigin: "55% 50%" }}
            animate={
              reduce
                ? undefined
                : {
                    rotate: [0, -1.8, 0],
                    y: [0, -26, 0],
                    scaleY: [1, 0.94, 1],
                    opacity: [0.5, 1, 0.5],
                  }
            }
            transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
          >
            {blue.map((d, i) => (
              <path
                key={`p-${i}`}
                d={d}
                fill="none"
                stroke="url(#silk-primary)"
                strokeWidth={1}
                strokeOpacity={0.22}
              />
            ))}
          </motion.g>

          {/* emerald sheen — phase-shifted so the colour travels along the silk */}
          <motion.g
            style={{ transformOrigin: "48% 52%" }}
            animate={
              reduce
                ? undefined
                : {
                    rotate: [0, 2.2, 0],
                    y: [0, 34, 0],
                    scaleY: [1, 1.08, 1],
                    opacity: [0.9, 0.35, 0.9],
                  }
            }
            transition={{ duration: 21, repeat: Infinity, ease: "easeInOut" }}
          >
            {emerald.map((d, i) => (
              <path
                key={`a-${i}`}
                d={d}
                fill="none"
                stroke="url(#silk-accent)"
                strokeWidth={1}
                strokeOpacity={0.2}
              />
            ))}
          </motion.g>
        </g>
      </svg>

      {/* highlight sheen that sweeps across the fabric */}
      <motion.div
        className="absolute inset-y-0 -left-1/3 w-1/2 bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.85),transparent)]"
        animate={reduce ? undefined : { x: ["0%", "260%"] }}
        transition={{
          duration: 11,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 3,
        }}
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Blueprint grid — static rules, pulsing cells, and a scanning beam
   ──────────────────────────────────────────────────────────────────── */
const CELL = 56;

const GRID_CELLS = (() => {
  const rand = mulberry32(7);
  return Array.from({ length: 12 }, () => ({
    col: Math.floor(rand() * 24),
    row: Math.floor(rand() * 12),
    color: rand() > 0.5 ? PRIMARY : ACCENT,
    delay: rand() * 8,
    duration: 3.5 + rand() * 3,
  }));
})();

function BlueprintGrid() {
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
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />

        {/* cells that light up and fade, snapped to the grid */}
        {GRID_CELLS.map((cell, i) => (
          <motion.rect
            key={i}
            x={cell.col * CELL + 1}
            y={cell.row * CELL + 1}
            width={CELL - 2}
            height={CELL - 2}
            fill={cell.color}
            initial={{ opacity: 0 }}
            animate={reduce ? undefined : { opacity: [0, 0.07, 0] }}
            transition={{
              duration: cell.duration,
              repeat: Infinity,
              delay: cell.delay,
              ease: "easeInOut",
              repeatDelay: 4,
            }}
          />
        ))}
      </svg>

      {/* vertical beam sweeping the blueprint */}
      <motion.div
        className="absolute inset-y-0 w-px"
        style={{
          background: `linear-gradient(to bottom, transparent, ${PRIMARY}, transparent)`,
          opacity: 0.35,
        }}
        animate={
          reduce ? undefined : { left: ["8%", "92%"], opacity: [0, 0.35, 0] }
        }
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 5,
        }}
      />
      {/* horizontal beam, slower and emerald */}
      <motion.div
        className="absolute inset-x-0 h-px"
        style={{
          background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
          opacity: 0.3,
        }}
        animate={
          reduce ? undefined : { top: ["18%", "86%"], opacity: [0, 0.3, 0] }
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
      <div className="absolute inset-y-0 left-0 w-40 bg-linear-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 w-40 bg-linear-to-l from-white to-transparent" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Ambient particles rising through the fold
   ──────────────────────────────────────────────────────────────────── */
const PARTICLES = (() => {
  const rand = mulberry32(23);
  return Array.from({ length: 16 }, () => ({
    left: 4 + rand() * 92,
    size: 2 + rand() * 3,
    delay: rand() * 14,
    duration: 14 + rand() * 12,
    drift: (rand() - 0.5) * 60,
    color: rand() > 0.55 ? ACCENT : PRIMARY,
  }));
})();

function ParticleField() {
  const reduce = useReducedMotion();
  if (reduce) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
          }}
          animate={{
            y: ["0%", "-1400%"],
            x: [0, p.drift, 0],
            opacity: [0, 0.55, 0.55, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

function FoldedCorner() {
  return (
    <div className="pointer-events-none absolute left-0 top-0 hidden h-28 w-28 sm:block">
      <div
        className="absolute inset-0 bg-slate-50"
        style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }}
      />
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 112 112"
        aria-hidden="true"
      >
        <motion.line
          x1="112"
          y1="0"
          x2="0"
          y2="112"
          stroke={SECONDARY}
          strokeOpacity="0.16"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Headline with per-character reveal
   ──────────────────────────────────────────────────────────────────── */
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
                initial={{ opacity: 0, y: "0.4em", filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{
                  duration: 0.7,
                  delay: delay + i * 0.028,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Floating labels scattered around the fold
   ──────────────────────────────────────────────────────────────────── */
type Chip = {
  label: string;
  icon: LucideIcon;
  tint: string;
  className: string;
  delay: number;
  drift: number;
};

const CHIPS: Chip[] = [
  {
    label: "Critical CVE",
    icon: ShieldCheck,
    tint: PRIMARY,
    className: "left-[3%] top-[26%]",
    delay: 0.9,
    drift: 10,
  },
  {
    label: "Repro steps",
    icon: Terminal,
    tint: SECONDARY,
    className: "left-[7%] bottom-[30%]",
    delay: 1.15,
    drift: -12,
  },
  {
    label: "Bounty payout",
    icon: Bug,
    tint: ACCENT,
    className: "left-[16%] bottom-[15%]",
    delay: 1.35,
    drift: 8,
  },
  {
    label: "Root cause",
    icon: Radar,
    tint: PRIMARY,
    className: "right-[5%] top-[22%]",
    delay: 1.0,
    drift: -9,
  },
  {
    label: "Patch diff",
    icon: GitBranch,
    tint: ACCENT,
    className: "right-[9%] top-[46%]",
    delay: 1.25,
    drift: 11,
  },
  {
    label: "Write-ups",
    icon: Layers,
    tint: SECONDARY,
    className: "right-[14%] bottom-[22%]",
    delay: 1.45,
    drift: -10,
  },
];

function FloatingChip({ chip }: { chip: Chip }) {
  const reduce = useReducedMotion();
  const Icon = chip.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 14 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: chip.delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`pointer-events-none absolute hidden xl:block ${chip.className}`}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, chip.drift, 0] }}
        transition={{
          duration: 6 + Math.abs(chip.drift) * 0.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-2 text-sm font-medium text-slate-600 backdrop-blur-sm shadow-[0_0_0_1px_rgba(30,41,59,0.08),0_2px_8px_rgba(30,41,59,0.06)]"
      >
        <Icon className="h-3.5 w-3.5" style={{ color: chip.tint }} />
        {chip.label}
      </motion.div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Command bar with a rotating typed query
   ──────────────────────────────────────────────────────────────────── */
const QUERIES = [
  "SQL injection in /api/auth …",
  "How do I fix a CORS preflight 403?",
  "Race condition on payment retry …",
  "XSS bypass in the markdown sanitizer …",
];

function TypedQuery() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [len, setLen] = useState(0);
  const [erasing, setErasing] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const full = QUERIES[index];

    if (!erasing && len < full.length) {
      const id = setTimeout(() => setLen((l) => l + 1), 42);
      return () => clearTimeout(id);
    }
    if (!erasing && len === full.length) {
      const id = setTimeout(() => setErasing(true), 1900);
      return () => clearTimeout(id);
    }
    if (erasing && len > 0) {
      const id = setTimeout(() => setLen((l) => l - 1), 18);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setErasing(false);
      setIndex((i) => (i + 1) % QUERIES.length);
    }, 250);
    return () => clearTimeout(id);
  }, [len, erasing, index, reduce]);

  return (
    <span className="truncate text-slate-400">
      {reduce ? QUERIES[0] : QUERIES[index].slice(0, len)}
      {!reduce && (
        <motion.span
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="ml-px inline-block h-[1.1em] w-px translate-y-[0.18em]"
          style={{ backgroundColor: PRIMARY }}
        />
      )}
    </span>
  );
}

function CommandBar() {
  const ref = useRef<HTMLDivElement>(null);
  const glowX = useSpring(useMotionValue(0), { stiffness: 180, damping: 26 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    glowX.set(e.clientX - rect.left);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.85, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-2xl"
    >
      <div
        ref={ref}
        onMouseMove={handleMove}
        className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-white/95 py-2.5 pl-5 pr-2.5 backdrop-blur-md shadow-[0_0_0_1px_rgba(30,41,59,0.09),0_8px_24px_-12px_rgba(30,41,59,0.28)] transition-shadow hover:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_14px_36px_-14px_rgba(37,99,235,0.35)]"
      >
        {/* cursor-tracked sheen */}
        <motion.div
          style={{
            x: glowX,
            background: `radial-gradient(circle, ${PRIMARY}1f, transparent 70%)`,
          }}
          className="pointer-events-none absolute inset-y-0 -left-24 w-48 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />

        <Search className="relative h-4 w-4 shrink-0 text-slate-400" />

        {/* <div className="relative flex-1 overflow-hidden text-base">
          <TypedQuery />
        </div> */}

        <kbd className="relative hidden items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-500 sm:inline-flex">
          <Command className="h-3 w-3" />K
        </kbd>

        <motion.button
          type="button"
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          aria-label="Search DevSolve"
          className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
          style={{ backgroundColor: PRIMARY }}
        >
          <ArrowUpRight className="h-4 w-4" />
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────────────────
   Trust marquee
   ──────────────────────────────────────────────────────────────────── */
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
  const row = [...PARTNERS, ...PARTNERS];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.1 }}
      className="relative w-full overflow-hidden py-6"
    >
      <div className="absolute inset-y-0 left-0 z-10 w-24 bg-linear-to-r from-white to-transparent" />
      <div className="absolute inset-y-0 right-0 z-10 w-24 bg-linear-to-l from-white to-transparent" />

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

/* ────────────────────────────────────────────────────────────────────
   Hero
   ──────────────────────────────────────────────────────────────────── */
export function Hero() {
  return (
    // Cancels the layout's navbar padding so the backdrop runs to the very top
    // and the island floats over it; the matching pt keeps content clear.
    <section className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-white -mt-(--navbar-height) pt-(--navbar-height)">
      <AuroraField />
      <BlueprintGrid />
      <SilkBackdrop />
      <ParticleField />
      <FoldedCorner />

      {CHIPS.map((chip) => (
        <FloatingChip key={chip.label} chip={chip} />
      ))}

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 pt-16 pb-6 sm:px-6 lg:px-8">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-medium text-slate-600 backdrop-blur-sm shadow-[0_0_0_1px_rgba(30,41,59,0.08)]"
        >
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
          Bounties, problems and solutions in one place
        </motion.div>

        {/* headline */}
        <h1 className="max-w-4xl text-center text-[2.75rem] font-bold leading-[1.04] tracking-[-0.045em] text-[#1E293B] sm:text-6xl lg:text-[4.5rem]">
          <span className="block">
            <RevealLine text="Find Every Bug. Solve" delay={0.15} />
          </span>
          <span className="block">
            <RevealLine text="Every Problem. Faster" delay={0.42} />
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
              className="ml-[-0.04em] inline-block"
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
          transition={{ duration: 0.6, delay: 0.75, ease: "easeOut" }}
          className="mt-6 max-w-xl text-center text-base leading-relaxed text-slate-500"
        >
          Run reward-based bounty programs, triage real vulnerability reports,
          and turn every fix into a validated solution the whole community can
          search.
        </motion.p>

        {/* primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9, ease: "easeOut" }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
            <Link
              href="/account-type"
              className="group inline-flex items-center gap-2.5 rounded-full py-3 pl-6 pr-3 text-base font-semibold text-white shadow-[0_8px_24px_-10px_rgba(37,99,235,0.8)] transition-colors hover:brightness-110"
              style={{ backgroundColor: PRIMARY }}
            >
              Get started free
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full"
                style={{ backgroundColor: ACCENT }}
              >
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </motion.div>

          <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-[#1E293B] shadow-[0_0_0_1px_rgba(30,41,59,0.12)] transition-colors hover:bg-slate-50"
            >
              Explore programs
            </Link>
          </motion.div>
        </motion.div>

        {/* hint label above the command bar, like the reference */}
        {/* <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.0 }}
          className="mt-10 mb-3 rounded-full bg-white/85 px-3 py-1 text-sm text-slate-400 backdrop-blur-sm shadow-[0_0_0_1px_rgba(30,41,59,0.07)]"
        >
          Search 40,000+ validated solutions
        </motion.span> */}
        <span className="mt-10 mb-3 rounded-full bg-white/85 px-3 py-1 text-sm text-slate-400 backdrop-blur-sm shadow-[0_0_0_1px_rgba(30,41,59,0.07)]"></span>

        {/* <div className="flex w-full justify-center">
          <CommandBar />
        </div> */}
      </div>

      {/* trust strip pinned to the bottom of the fold */}
      <div className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <PartnerMarquee />
      </div>
    </section>
  );
}

export default Hero;
