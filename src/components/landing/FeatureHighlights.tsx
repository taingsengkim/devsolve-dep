"use client";

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import {
  Bug,
  Trophy,
  Code2,
  MessageSquare,
  Lightbulb,
  ArrowUpRight,
} from "lucide-react";

/* ─── Feature data ─────────────────────────────────────────────────── */
const features = [
  {
    icon: Bug,
    title: "Bug Bounty Programs",
    description:
      "Join reward-based security programs from top companies. Find vulnerabilities, submit reports, and earn bounties — all in one platform.",
    tag: "Security",
    tagColor: "bg-red-50 text-red-700 border-red-200",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    accent: "group-hover:border-red-200",
    href: "/programs",
  },
  {
    icon: Code2,
    title: "Technical Challenges",
    description:
      "Sharpen your skills with curated engineering puzzles. From reverse engineering to web exploitation — level up your expertise.",
    tag: "Practice",
    tagColor: "bg-blue-50 text-blue-700 border-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "group-hover:border-blue-200",
    href: "/hacktivity",
  },
  {
    icon: MessageSquare,
    title: "Community Discussions",
    description:
      "Ask questions, share write-ups, and learn from experienced researchers. A vibrant developer community always ready to help.",
    tag: "Community",
    tagColor: "bg-purple-50 text-purple-700 border-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    accent: "group-hover:border-purple-200",
    href: "/discussions",
  },
  {
    icon: Lightbulb,
    title: "Technical Solutions",
    description:
      "Search and browse thousands of validated technical solutions. Find answers, post problems, and share your knowledge base.",
    tag: "Knowledge",
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "group-hover:border-emerald-200",
    href: "/discussions",
  },
  {
    icon: Trophy,
    title: "Showcase Expertise",
    description:
      "Build a reputation that matters. Every report, challenge solved, and contribution adds to your public profile and credibility.",
    tag: "Reputation",
    tagColor: "bg-yellow-50 text-yellow-700 border-yellow-200",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    accent: "group-hover:border-yellow-200",
    href: "/leaderboard",
  },
];

/* ─── Single feature card with tilt hover ─────────────────────────── */
function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Icon = feature.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 12;
    ref.current.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)";
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transition: "transform 0.2s ease, box-shadow 0.2s ease" }}
        className={`group relative bg-white rounded-2xl border border-slate-200 p-6 cursor-default h-full flex flex-col gap-4 shadow-xs hover:shadow-lg ${feature.accent} transition-colors`}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className={`w-11 h-11 rounded-xl ${feature.iconBg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${feature.iconColor}`} />
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${feature.tagColor}`}>
            {feature.tag}
          </span>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-bold text-slate-900 leading-snug">{feature.title}</h3>
          <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1 text-sm font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
          <span>Learn more</span>
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>

        {/* Hover shine effect */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/60 via-transparent to-transparent" />
      </div>
    </motion.div>
  );
}

/* ─── Section header ───────────────────────────────────────────────── */
function SectionHeader() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="text-center space-y-4 mb-12"
    >
      <span className="inline-block text-xs font-semibold uppercase tracking-widest text-blue-600 bg-blue-50 border border-blue-200/60 px-3 py-1 rounded-full">
        Platform
      </span>
      <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
        Everything in One Place
      </h2>
      <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
        DevSolve brings together the best of security research, developer communities, and
        technical knowledge — so you never have to look elsewhere.
      </p>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
export function FeatureHighlights() {
  return (
    <section className="relative py-24 bg-[#FAF9F5] overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1.5" fill="#1E293B" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader />

        {/* Feature grid: 2 cols on md, 3 cols on lg */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.slice(0, 3).map((f, i) => (
            <FeatureCard key={f.title} feature={f} index={i} />
          ))}
          {/* Bottom row: 2 cards centered */}
          <div className="sm:col-span-2 lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 lg:max-w-[66%] lg:mx-auto">
            {features.slice(3).map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i + 3} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureHighlights;
