"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useTheme } from "next-themes";
import { ArrowUpRight } from "lucide-react";
import SectionBackdrop, { ACCENT, PRIMARY, SECONDARY } from "./SectionBackdrop";

// Register plugins client side safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* GSAP animates the tabs and step markers by writing straight onto their
   style attributes, which outranks any `dark:` class. So the two themes are
   resolved here in JS instead and the timeline is rebuilt when the theme
   flips. The dark act tab inverts — it fills light on a dark masthead. */
const TONES = {
  light: {
    tabBg: "#FFFFFF",
    tabText: "#94A3B8",
    tabBorder: "#E2E8F0",
    tabActiveBg: SECONDARY,
    tabActiveText: "#FFFFFF",
    muted: "#CBD5E1",
  },
  dark: {
    tabBg: "#0F172A",
    tabText: "#64748B",
    tabBorder: "#1E293B",
    tabActiveBg: "#E2E8F0",
    tabActiveText: "#0F172A",
    muted: "#475569",
  },
} as const;

/* The Showcase act's accent is the near-black brand secondary, which vanishes
   against a dark surface. It flips to the light slate there; the blue and
   green accents carry on unchanged, since both read on either surface. */
const accentFor = (act: Act, dark: boolean) =>
  dark && act.accent === SECONDARY ? "#E2E8F0" : act.accent;

/* Fixed row height keeps the scroll maths deterministic across breakpoints. */
const STEP_H = 320;

/* ─── Content ──────────────────────────────────────────────────────── */
type Step = { n: string; title: string; role: string; body: string };

type Act = {
  id: string;
  tab: string;
  tabSub: string;
  kicker: string;
  title: string[];
  accent: string;
  href: string;
  hrefLabel: string;
  steps: Step[];
};

const ACTS: Act[] = [
  {
    id: "bounty",
    tab: "Bug Bounty",
    tabSub: "[ Program Lifecycle ]",
    kicker: "How it works",
    title: ["The Bounty", "Lifecycle"],
    accent: PRIMARY,
    href: "/programs",
    hrefLabel: "Browse live programs",
    steps: [
      {
        n: "01",
        title: "Publish",
        role: "Company",
        body: "A company defines its scope, severity tiers and reward bands, then publishes the program. Assets in scope, rules of engagement and payout ranges are public from the first day, so nobody argues later about what counted.",
      },
      {
        n: "02",
        title: "Browse",
        role: "Researcher",
        body: "Researchers filter live programs by asset type, stack, severity band and reward size. Each program page carries the full scope, its payout history and average triage time — you know what you are walking into before you start.",
      },
      {
        n: "03",
        title: "Report",
        role: "Researcher",
        body: "Submit the finding with reproduction steps, impact analysis and a working proof of concept. The report is timestamped the moment it lands, which locks your claim to the vulnerability ahead of anyone else.",
      },
      {
        n: "04",
        title: "Triage",
        role: "Company",
        body: "The security team reproduces the issue, confirms severity against the published tiers, and either accepts it, asks for more detail, or rejects it with a stated reason. Every state change is written to the report timeline.",
      },
      {
        n: "05",
        title: "Reward",
        role: "Researcher",
        body: "On acceptance the bounty is released at the tier the finding landed in, and the report converts into reputation on your public profile. Coordinated disclosure opens once the fix has shipped.",
      },
    ],
  },
  {
    id: "community",
    tab: "Community",
    tabSub: "[ Problems & Solutions ]",
    kicker: "How it works",
    title: ["Problems,", "Answered"],
    accent: ACCENT,
    href: "/problems",
    hrefLabel: "Open the problems feed",
    steps: [
      {
        n: "01",
        title: "Ask",
        role: "Author",
        body: "Post the problem as it actually is: the error, the stack, the versions, and what you already ruled out. Tagged threads route to the people who have shipped in that stack before, instead of sitting unread.",
      },
      {
        n: "02",
        title: "Solve",
        role: "Community",
        body: "Anyone can answer with a solution that works — the code, the config, and the reasoning behind it. The author marks what fixed it, and the thread becomes a validated answer the next person can search for.",
      },
    ],
  },
  {
    id: "showcase",
    tab: "Showcase",
    tabSub: "[ Proof of Work ]",
    kicker: "How it works",
    title: ["Proof", "of Work"],
    accent: SECONDARY,
    href: "/leaderboard",
    hrefLabel: "See the leaderboard",
    steps: [
      {
        n: "01",
        title: "Earn",
        role: "Reputation",
        body: "Every accepted report and every marked solution adds to your score, weighted by the severity of the finding and by how often the answer gets reused by other people.",
      },
      {
        n: "02",
        title: "Display",
        role: "Profile",
        body: "Your public profile carries the whole record: severity breakdown, programs contributed to, threads solved, and the badges earned along the way. One link, nothing to explain.",
      },
      {
        n: "03",
        title: "Rank",
        role: "Leaderboard",
        body: "The global leaderboard ranks on contribution rather than volume. Filter it by program, by stack or by time window to see who is actually doing the work right now.",
      },
    ],
  },
];

