"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";

/* ─── Animated counter ─────────────────────────────────────────────── */
function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = Date.now();

    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, target]);

  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ─── Stats data ───────────────────────────────────────────────────── */
const stats = [
  {
    value: 2400,
    suffix: "+",
    label: "Researchers",
    description: "Active security researchers from around the world",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50",
  },
  {
    value: 150,
    suffix: "+",
    label: "Programs",
    description: "Live bug bounty programs across multiple industries",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
  },
  {
    value: 32000,
    suffix: "+",
    label: "Reports",
    description: "Security reports submitted and validated on platform",
    color: "from-purple-500 to-violet-600",
    bg: "bg-purple-50",
  },
  {
    value: 5,
    suffix: "M+",
    label: "Paid Out",
    description: "Total bounty rewards paid to top researchers (USD)",
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
  },
];

/* ─── Main component ───────────────────────────────────────────────── */
export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section ref={sectionRef} className="py-20 bg-white border-y border-slate-100">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mb-3">
            Trusted by the global security community
          </h2>
          <p className="text-base text-slate-500 max-w-xl mx-auto">
            Numbers that reflect the scale and impact DevSolve delivers every day.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className={`relative ${stat.bg} rounded-2xl p-6 border border-slate-100 overflow-hidden group hover:shadow-md transition-shadow`}
            >
              {/* Gradient bar accent */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color} rounded-t-2xl`} />

              <div className="space-y-1 mb-3">
                <p className={`text-4xl font-black tracking-tight bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}>
                  <AnimatedCount target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-base font-bold text-slate-800">{stat.label}</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
