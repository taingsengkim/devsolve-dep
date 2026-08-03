"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { ArrowRight, Bug, Trophy, Code2, MessageSquare, Star, ChevronRight, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SmoothCursor from "@/components/lightswind/smooth-cursor";

/* ─── Animated looping words ─────────────────────────────────────── */
const FEATURE_WORDS = ["Solutions", "Bounties", "Challenges", "Community", "Expertise"];

function AnimatedWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % FEATURE_WORDS.length);
    }, 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block overflow-hidden" style={{ minWidth: "1ch" }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={FEATURE_WORDS[index]}
          initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-blue-600"
        >
          {FEATURE_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ─── Interactive Draggable Card ────────────────────────────────────── */
function InteractiveCard({
  children,
  className = "",
  delay = 0,
  dragConstraints,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  dragConstraints?: React.RefObject<HTMLDivElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [zIndex, setZIndex] = useState(10);
  const rotateX = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isDragging) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const relX = (e.clientX - centerX) / (rect.width / 2);
    const relY = (e.clientY - centerY) / (rect.height / 2);
    rotateX.set(-relY * 10);
    rotateY.set(relX * 10);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      drag
      dragConstraints={dragConstraints}
      dragElastic={0.25}
      dragTransition={{ bounceStiffness: 400, bounceDamping: 25 }}
      whileDrag={{ scale: 1.08, zIndex: 50 }}
      whileHover={{ scale: 1.03 }}
      onDragStart={() => {
        setIsDragging(true);
        setZIndex(50);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        rotateX.set(0);
        rotateY.set(0);
      }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
        zIndex,
      }}
      className={`cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ─── Floating UI preview cards ────────────────────────────────────── */
function BountyCard({ dragConstraints }: { dragConstraints?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <InteractiveCard
      delay={0.3}
      dragConstraints={dragConstraints}
      className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl hover:shadow-2xl p-4 w-64 transition-shadow"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
          <Bug className="w-4 h-4 text-emerald-600" />
        </div>
        <span className="text-sm font-semibold text-slate-700">Active Bounty</span>
        <span className="ml-auto text-xs bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
          OPEN
        </span>
      </div>
      <p className="text-sm font-medium text-slate-800 leading-snug mb-2">
        SQL Injection in /api/auth endpoint
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-400">Critical · 3 reports</span>
        <span className="text-sm font-bold text-emerald-600">$5,000</span>
      </div>
      <div className="mt-3 h-1 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-emerald-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "72%" }}
          transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
        />
      </div>
    </InteractiveCard>
  );
}

function DiscussionCard({ dragConstraints }: { dragConstraints?: React.RefObject<HTMLDivElement | null> }) {
  return (
    <InteractiveCard
      delay={0.5}
      dragConstraints={dragConstraints}
      className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl hover:shadow-2xl p-4 w-60 transition-shadow"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-blue-600" />
        </div>
        <span className="text-sm font-semibold text-slate-700">Discussion</span>
      </div>
      <p className="text-sm font-medium text-slate-800 leading-snug mb-2">
        How to bypass CSRF with OAuth2 flows?
      </p>
      <div className="flex items-center gap-2">
        <div className="flex -space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-indigo-500"
            />
          ))}
        </div>
        <span className="text-xs text-slate-400">24 replies · 3h ago</span>
      </div>
    </InteractiveCard>
  );
}

function LeaderboardCard({ dragConstraints }: { dragConstraints?: React.RefObject<HTMLDivElement | null> }) {
  const items = [
    { name: "0xShadow", pts: 12400, color: "from-yellow-400 to-orange-500" },
    { name: "BugHunterX", pts: 9870, color: "from-slate-400 to-slate-600" },
    { name: "h4xor99", pts: 7210, color: "from-amber-700 to-amber-900" },
  ];

  return (
    <InteractiveCard
      delay={0.7}
      dragConstraints={dragConstraints}
      className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-xl hover:shadow-2xl p-4 w-56 transition-shadow"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-yellow-100 flex items-center justify-center">
          <Trophy className="w-4 h-4 text-yellow-600" />
        </div>
        <span className="text-sm font-semibold text-slate-700">Leaderboard</span>
      </div>
      <div className="space-y-2">
        {items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 + i * 0.15 }}
            className="flex items-center gap-2"
          >
            <div
              className={`w-5 h-5 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-[9px] font-bold text-white`}
            >
              {i + 1}
            </div>
            <span className="text-xs font-medium text-slate-700 flex-1">{item.name}</span>
            <span className="text-xs font-bold text-slate-500">
              {item.pts.toLocaleString()} pts
            </span>
          </motion.div>
        ))}
      </div>
    </InteractiveCard>
  );
}

/* ─── Animated background grid ────────────────────────────────────── */
function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#1E293B" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Gradient fade at edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F5] via-transparent to-[#FAF9F5]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#FAF9F5] via-transparent to-[#FAF9F5]" />
    </div>
  );
}

/* ─── Floating badge ───────────────────────────────────────────────── */
function PillBadge({ icon: Icon, text }: { icon: LucideIcon; text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200/60 text-blue-700 text-sm font-medium px-3.5 py-1.5 rounded-full shadow-sm"
    >
      <Icon className="w-3.5 h-3.5" />
      {text}
    </motion.div>
  );
}

/* ─── Main Hero ────────────────────────────────────────────────────── */
export function Hero() {
  const rightContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section className="relative min-h-[calc(100dvh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-[#FAF9F5] py-12 lg:py-16">
      {/* Smooth cursor */}
      <SmoothCursor color="#2563EB" showTrail={true} glowEffect={true} />

      {/* Background effects */}
      <GridBackground />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-40 bg-indigo-400/8 rounded-full blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left — Text */}
          <div className="flex flex-col items-start gap-6">
            <PillBadge icon={Zap} text="Everything in One Place" />

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900"
              >
                Find
                <br />
                <AnimatedWord />
                <br />
                <span className="text-slate-900">Together.</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
              className="text-lg text-slate-600 leading-relaxed max-w-lg"
            >
              DevSolve is the best place to find technical solutions for your company,
              engage in reward-based bounty programs, tackle technical challenges, join
              community discussions, and showcase your expertise.
            </motion.p>

            {/* CTA Row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
              className="flex flex-wrap gap-3 pt-2"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/account-type"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base px-6 py-3 rounded-full shadow-lg shadow-blue-500/25 transition-colors group"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-6 py-3 rounded-full shadow-sm transition-colors group"
                >
                  Explore programs
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </motion.div>

            {/* Social proof row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex items-center gap-4 pt-2"
            >
              <div className="flex -space-x-2">
                {["from-blue-400 to-indigo-500", "from-emerald-400 to-teal-500", "from-purple-400 to-pink-500", "from-orange-400 to-red-500", "from-yellow-400 to-orange-500"].map((g, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br ${g} shadow-sm`}
                  />
                ))}
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">2,400+</span> researchers joined
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — Floating Interactive Draggable UI cards */}
          <div
            ref={rightContainerRef}
            className="relative hidden lg:flex items-center justify-center h-[580px]"
          >

            {/* Main center card */}
            <InteractiveCard
              delay={0.2}
              dragConstraints={rightContainerRef}
              className="absolute inset-0 m-auto w-72 h-56 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/90 shadow-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md shadow-blue-500/20">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Challenge Solved</p>
                  <p className="text-xs text-slate-500">Buffer overflow exploit</p>
                </div>
                <div className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <div className="h-px bg-slate-100" />
              <div className="space-y-1.5">
                {[
                  { label: "Difficulty", value: "Critical", color: "text-red-600 bg-red-50" },
                  { label: "Reward", value: "$2,500", color: "text-emerald-600 bg-emerald-50" },
                  { label: "Submissions", value: "14", color: "text-blue-600 bg-blue-50" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{row.label}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${row.color}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </InteractiveCard>

            {/* Top-right card */}
            <div className="absolute top-8 right-4">
              <BountyCard dragConstraints={rightContainerRef} />
            </div>

            {/* Bottom-left card */}
            <div className="absolute bottom-16 left-0">
              <DiscussionCard dragConstraints={rightContainerRef} />
            </div>

            {/* Top-left card */}
            <div className="absolute top-16 left-8">
              <LeaderboardCard dragConstraints={rightContainerRef} />
            </div>

            {/* Decorative floating dots */}
            {([
              { style: { position: "absolute" as const, top: "10%", left: "50%" }, delay: 0.8 },
              { style: { position: "absolute" as const, top: "60%", right: "8%" }, delay: 1.1 },
              { style: { position: "absolute" as const, bottom: "12%", left: "40%" }, delay: 1.3 },
            ] as const).map((dot, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: dot.delay, type: "spring", stiffness: 300 }}
                style={dot.style}
                className="w-2.5 h-2.5 rounded-full bg-blue-400/40 border border-blue-400/60"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