/* ─── Arc geometry — dots and the path share one parametrisation ────── */
const ARC = { cx: -180, cy: 400, r: 560, a0: -38, a1: 38, w: 400, h: 800 };

function arcPoint(f: number) {
  const deg = ARC.a0 + (ARC.a1 - ARC.a0) * f;
  const rad = (deg * Math.PI) / 180;
  return {
    x: ARC.cx + ARC.r * Math.cos(rad),
    y: ARC.cy + ARC.r * Math.sin(rad),
  };
}

function formatPercent(value: number, total: number) {
  return `${((value / total) * 100).toFixed(4)}%`;
}

/** Inset so the first and last dot never sit at the very ends of the sweep. */
function dotFraction(index: number, total: number) {
  return total <= 1 ? 0.5 : 0.15 + (index / (total - 1)) * 0.7;
}

const ARC_PATH = (() => {
  const a = arcPoint(0);
  const b = arcPoint(1);
  return `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} A ${ARC.r} ${ARC.r} 0 0 1 ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
})();

/* ─── Component ────────────────────────────────────────────────────── */
export function FeatureHighlights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const tone = isDark ? TONES.dark : TONES.light;

  const totalUnits = ACTS.reduce(
    (sum, act) => sum + 0.6 + act.steps.length + 0.5,
    0,
  );

  useGSAP(
    () => {
      if (!pinRef.current || !containerRef.current) return;

      /* Initial states */
      ACTS.forEach((act, ai) => {
        gsap.set(`.act-${ai}`, { opacity: ai === 0 ? 1 : 0 });
        gsap.set(`.stack-${ai}`, { y: -STEP_H / 2 });
        gsap.set(`.arcline-${ai}`, { strokeDashoffset: 1 });
        gsap.set(`.tab-${ai}`, {
          backgroundColor: tone.tabBg,
          color: tone.tabText,
          borderColor: tone.tabBorder,
        });
        act.steps.forEach((_, si) => {
          gsap.set(`.step-${ai}-${si}`, { opacity: si === 0 ? 1 : 0.16 });
          gsap.set(`.num-${ai}-${si}`, {
            color: si === 0 ? accentFor(act, isDark) : tone.muted,
          });
          gsap.set(`.dot-${ai}-${si}`, {
            scale: si === 0 ? 1 : 0.5,
            backgroundColor: si === 0 ? accentFor(act, isDark) : tone.muted,
          });
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          pin: pinRef.current,
          start: "top top",
          end: `+=${Math.round(totalUnits * 62)}%`,
          scrub: 0.9,
          anticipatePin: 1,
        },
      });

      tl.to(
        ".gsap-progress-bar",
        { scaleX: 1, ease: "none", duration: totalUnits },
        0,
      );

      let t = 0;

      ACTS.forEach((act, ai) => {
        const isLast = ai === ACTS.length - 1;
        const n = act.steps.length;

        /* ── act enters ── */
        if (ai > 0) {
          tl.to(
            `.act-${ai}`,
            { opacity: 1, duration: 0.4, ease: "power2.out" },
            t,
          );
        }

        tl.to(
          `.tab-${ai}`,
          {
            backgroundColor: tone.tabActiveBg,
            color: tone.tabActiveText,
            borderColor: tone.tabActiveBg,
            duration: 0.3,
          },
          t,
        );

        /* kinetic title — character stagger, same feel as before */
        tl.fromTo(
          `.act-title-${ai} .t-char`,
          { y: 54, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.028,
            duration: 0.5,
            ease: "back.out(1.3)",
          },
          t,
        );

        tl.fromTo(
          `.act-meta-${ai}`,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
          t + 0.15,
        );

        /* ── steps advance one at a time ── */
        act.steps.forEach((_, si) => {
          const st = t + 0.6 + si;
          const f = dotFraction(si, n);

          tl.to(
            `.stack-${ai}`,
            {
              y: -(si * STEP_H + STEP_H / 2),
              duration: 0.7,
              ease: "power2.inOut",
            },
            st,
          );
          tl.to(`.step-${ai}-${si}`, { opacity: 1, duration: 0.45 }, st);
          tl.to(`.num-${ai}-${si}`, { color: accentFor(act, isDark), duration: 0.45 }, st);
          tl.to(
            `.dot-${ai}-${si}`,
            {
              scale: 1,
              backgroundColor: accentFor(act, isDark),
              duration: 0.45,
              ease: "back.out(2)",
            },
            st,
          );
          tl.to(
            `.arcline-${ai}`,
            { strokeDashoffset: 1 - f, duration: 0.7, ease: "power2.inOut" },
            st,
          );
          tl.to(
            `.counter-${ai}`,
            { innerText: si + 1, snap: { innerText: 1 }, duration: 0.4 },
            st,
          );

          if (si > 0) {
            tl.to(
              `.step-${ai}-${si - 1}`,
              { opacity: 0.16, duration: 0.45 },
              st,
            );
            tl.to(
              `.num-${ai}-${si - 1}`,
              { color: tone.muted, duration: 0.45 },
              st,
            );
            tl.to(
              `.dot-${ai}-${si - 1}`,
              { scale: 0.5, backgroundColor: tone.muted, duration: 0.45 },
              st,
            );
          }
        });

        t += 0.6 + n + 0.5;

        /* ── act leaves ── */
        if (!isLast) {
          tl.to(
            `.act-${ai}`,
            { opacity: 0, y: -36, duration: 0.4, ease: "power2.in" },
            t,
          );
          tl.to(
            `.tab-${ai}`,
            {
              backgroundColor: tone.tabBg,
              color: tone.tabText,
              borderColor: tone.tabBorder,
              duration: 0.3,
            },
            t,
          );
          tl.fromTo(
            `.act-${ai + 1}`,
            { y: 36 },
            { y: 0, duration: 0.4, ease: "power2.out" },
            t + 0.1,
          );
          t += 0.4;
        }
      });
    },
    /* The timeline bakes the tone's hex values into its tweens, so a theme
       flip has to tear it down and rebuild rather than just re-run. */
    { scope: containerRef, dependencies: [tone], revertOnUpdate: true },
  );

  return (
    <section ref={containerRef} className="relative bg-white dark:bg-slate-950">
      {/* Scroll progress rail */}
      <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 h-0.5 bg-slate-200/70 dark:bg-slate-800/70">
        <div
          className="gsap-progress-bar h-full origin-left"
          style={{
            transform: "scaleX(0)",
            background: `linear-gradient(to right, ${PRIMARY}, ${ACCENT})`,
          }}
        />
      </div>

      <div
        ref={pinRef}
        className="relative flex h-dvh w-full flex-col overflow-hidden"
      >
        {/* Editorial grid paper, drifting aurora and rising motes */}
        <SectionBackdrop seed={1} gridSize={88} />

        {/* ── Masthead ── */}
        <header className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-8 sm:px-12">
          <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6 dark:border-slate-800">
            <div>
              <p className="text-xl font-bold tracking-tight text-[#1E293B] sm:text-2xl dark:text-slate-100">
                DevSolve
              </p>
              <p className="mt-1.5 text-sm font-medium tracking-[0.28em] text-slate-400 dark:text-slate-500">
                [ PLATFORM ]
              </p>
            </div>

            {/* Act tabs — the active one fills dark (and inverts in dark mode) */}
            <nav className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 dark:border-slate-800 dark:bg-slate-800">
              {ACTS.map((act, ai) => (
                <div
                  key={act.id}
                  className={`tab-${ai} flex min-w-26 flex-col justify-center mt-8 px-3 py-2.5 text-center sm:min-w-37.5 sm:px-4`}
                >
                  <span className="text-sm font-semibold tracking-tight">
                    {act.tab}
                  </span>
                  <span className="mt-0.5 hidden text-[11px] font-medium opacity-70 sm:block">
                    {act.tabSub}
                  </span>
                </div>
              ))}
            </nav>
          </div>
        </header>

        {/* ── Stage ── */}
        <div className="relative z-10 mx-auto w-full max-w-7xl flex-1 px-6 sm:px-12">
          {ACTS.map((act, ai) => (
            <div
              key={act.id}
              className={`act-${ai} absolute inset-x-6 inset-y-0 sm:inset-x-12`}
              style={{ maxWidth: "80rem" }}
            >
              {/* Sweeping arc with a dot per step */}
              <div className="pointer-events-none absolute inset-y-0 left-[2%] hidden w-[36%] lg:block">
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${ARC.w} ${ARC.h}`}
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    d={ARC_PATH}
                    fill="none"
                    stroke={isDark ? "#FFFFFF" : SECONDARY}
                    strokeOpacity="0.14"
                    strokeWidth="1"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    className={`arcline-${ai}`}
                    d={ARC_PATH}
                    fill="none"
                    stroke={accentFor(act, isDark)}
                    strokeWidth="1.5"
                    pathLength={1}
                    strokeDasharray={1}
                    strokeDashoffset={1}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {act.steps.map((step, si) => {
                  const p = arcPoint(dotFraction(si, act.steps.length));
                  return (
                    <div
                      key={step.n}
                      /* No inline fill: GSAP writes the real one on mount,
                         and the class keeps the pre-hydration paint right in
                         both themes. */
                      className={`dot-${ai}-${si} absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-slate-300 dark:bg-slate-600`}
                      style={{
                        left: `${((p.x / ARC.w) * 100).toFixed(4)}%`,
                        top: `${((p.y / ARC.h) * 100).toFixed(4)}%`,
                      }}
                    />
                  );
                })}
              </div>

              <div className="grid h-full grid-cols-1 items-center gap-8 lg:grid-cols-[0.85fr_1.65fr] lg:gap-12">
                {/* LEFT — act title */}
                <div className="relative flex flex-col justify-center pt-4 lg:pt-0">
                  <div className="mb-4 flex items-center gap-2.5">
                    <span
                      className="h-px w-8"
                      style={{ backgroundColor: accentFor(act, isDark) }}
                    />
                    <span
                      className="text-xs font-bold uppercase tracking-[0.22em]"
                      style={{ color: accentFor(act, isDark) }}
                    >
                      {act.kicker}
                    </span>
                  </div>

                  <h2
                    className={`act-title-${ai} font-bold leading-[1.02] tracking-[-0.045em] text-[#1E293B] dark:text-slate-100`}
                    style={{
                      fontSize: "clamp(34px, 4.2vw, 60px)",
                    }}
                  >
                    {act.title.map((line, li) => (
                      <span key={li} className="block">
                        {Array.from(line).map((char, ci) => (
                          <span
                            key={ci}
                            className="t-char inline-block"
                            style={{ willChange: "transform, opacity, filter" }}
                          >
                            {char === " " ? " " : char}
                          </span>
                        ))}
                        {li === act.title.length - 1 && (
                          <span
                            className="t-char inline-block"
                            style={{
                              color: accentFor(act, isDark),
                              willChange: "transform, opacity",
                            }}
                          >
                            .
                          </span>
                        )}
                      </span>
                    ))}
                  </h2>

                  <div className={`act-meta-${ai} mt-7 space-y-5`}>
                    <div className="flex items-baseline gap-2 font-mono text-sm text-slate-400 dark:text-slate-500">
                      <span
                        className={`counter-${ai} text-2xl font-bold tabular-nums text-[#1E293B] dark:text-slate-100`}
                      >
                        1
                      </span>
                      <span className="text-lg">/</span>
                      <span className="text-lg tabular-nums">
                        {act.steps.length}
                      </span>
                      <span className="ml-1 text-xs uppercase tracking-[0.2em]">
                        steps
                      </span>
                    </div>

                    <Link
                      href={act.href}
                      className="group inline-flex items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                      style={{ color: accentFor(act, isDark) }}
                    >
                      {act.hrefLabel}
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Link>
                  </div>
                </div>

                {/* RIGHT — numbered steps scrolling through a masked window */}
                <div
                  className="relative h-95 overflow-hidden lg:h-115"
                  style={{
                    maskImage:
                      "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, transparent, #000 16%, #000 84%, transparent)",
                  }}
                >
                  <div className={`stack-${ai} absolute inset-x-0 top-1/2`}>
                    {act.steps.map((step, si) => (
                      <div
                        key={step.n}
                        className={`step-${ai}-${si} grid grid-cols-[auto_1fr] items-start gap-5 overflow-hidden sm:gap-8`}
                        style={{ height: STEP_H }}
                      >
                        <span
                          /* Resting colour as a class; GSAP takes it over
                             from mount onwards. */
                          className={`num-${ai}-${si} block pt-1 text-right font-bold tabular-nums leading-none tracking-[-0.06em] text-slate-300 dark:text-slate-600`}
                          style={{
                            fontSize: "clamp(52px, 7.5vw, 108px)",
                            width: "clamp(80px, 11vw, 160px)",
                          }}
                        >
                          {step.n}
                        </span>

                        <div className="pt-2">
                          <div className="mb-2 flex items-baseline gap-3">
                            <h3 className="text-2xl font-bold tracking-tight text-[#1E293B] sm:text-3xl dark:text-slate-100">
                              {step.title}
                              <span style={{ color: accentFor(act, isDark) }}>.</span>
                            </h3>
                            <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400 dark:border-slate-700 dark:text-slate-500">
                              {step.role}
                            </span>
                          </div>
                          <p className="max-w-xl text-sm leading-[1.8] text-slate-500 sm:text-[15px] dark:text-slate-400">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer hint ── */}
        <footer className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between gap-4 border-t border-slate-200 px-6 py-5 sm:px-12 dark:border-slate-800">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            Scroll to advance
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tracking-[0.2em] text-slate-300 dark:text-slate-600">
              01 — {String(ACTS.length).padStart(2, "0")}
            </span>
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full"
              style={{ backgroundColor: PRIMARY }}
            />
          </div>
        </footer>
      </div>
    </section>
  );
}

export default FeatureHighlights;
