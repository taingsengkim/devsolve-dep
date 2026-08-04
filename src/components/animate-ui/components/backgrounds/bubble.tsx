"use client";

import * as React from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const BUBBLES = Array.from({ length: 10 }, (_, index) => {
  const seed = (index * 67 + 19) % 100;
  const size = 92 + (index % 4) * 34;

  return {
    id: index,
    left: 3 + ((seed * 13) % 94),
    top: 6 + ((seed * 17) % 82),
    size,
    delay: index * 0.18,
    duration: 12 + (index % 6) * 1.7,
    driftX: (index % 2 === 0 ? 1 : -1) * (12 + (index % 3) * 5),
    driftY: index % 3 === 0 ? -12 : 12,
    accent:
      index % 3 === 0
        ? "border-blue-200/50 bg-blue-100/16"
        : index % 3 === 1
          ? "border-emerald-200/45 bg-emerald-100/14"
          : "border-slate-200/80 bg-white/50",
  };
});

const NODES = [
  { id: 1, x: 5, y: 10, size: 10, accent: "bg-blue-500/28" },
  { id: 2, x: 18, y: 25, size: 12, accent: "bg-blue-400/24" },
  { id: 3, x: 34, y: 13, size: 9, accent: "bg-slate-400/18" },
  { id: 4, x: 51, y: 26, size: 11, accent: "bg-blue-500/24" },
  { id: 5, x: 68, y: 14, size: 10, accent: "bg-slate-400/18" },
  { id: 6, x: 86, y: 22, size: 14, accent: "bg-emerald-400/28" },
  { id: 7, x: 77, y: 56, size: 10, accent: "bg-blue-400/24" },
  { id: 8, x: 55, y: 74, size: 12, accent: "bg-slate-400/18" },
  { id: 9, x: 28, y: 66, size: 14, accent: "bg-emerald-400/22" },
  { id: 10, x: 10, y: 58, size: 10, accent: "bg-blue-400/22" },
];

const CONNECTIONS = [
  "M5 10 L18 25 L34 13 L51 26 L68 14 L86 22",
  "M10 58 L18 25 L28 66 L55 74 L77 56 L86 22",
  "M5 10 L10 58 L28 66 L51 26",
  "M34 13 L55 74 L77 56",
  "M18 25 L51 26 L77 56",
];

type BubbleBackgroundProps = {
  interactive?: boolean;
  className?: string;
};

export function BubbleBackground({
  interactive = false,
  className,
}: BubbleBackgroundProps) {
  const [pointer, setPointer] = React.useState({ x: 50, y: 50, active: false });

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    setPointer({ x, y, active: true });
  };

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none overflow-hidden rounded-[inherit]", className)}
      onMouseMove={handleMove}
      onMouseLeave={() => setPointer((current) => ({ ...current, active: false }))}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.92))] dark:bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.14),transparent_28%),linear-gradient(180deg,rgba(2,6,23,0.98),rgba(15,23,42,0.94))]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 dark:bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] dark:opacity-20" />

      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full opacity-90"
        animate={{ x: [0, 2, 0], y: [0, -1.5, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 18,
          ease: "easeInOut",
        }}
      >
        {CONNECTIONS.map((path, index) => (
          <motion.path
            key={path}
            d={path}
            fill="none"
            stroke={index % 2 === 0 ? "rgba(37,99,235,0.14)" : "rgba(148,163,184,0.18)"}
            strokeWidth={0.22}
            strokeLinecap="round"
            initial={{ pathLength: 0.96, opacity: 0.45 }}
            animate={{
              pathLength: [0.94, 1, 0.94],
              opacity: [0.32, 0.72, 0.32],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 5.5 + index * 0.7,
              delay: index * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.svg>

      {BUBBLES.map((bubble) => (
        <motion.span
          key={bubble.id}
          className={cn(
            "absolute rounded-full border backdrop-blur-[2px]",
            bubble.accent,
          )}
          style={{
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
          }}
          animate={{
            x: [0, bubble.driftX, 0],
            y: [0, bubble.driftY, 0],
            opacity: [0.12, 0.28, 0.12],
            scale: [0.96, 1.03, 0.96],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: bubble.duration,
            delay: bubble.delay,
            ease: "easeInOut",
          }}
        />
      ))}

      {NODES.map((node, index) => (
        <motion.span
          key={node.id}
          className={cn(
            "absolute rounded-full border border-white/90 shadow-[0_0_0_6px_rgba(255,255,255,0.52)]",
            node.accent,
          )}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            width: `${node.size}px`,
            height: `${node.size}px`,
          }}
          animate={{
            scale: [1, 1.16, 1],
            opacity: [0.42, 0.9, 0.42],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 3.2 + index * 0.4,
            delay: index * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}

      {interactive ? (
        <motion.div
          className="absolute size-72 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.10),rgba(16,185,129,0.05),transparent_72%)] blur-3xl"
          animate={{
            left: `calc(${pointer.x}% - 9rem)`,
            top: `calc(${pointer.y}% - 9rem)`,
            opacity: pointer.active ? 1 : 0,
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      ) : null}
    </div>
  );
}
