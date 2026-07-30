"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const STAR_FIELD = Array.from({ length: 42 }, (_, index) => {
  const seed = (index * 73) % 97;
  const size = 1 + (index % 3) * 0.35;

  return {
    id: index,
    left: 2 + ((seed * 11) % 96),
    top: 4 + ((seed * 17) % 90),
    size,
    delay: index * 0.11,
    duration: 3.2 + (index % 6) * 0.55,
    driftX: (index % 2 === 0 ? 1 : -1) * (1 + (index % 3) * 0.4),
    driftY: index % 4 === 0 ? -2 : 2,
    blur: index % 7 === 0 ? "0.4px" : "0px",
    opacity: index % 5 === 0 ? 0.78 : 0.55,
    glow: size > 1.2 ? "0 0 10px rgba(15,23,42,0.12)" : "none",
  };
});

type GravityStarsBackgroundProps = {
  className?: string;
};

export function GravityStarsBackground({
  className,
}: GravityStarsBackgroundProps) {
  return (
    <div
      className={cn(
        "pointer-events-none overflow-hidden rounded-[inherit]",
        className,
      )}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.05),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.04),transparent_32%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))]" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[24rem] w-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-blue-100/70"
        animate={{ rotate: 360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 30, ease: "linear" }}
      >
        <motion.span
          className="absolute left-1/2 top-0 block size-2.5 -translate-x-1/2 rounded-full bg-blue-500/70 shadow-[0_0_20px_rgba(37,99,235,0.22)]"
          animate={{ scale: [0.88, 1.15, 0.88], opacity: [0.45, 0.95, 0.45] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.8, ease: "easeInOut" }}
        />
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-[15rem] w-[15rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-100/75"
        animate={{ rotate: -360 }}
        transition={{ repeat: Number.POSITIVE_INFINITY, duration: 22, ease: "linear" }}
      >
        <motion.span
          className="absolute bottom-0 left-1/2 block size-2 -translate-x-1/2 rounded-full bg-emerald-500/75 shadow-[0_0_16px_rgba(16,185,129,0.24)]"
          animate={{ scale: [0.84, 1.18, 0.84], opacity: [0.42, 0.92, 0.42] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2.4, ease: "easeInOut" }}
        />
      </motion.div>

      {STAR_FIELD.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-slate-900"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            filter: `blur(${star.blur})`,
            boxShadow: star.glow,
          }}
          animate={{
            x: [0, star.driftX, 0],
            y: [0, star.driftY, 0],
            opacity: [star.opacity * 0.35, star.opacity, star.opacity * 0.35],
            scale: [0.92, 1.12, 0.92],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: star.duration,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
