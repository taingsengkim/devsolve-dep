"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const STAR_FIELD = Array.from({ length: 58 }, (_, index) => {
  const seed = (index * 53 + 17) % 101;
  const size = 1.1 + (index % 4) * 0.55;
  const isGlow = index % 6 === 0;

  return {
    id: index,
    left: 2 + ((seed * 13) % 96),
    top: 4 + ((seed * 19) % 88),
    size,
    delay: index * 0.08,
    duration: 2.6 + (index % 7) * 0.45,
    driftX: (index % 2 === 0 ? 1 : -1) * (1.8 + (index % 3) * 0.75),
    driftY: index % 4 === 0 ? -2.8 : 2.8,
    opacity: isGlow ? 0.95 : index % 5 === 0 ? 0.82 : 0.62,
    scale: isGlow ? 1.45 : 1.2,
    blur: isGlow ? 1.2 : size > 2 ? 0.45 : 0,
    shadow: isGlow
      ? "0 0 12px currentColor"
      : size > 2
        ? "0 0 6px currentColor"
        : "none",
  };
});

type StarsBackgroundProps = {
  className?: string;
  starColor?: string;
};

export function StarsBackground({
  className,
  starColor = "#000000",
}: StarsBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none overflow-hidden rounded-[inherit]",
        className,
      )}
    >
      <motion.div
        className="absolute inset-0"
        animate={{ x: [0, 4, 0], y: [0, -3, 0] }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 14,
          ease: "easeInOut",
        }}
      >
      {STAR_FIELD.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: starColor,
            color: starColor,
            filter: `blur(${star.blur}px)`,
            boxShadow: star.shadow,
          }}
          animate={{
            x: [0, star.driftX, 0],
            y: [0, star.driftY, 0],
            opacity: [star.opacity * 0.18, star.opacity, star.opacity * 0.18],
            scale: [0.88, star.scale, 0.88],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: star.duration,
            delay: star.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      </motion.div>
    </div>
  );
}
