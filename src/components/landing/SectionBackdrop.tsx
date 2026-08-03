"use client";

import React, { useId, useMemo } from "react";
import { motion, useReducedMotion } from "motion/react";

/* ─── Brand palette (design.md) ────────────────────────────────────── */
export const PRIMARY = "#2563EB";
export const SECONDARY = "#1E293B";
export const ACCENT = "#10B981";

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

type Tone = "light" | "dark";

export type SectionBackdropProps = {
  /** Surface the backdrop sits on — drives grid and particle contrast. */
  tone?: Tone;
  /** Seeds the deterministic particle and cell layout. Vary per section. */
  seed?: number;
  /** Rising motes. */
  particles?: boolean;
  /** Sweeping scan beams. */
  beams?: boolean;
  /** Drifting colour fields. */
  aurora?: boolean;
  /** Grid cells that light up and fade. */
  cells?: boolean;
  gridSize?: number;
  className?: string;
};

const CELL_COUNT = 10;
const PARTICLE_COUNT = 14;

/**
 * The animated layer shared by every landing section — grid paper, drifting
 * aurora, pulsing cells, scan beams and rising motes. Only transform and
 * opacity animate, and every infinite loop is gated behind reduced motion.
 */
export function SectionBackdrop({
  tone = "light",
  seed = 1,
  particles = true,
  beams = true,
  aurora = true,
  cells = true,
  gridSize = 88,
  className = "",
}: SectionBackdropProps) {
  const reduce = useReducedMotion();
  const rawId = useId();
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, "");
  const dark = tone === "dark";

  const gridStroke = dark ? "#ffffff" : SECONDARY;
  const gridOpacity = dark ? 0.07 : 0.05;

  const cellSpecs = useMemo(() => {
    const rand = mulberry32(seed * 977 + 7);
    return Array.from({ length: CELL_COUNT }, () => ({
      col: Math.floor(rand() * 22),
      row: Math.floor(rand() * 11),
      color: rand() > 0.5 ? PRIMARY : ACCENT,
      delay: rand() * 9,
      duration: 3.5 + rand() * 3,
    }));
  }, [seed]);

  const particleSpecs = useMemo(() => {
    const rand = mulberry32(seed * 5081 + 23);
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      left: 4 + rand() * 92,
      size: 2 + rand() * 3,
      delay: rand() * 16,
      duration: 16 + rand() * 12,
      drift: (rand() - 0.5) * 70,
      color: rand() > 0.55 ? ACCENT : PRIMARY,
    }));
  }, [seed]);

  const blobs = useMemo(
    () => [
      {
        color: PRIMARY,
        className: "left-[-14%] top-[4%] h-[30rem] w-[30rem]",
        path: { x: [0, 80, -40, 0], y: [0, -50, 40, 0], scale: [1, 1.12, 0.94, 1] },
        duration: 28,
        opacity: dark ? 0.24 : 0.13,
      },
      {
        color: ACCENT,
        className: "right-[-10%] top-[30%] h-[26rem] w-[26rem]",
        path: { x: [0, -60, 36, 0], y: [0, 60, -26, 0], scale: [1, 0.92, 1.14, 1] },
        duration: 34,
        opacity: dark ? 0.18 : 0.11,
      },
      {
        color: dark ? PRIMARY : SECONDARY,
        className: "bottom-[-12%] left-1/3 h-[22rem] w-[34rem]",
        path: { x: [0, 54, -54, 0], y: [0, -34, 18, 0], scale: [1, 1.08, 0.96, 1] },
        duration: 40,
        opacity: dark ? 0.16 : 0.08,
      },
    ],
    [dark],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {/* Drifting colour fields */}
      {aurora &&
        blobs.map((blob, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-[110px] ${blob.className}`}
            style={{ backgroundColor: blob.color, opacity: blob.opacity }}
            animate={reduce ? undefined : blob.path}
            transition={{ duration: blob.duration, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

      {/* Grid paper + cells that light up */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <pattern
            id={`bg-grid-${uid}`}
            width={gridSize}
            height={gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
              fill="none"
              stroke={gridStroke}
              strokeOpacity={gridOpacity}
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#bg-grid-${uid})`} />

        {cells &&
          cellSpecs.map((cell, i) => (
            <motion.rect
              key={i}
              x={cell.col * gridSize + 1}
              y={cell.row * gridSize + 1}
              width={gridSize - 2}
              height={gridSize - 2}
              fill={cell.color}
              initial={{ opacity: 0 }}
              animate={reduce ? undefined : { opacity: [0, dark ? 0.1 : 0.07, 0] }}
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

      {/* Scan beams */}
      {beams && (
        <>
          <motion.div
            className="absolute inset-y-0 w-px"
            style={{
              background: `linear-gradient(to bottom, transparent, ${PRIMARY}, transparent)`,
            }}
            initial={{ opacity: 0 }}
            animate={reduce ? undefined : { left: ["8%", "92%"], opacity: [0, 0.35, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", repeatDelay: 6 }}
          />
          <motion.div
            className="absolute inset-x-0 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${ACCENT}, transparent)`,
            }}
            initial={{ opacity: 0 }}
            animate={reduce ? undefined : { top: ["18%", "86%"], opacity: [0, 0.3, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", repeatDelay: 8 }}
          />
        </>
      )}

      {/* Rising motes */}
      {particles &&
        !reduce &&
        particleSpecs.map((p, i) => (
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
              y: ["0%", "-1600%"],
              x: [0, p.drift, 0],
              opacity: [0, dark ? 0.7 : 0.5, dark ? 0.7 : 0.5, 0],
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

export default SectionBackdrop;
