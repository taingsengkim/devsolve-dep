"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Bug, Trophy, MessageSquare, Lightbulb, ArrowUpRight, Sparkles } from "lucide-react";

// Register plugins client side safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ─── Feature chapters ─────────────────────────────────────────────── */
const chapters = [
  {
    id: "bug-bounty",
    icon: Bug,
    kineticWord: "Hunt.",
    subtitle: "Bug Bounty",
    description:
      "Join reward-based security programs from top companies. Find vulnerabilities, submit reports, and earn bounties — all in one platform.",
    tag: "Security",
    accent: "#EF4444",
    accentLight: "#FEF2F2",
    accentDark: "#B91C1C",
    href: "/programs",
    stat: "$5K+",
    statLabel: "avg. bounty payout",
    detail: "Critical, High, Medium, Low severity tiers with instant payout on acceptance.",
    tagline: "Find critical vulnerabilities. Get paid.",
  },
  {
    id: "community",
    icon: MessageSquare,
    kineticWord: "Learn.",
    subtitle: "Community",
    description:
      "Ask questions, share write-ups, and learn from experienced researchers. A vibrant developer community always ready to help.",
    tag: "Community",
    accent: "#7C3AED",
    accentLight: "#F5F3FF",
    accentDark: "#6D28D9",
    href: "/discussions",
    stat: "12K+",
    statLabel: "active members",
    detail: "Threaded discussions, write-up sharing, and expert code reviews.",
    tagline: "Learn from 12,000+ researchers.",
  },
  {
    id: "solutions",
    icon: Lightbulb,
    kineticWord: "Solve.",
    subtitle: "Solutions",
    description:
      "Search and browse thousands of validated technical solutions. Find answers, post problems, and share your knowledge base.",
    tag: "Knowledge",
    accent: "#059669",
    accentLight: "#ECFDF5",
    accentDark: "#047857",
    href: "/discussions",
    stat: "40K+",
    statLabel: "validated answers",
    detail: "Community-verified solutions with code snippets and reproduction steps.",
    tagline: "Every answer, validated by experts.",
  },
  {
    id: "reputation",
    icon: Trophy,
    kineticWord: "Shine.",
    subtitle: "Reputation",
    description:
      "Build a reputation that matters. Every report, challenge solved, and contribution adds to your public profile and credibility.",
    tag: "Reputation",
    accent: "#D97706",
    accentLight: "#FFFBEB",
    accentDark: "#B45309",
    href: "/leaderboard",
    stat: "Top 1%",
    statLabel: "ranked profiles",
    detail: "Public leaderboard, verified badges, and recruiter visibility tools.",
    tagline: "Your reputation, built to last.",
  },
];

export function FeatureHighlights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  // GSAP Scrollytelling & Kinetic Typography setup using useGSAP hook
  useGSAP(
    () => {
      if (!pinRef.current || !containerRef.current) return;

      const totalChapters = chapters.length;

      // Master ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: `+=${totalChapters * 100}%`,
          scrub: 0.8,
          anticipatePin: 1,
        },
      });

      // Animate progress line at top
      tl.to(".gsap-progress-bar", {
        scaleX: 1,
        ease: "none",
        duration: totalChapters,
      }, 0);

      // Chapter by chapter transition setup
      chapters.forEach((chapter, index) => {
        const isFirst = index === 0;
        const isLast = index === totalChapters - 1;
        const timeOffset = index;

        // 1. Kinetic Typography character stagger
        const wordChars = `.kinetic-char-${index}`;
        const wordWrapper = `.kinetic-word-${index}`;
        const taglineEl = `.tagline-${index}`;
        const cardEl = `.chapter-card-${index}`;
        const navDot = `.nav-dot-${index}`;
        const bgGlow = `.bg-glow-${index}`;

        if (!isFirst) {
          // Fade in current chapter word, tagline, card, and background glow
          tl.to(
            wordWrapper,
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            timeOffset
          )
            .fromTo(
              wordChars,
              { y: 60, opacity: 0, filter: "blur(10px)", scale: 1.2 },
              {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                scale: 1,
                stagger: 0.04,
                duration: 0.5,
                ease: "back.out(1.4)",
              },
              timeOffset
            )
            .fromTo(
              taglineEl,
              { y: 20, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
              timeOffset + 0.1
            )
            .fromTo(
              cardEl,
              { x: 80, opacity: 0, scale: 0.95, rotateY: 10 },
              {
                x: 0,
                opacity: 1,
                scale: 1,
                rotateY: 0,
                duration: 0.6,
                ease: "power3.out",
              },
              timeOffset
            )
            .to(
              bgGlow,
              { opacity: 0.6, scale: 1.2, duration: 0.6 },
              timeOffset
            )
            .to(
              navDot,
              { backgroundColor: chapter.accent, scale: 1.3, duration: 0.3 },
              timeOffset
            );
        } else {
          // First chapter initial state
          tl.to(bgGlow, { opacity: 0.6, duration: 0.4 }, 0)
            .to(navDot, { backgroundColor: chapter.accent, scale: 1.3, duration: 0.3 }, 0);
        }

        // Fade out unless it's the last chapter
        if (!isLast) {
          const fadeOutTime = timeOffset + 0.75;
          tl.to(
            [wordWrapper, taglineEl, cardEl],
            { opacity: 0, y: -40, duration: 0.25, ease: "power2.in" },
            fadeOutTime
          )
            .to(bgGlow, { opacity: 0, duration: 0.25 }, fadeOutTime)
            .to(navDot, { backgroundColor: "#CBD5E1", scale: 1 }, fadeOutTime);
        }
      });
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="relative bg-[#FAF9F5]">
      {/* GSAP Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-slate-200 z-50 pointer-events-none">
        <div
          className="gsap-progress-bar h-full bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Pinned Viewport */}
      <div
        ref={pinRef}
        className="w-full h-screen overflow-hidden flex flex-col justify-between relative"
      >
        {/* Header Badge */}
        <header className="relative z-20 pt-8 px-6 sm:px-12 flex justify-between items-center max-w-[1280px] mx-auto w-full">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-700 bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            GSAP Powered Scrollytelling
          </div>

          <div className="flex items-center gap-2">
            {chapters.map((ch, idx) => (
              <div
                key={ch.id}
                className={`nav-dot-${idx} w-2.5 h-2.5 rounded-full bg-slate-300 transition-colors`}
              />
            ))}
          </div>
        </header>

        {/* Dynamic Background Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {chapters.map((ch, idx) => (
            <div
              key={ch.id}
              className={`bg-glow-${idx} absolute top-1/3 -right-20 w-[500px] h-[500px] rounded-full blur-3xl opacity-0 transition-opacity`}
              style={{ backgroundColor: ch.accentLight }}
            />
          ))}
          {/* Subtle grid background */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="gsap-grid" width="32" height="32" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#1E293B" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#gsap-grid)" />
          </svg>
        </div>

        {/* Main Content Grid (Left Kinetic Text, Right Card) */}
        <main className="relative z-10 grid grid-cols-1 lg:grid-cols-2 max-w-[1280px] mx-auto w-full px-6 sm:px-12 items-center flex-1 my-auto gap-8">
          
          {/* LEFT: Kinetic Typography Container */}
          <div className="relative flex flex-col justify-center min-h-[320px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Platform Capabilities
              </span>
            </div>

            {/* Layered Kinetic Words */}
            <div className="relative h-[160px] sm:h-[200px] flex items-center">
              {chapters.map((ch, idx) => {
                const chars = ch.kineticWord.split("");
                return (
                  <div
                    key={ch.id}
                    className={`kinetic-word-${idx} absolute inset-0 flex items-center ${
                      idx === 0 ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <h2
                      className="font-black tracking-tight leading-none select-none flex"
                      style={{
                        fontSize: "clamp(72px, 11vw, 150px)",
                        color: ch.accent,
                      }}
                      aria-label={ch.kineticWord}
                    >
                      {chars.map((char, charIdx) => (
                        <span
                          key={charIdx}
                          className={`kinetic-char-${idx} inline-block`}
                          style={{
                            display: "inline-block",
                            willChange: "transform, opacity, filter",
                          }}
                        >
                          {char === " " ? "\u00A0" : char}
                        </span>
                      ))}
                    </h2>
                  </div>
                );
              })}
            </div>

            {/* Layered Taglines */}
            <div className="relative h-8 mt-2 overflow-hidden">
              {chapters.map((ch, idx) => (
                <p
                  key={ch.id}
                  className={`tagline-${idx} absolute inset-0 text-base sm:text-lg font-medium text-slate-600 flex items-center ${
                    idx === 0 ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {ch.tagline}
                </p>
              ))}
            </div>
          </div>

          {/* RIGHT: Feature Cards Container */}
          <div className="relative min-h-[380px] flex items-center justify-center">
            {chapters.map((ch, idx) => {
              const Icon = ch.icon;
              return (
                <div
                  key={ch.id}
                  className={`chapter-card-${idx} absolute inset-0 m-auto bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl flex flex-col justify-between max-w-lg h-[380px] ${
                    idx === 0 ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-xs"
                        style={{ backgroundColor: ch.accentLight }}
                      >
                        <Icon className="w-6 h-6" style={{ color: ch.accent }} />
                      </div>
                      <span
                        className="text-xs font-bold px-3 py-1 rounded-full border uppercase tracking-wider"
                        style={{
                          backgroundColor: ch.accentLight,
                          color: ch.accentDark,
                          borderColor: `${ch.accent}30`,
                        }}
                      >
                        {ch.tag}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                      {ch.subtitle}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                      {ch.description}
                    </p>
                  </div>

                  {/* Footer & CTA */}
                  <div>
                    <div
                      className="flex items-center justify-between p-3.5 rounded-2xl border mb-6"
                      style={{
                        backgroundColor: ch.accentLight,
                        borderColor: `${ch.accent}20`,
                      }}
                    >
                      <span className="text-2xl font-black" style={{ color: ch.accent }}>
                        {ch.stat}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {ch.statLabel}
                      </span>
                    </div>

                    <a
                      href={ch.href}
                      className="inline-flex items-center gap-2 text-sm font-bold group"
                      style={{ color: ch.accent }}
                    >
                      <span>Explore {ch.subtitle}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Footer Scroll Hint */}
        <footer className="relative z-20 pb-8 px-6 text-center text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-2">
          <span>Scroll to scrub GSAP animations</span>
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
        </footer>
      </div>
    </section>
  );
}

export default FeatureHighlights;
