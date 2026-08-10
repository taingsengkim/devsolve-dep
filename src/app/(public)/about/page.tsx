"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Award,
  Bug,
  CheckCircle2,
  Code2,
  Database,
  Globe2,
  HardDrive,
  KeyRound,
  Layers,
  Leaf,
  Lock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Search,
  Send,
  ShieldAlert,
  Target,
  Triangle,
  Trophy,
  Waypoints,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  FaFacebook,
  FaGithub,
  FaLinkedin,
  FaTelegram,
  FaXTwitter,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

import SectionBackdrop, { useInk } from "@/components/landing/SectionBackdrop";
import {
  SUPERVISORS,
  STUDENT_DEVELOPERS,
  TECHNOLOGIES,
} from "@/lib/types/about/mock-data";
import type { TeamMember, Technology } from "@/lib/types/about/type";

/* ─── Shared surface tokens ──────────────────────────────────────────────
   Shadow-as-border, exactly as the landing sections state it: a 1px ring
   plus a shallow ambient layer, swapping to the brand ring on hover. Kept
   in one place here so every card on the page reads as the same material. */
const CARD =
  "rounded-2xl bg-white shadow-[0_0_0_1px_rgba(30,41,59,0.08),0_2px_10px_rgba(30,41,59,0.05)] dark:bg-neutral-900 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_2px_10px_rgba(0,0,0,0.5)]";

const CARD_HOVER =
  "transition-shadow hover:shadow-[0_0_0_1px_rgba(37,99,235,0.35),0_10px_28px_-14px_rgba(30,41,59,0.35)] dark:hover:shadow-[0_0_0_1px_rgba(96,165,250,0.45),0_10px_28px_-14px_rgba(0,0,0,0.7)]";

/* #2563EB clears 4.5:1 on white but not on neutral-950, and blue-400 is the
   reverse — so the brand ink is a class pair rather than a single value. */
const BRAND_INK = "text-[#2563EB] dark:text-blue-400";

/* ─── Section surfaces ───────────────────────────────────────────────────
   Light alternates white against slate-50, which is most of what separates
   one section from the next. Dark has no such alternation to make — every
   surface is neutral-950, the way the landing states it — so there the
   hairline is the only thing carrying the structure, and every section past
   the hero has to draw one. `border-t` rather than `border-y`: adjacent
   sections would otherwise stack two rules into a 2px seam. */
const SECTION_LIFTED =
  "border-t border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950";

const SECTION_RECESSED =
  "border-t border-slate-200 bg-slate-50 dark:border-neutral-800 dark:bg-neutral-950";

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ════════════════════════════════════════════════════════════════════
   SECTION HEADING — the landing's header pattern
   ════════════════════════════════════════════════════════════════════ */

function SectionHeading({
  kicker,
  title,
  lede,
  inView,
}: {
  kicker: string;
  title: string;
  lede: string;
  inView: boolean;
}) {
  const ink = useInk();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex flex-col justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-end dark:border-neutral-800"
    >
      <div>
        <div className="mb-4 flex items-center gap-2.5">
          <span className="h-px w-8 bg-[#2563EB] dark:bg-blue-400" />
          <span
            className={`text-xs font-bold uppercase tracking-[0.22em] ${BRAND_INK}`}
          >
            {kicker}
          </span>
        </div>

        <h2
          className="max-w-2xl text-3xl font-bold tracking-[-0.04em] sm:text-4xl lg:text-5xl"
          style={{ color: ink }}
        >
          {title}
          <span className={BRAND_INK}>.</span>
        </h2>
      </div>

      <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-neutral-400">
        {lede}
      </p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   HERO — split screen, text left, the team on the right
   ════════════════════════════════════════════════════════════════════ */

const TEAM_SIZE = SUPERVISORS.length + STUDENT_DEVELOPERS.length;

/* Derived from the roster rather than typed out, so the figures cannot
   drift away from the cards further down the page. Two digits throughout —
   the same spec-sheet numbering the capability tiles and the team group
   labels use, so a 2 and an 11 occupy the same box. */
const pad2 = (n: number) => String(n).padStart(2, "0");

const HERO_STATS = [
  { value: pad2(TEAM_SIZE), label: "Team members" },
  { value: pad2(SUPERVISORS.length), label: "Faculty mentors" },
  { value: pad2(TECHNOLOGIES.length), label: "Core technologies" },
];

function AboutHero() {
  const ink = useInk();

  return (
    // The negative margin cancels the layout's navbar padding so the backdrop
    // runs to the very top and the nav island floats over it — same trick the
    // landing hero uses.
    <section className="relative -mt-(--navbar-height) overflow-hidden bg-[#F7F8FB] pt-(--navbar-height) dark:bg-neutral-950">
      <SectionBackdrop seed={1} gridSize={88} />

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-16 sm:px-12 sm:py-20 lg:grid-cols-12 lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="lg:col-span-6"
        >
          <div className="mb-5 flex items-center gap-2.5">
            <span className="h-px w-8 bg-[#2563EB] dark:bg-blue-400" />
            <span
              className={`text-xs font-bold uppercase tracking-[0.22em] ${BRAND_INK}`}
            >
              About DevSolve
            </span>
            <span className="text-xs font-medium text-slate-400 dark:text-neutral-500">
              Est. 2026
            </span>
          </div>

          <h1
            className="text-4xl font-bold leading-[1.06] tracking-[-0.045em] sm:text-5xl lg:text-6xl"
            style={{ color: ink }}
          >
            The team that turns
            <br />
            findings into fixes
            <span className={BRAND_INK}>.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-500 dark:text-neutral-400">
            DevSolve connects organizations with security researchers and
            developers to solve real technical problems, close vulnerabilities
            responsibly, and build software that holds up in production.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
              <Link
                href="/programs"
                className="inline-flex items-center rounded-full bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(37,99,235,0.85)] transition-[filter] hover:brightness-110"
              >
                Explore programs
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0, scale: 0.98 }}>
              <Link
                href="#team"
                className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-[0_6px_18px_-10px_rgba(15,23,42,0.4)] transition-colors hover:bg-slate-50 dark:border-neutral-700/80 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800"
              >
                Meet the team
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </motion.div>
          </div>

          {/* Hairline-separated figures rather than boxed tiles — the same
              de-emphasised treatment the stats section uses.

              Column-reverse, not a reordered list: the figure has to sit on
              a shared top edge or a label that wraps to two lines drops its
              number below the others, while `dt` still precedes `dd` in the
              DOM the way a definition list requires. */}
          <dl className="mt-10 grid max-w-lg grid-cols-3">
            {HERO_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col-reverse gap-2 ${
                  i > 0
                    ? "border-l border-slate-200 pl-4 dark:border-neutral-800 sm:pl-6"
                    : ""
                } ${i < HERO_STATS.length - 1 ? "pr-4 sm:pr-6" : ""}`}
              >
                <dt className="text-xs font-medium uppercase leading-normal tracking-[0.14em] text-slate-400 dark:text-neutral-500">
                  {stat.label}
                </dt>
                <dd
                  className="text-4xl font-bold leading-none tracking-[-0.04em] tabular-nums"
                  style={{ color: ink }}
                >
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
          className="relative lg:col-span-6"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 shadow-[0_0_0_1px_rgba(30,41,59,0.08),0_24px_60px_-30px_rgba(15,23,42,0.55)] sm:aspect-[3/2] dark:bg-neutral-800 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_24px_60px_-30px_rgba(0,0,0,0.9)]">
            <Image
              src="/teams/team.jpg"
              alt="The DevSolve engineering and security team"
              fill
              priority
              quality={90}
              sizes="(max-width: 1024px) 100vw, 620px"
              className="object-cover object-top"
            />
          </div>

          {/* One floating chip, anchored to the frame — enough to give the
              photo depth without decorating it. */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: EASE_OUT }}
            className={`absolute -bottom-5 left-5 flex items-center gap-3 px-4 py-3 sm:left-8 ${CARD}`}
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15">
              <Trophy className="size-4 text-[#2563EB] dark:text-blue-400" />
            </span>
            <div>
              <p
                className="text-sm font-bold tracking-tight"
                style={{ color: ink }}
              >
                One team, one platform
              </p>
              <p className="text-xs text-slate-400 dark:text-neutral-500">
                Bounties, challenges and community in one place
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   MISSION & VISION
   ════════════════════════════════════════════════════════════════════ */

type Pillar = {
  kicker: string;
  title: string;
  body: string;
  points: string[];
  icon: LucideIcon;
  /* Class pairs, not values: an inline colour cannot state a dark
     counterpart, and #10B981 is a mark-only hue on white (2.54:1) — so the
     emerald pillar is typeset in emerald-700 on light. */
  inkClass: string;
  tintClass: string;
};

const PILLARS: Pillar[] = [
  {
    kicker: "Our mission",
    title: "Responsible disclosure, and learning that compounds",
    body: "Empower ethical hackers to find and report vulnerabilities responsibly, reward the contributions that matter, and build a habit of continuous learning through challenges drawn from real systems.",
    points: [
      "Structured, secure vulnerability reporting",
      "Transparent evaluation and merit-based rewards",
      "Anti-cheating and plagiarism prevention",
      "Innovation through real-world challenges",
    ],
    icon: Target,
    inkClass: "text-[#2563EB] dark:text-blue-400",
    tintClass: "bg-blue-50 dark:bg-blue-500/15",
  },
  {
    kicker: "Our vision",
    title: "A cybersecurity community worth trusting",
    body: "Become the most trusted bridge between organizations and ethical hackers — an ecosystem where security awareness grows, talent is recognised globally, and the internet gets more resilient through collective effort.",
    points: [
      "Globally trusted platform for all stakeholders",
      "Active, security-first collaborative community",
      "Scalable infrastructure for enterprise bounties",
      "Cybersecurity education through practice",
    ],
    icon: Globe2,
    inkClass: "text-[#047857] dark:text-emerald-400",
    tintClass: "bg-emerald-50 dark:bg-emerald-500/15",
  },
];

function MissionVision() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const ink = useInk();

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-24 ${SECTION_LIFTED}`}
    >
      <SectionBackdrop seed={2} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        <SectionHeading
          kicker="What drives us"
          title="Why DevSolve exists"
          lede="Two commitments hold the platform together: disclosure that is safe for everyone involved, and a community that keeps getting better at the work."
          inView={inView}
        />

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {PILLARS.map((pillar, i) => {
            const Icon = pillar.icon;

            return (
              <motion.article
                key={pillar.kicker}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.55,
                  delay: 0.15 + i * 0.12,
                  ease: EASE_OUT,
                }}
                className={`flex flex-col p-7 sm:p-8 ${CARD} ${CARD_HOVER}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex size-11 items-center justify-center rounded-xl ${pillar.tintClass}`}
                  >
                    <Icon className={`size-5 ${pillar.inkClass}`} />
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-[0.22em] ${pillar.inkClass}`}
                  >
                    {pillar.kicker}
                  </span>
                </div>

                <h3
                  className="mt-6 text-xl font-bold tracking-[-0.03em] sm:text-2xl"
                  style={{ color: ink }}
                >
                  {pillar.title}
                </h3>

                <p className="mt-3 text-base leading-relaxed text-slate-500 dark:text-neutral-400">
                  {pillar.body}
                </p>

                <ul className="mt-7 space-y-3 border-t border-slate-200 pt-6 dark:border-neutral-800">
                  {pillar.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-start gap-3 text-sm text-slate-500 dark:text-neutral-400"
                    >
                      <CheckCircle2
                        className={`mt-0.5 size-4 shrink-0 ${pillar.inkClass}`}
                        aria-hidden
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CAPABILITIES — everything in one place
   ════════════════════════════════════════════════════════════════════ */

/* Severity is an ordered scale, so the chips ride an ink-weight ramp rather
   than three unrelated hues — the same treatment the landing gives it, and
   the same one the role chips further down the page use. */
const SEVERITY_CHIP: Record<string, string> = {
  Critical: "bg-[#1E293B] text-white dark:bg-neutral-100 dark:text-neutral-900",
  High: "bg-slate-200 text-slate-700 dark:bg-neutral-700 dark:text-neutral-100",
  Medium:
    "border border-slate-200 text-slate-500 dark:border-neutral-700 dark:text-neutral-400",
};

const QUEUE_ROWS = [
  { severity: "Critical", reach: 100, payout: "$4,500" },
  { severity: "High", reach: 62, payout: "$1,200" },
  { severity: "Medium", reach: 28, payout: "$400" },
] as const;

/** Report triage, in miniature: severity, reward reach, payout. */
function ReportQueue({ inView }: { inView: boolean }) {
  const ink = useInk();

  return (
    <div className="space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/60">
      {QUEUE_ROWS.map((row, i) => (
        <div key={row.severity} className="flex items-center gap-3">
          <span
            className={`w-18 shrink-0 rounded-lg px-2 py-0.5 text-center text-xs font-bold ${SEVERITY_CHIP[row.severity]}`}
          >
            {row.severity}
          </span>

          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-neutral-800">
            <motion.span
              className="block h-full rounded-full bg-[#2563EB] dark:bg-blue-400"
              initial={{ width: 0 }}
              animate={inView ? { width: `${row.reach}%` } : undefined}
              transition={{
                duration: 0.9,
                delay: 0.4 + i * 0.1,
                ease: EASE_OUT,
              }}
            />
          </span>

          <span
            className="w-14 shrink-0 text-right text-xs font-bold tabular-nums"
            style={{ color: ink }}
          >
            {row.payout}
          </span>
        </div>
      ))}
    </div>
  );
}

const BOARD_ROWS = [
  { handle: "0xShadow", points: "12,400" },
  { handle: "kmartens", points: "9,870" },
  { handle: "h4xor99", points: "7,210" },
] as const;

/** The top of the board, in miniature. */
function MiniBoard({ inView }: { inView: boolean }) {
  const ink = useInk();

  return (
    <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-slate-50/80 px-4 dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-950/60">
      {BOARD_ROWS.map((row, i) => (
        <motion.div
          key={row.handle}
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.45, delay: 0.4 + i * 0.1, ease: EASE_OUT }}
          className="flex items-center gap-3 py-2.5"
        >
          <span
            className={`flex size-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold tabular-nums ${
              i === 0
                ? "bg-[#2563EB] text-white"
                : "bg-slate-200 text-slate-600 dark:bg-neutral-800 dark:text-neutral-300"
            }`}
          >
            {i + 1}
          </span>

          <span
            className="min-w-0 flex-1 truncate text-sm font-semibold"
            style={{ color: ink }}
          >
            {row.handle}
          </span>

          <span
            className="shrink-0 text-sm font-bold tabular-nums"
            style={{ color: ink }}
          >
            {row.points}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

type Capability = {
  title: string;
  body: string;
  icon: LucideIcon;
  /* Span on the 12-column bento. The pairs run 7/5, 5/7, 6/6 — zig-zag
     rather than three equal feature columns, which design.md rules out. */
  span: string;
  tags?: string[];
  visual?: "queue" | "board";
};

const CAPABILITIES: Capability[] = [
  {
    title: "Bug bounty programs",
    body: "Organizations publish scoped programs in Markdown. Researchers find, document and report vulnerabilities through one structured, auditable workflow.",
    icon: Bug,
    span: "lg:col-span-7",
    visual: "queue",
  },
  {
    title: "Technical challenges",
    body: "A library of coding and security challenges with stated evaluation criteria, secure file submission, and confidential judging.",
    icon: Code2,
    span: "lg:col-span-5",
    tags: ["Secure upload", "Stated rubric", "Blind judging"],
  },
  {
    title: "Discussion forum",
    body: "A community space to trade ideas, ask technical questions and share write-ups that outlive any single submission.",
    icon: MessageSquare,
    span: "lg:col-span-5",
    tags: ["Threads", "Write-ups", "Accepted answers"],
  },
  {
    title: "Global leaderboards",
    body: "Live rankings weighted by points, reputation and outcomes. Consistent contributors earn recognition and badge tiers.",
    icon: Trophy,
    span: "lg:col-span-7",
    visual: "board",
  },
  {
    title: "Reward system",
    body: "Reward policies with milestone bonuses, badge tiers and payouts tied directly to accepted reports and challenge solutions.",
    icon: Award,
    span: "lg:col-span-6",
    tags: ["Milestone bonuses", "Badge tiers", "Payouts"],
  },
  {
    title: "Secure authentication",
    body: "Keycloak-backed auth, anti-cheating mechanisms, plagiarism checks and duplicate-submission protection.",
    icon: Lock,
    span: "lg:col-span-6",
    tags: ["Keycloak OIDC", "PKCE", "Duplicate detection"],
  },
];

function Capabilities() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const ink = useInk();

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-24 ${SECTION_RECESSED}`}
    >
      <SectionBackdrop seed={3} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        <SectionHeading
          kicker="The platform"
          title="Everything in one place"
          lede="DevSolve covers the whole challenge lifecycle — from publishing a program to paying the reward — without handing work off to a second tool."
          inView={inView}
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {CAPABILITIES.map((item, i) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{
                  duration: 0.5,
                  delay: 0.15 + i * 0.08,
                  ease: EASE_OUT,
                }}
                className={`group flex flex-col p-6 sm:p-7 ${item.span} ${CARD} ${CARD_HOVER}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-slate-100 transition-colors group-hover:bg-blue-50 dark:bg-neutral-800 dark:group-hover:bg-blue-500/15">
                    <Icon className="size-5 text-[#2563EB] dark:text-blue-400" />
                  </span>

                  {/* The index is part of the composition rather than a
                      footnote — it is the only thing that moves on hover. */}
                  <span
                    /* neutral-800 on a neutral-900 card is not a de-emphasised
                       number, it is an invisible one — dark needs a step
                       further from its surface than light does. */
                    className="text-2xl font-bold leading-none tracking-[-0.04em] tabular-nums text-slate-200 transition-colors group-hover:text-[#2563EB] dark:text-neutral-700 dark:group-hover:text-blue-400"
                    aria-hidden
                  >
                    {pad2(i + 1)}
                  </span>
                </div>

                <h3
                  className="mt-5 text-lg font-bold tracking-[-0.02em]"
                  style={{ color: ink }}
                >
                  {item.title}
                </h3>

                <p className="mt-2 max-w-prose text-sm leading-relaxed text-slate-500 dark:text-neutral-400">
                  {item.body}
                </p>

                {/* `mt-auto` pins the bottom band, so the tag rows and the
                    panels line up across a row of unequal-height tiles. */}
                <div className="mt-auto pt-6">
                  {item.visual === "queue" && <ReportQueue inView={inView} />}
                  {item.visual === "board" && <MiniBoard inView={inView} />}

                  {item.tags && (
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500 dark:bg-neutral-800 dark:text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TECH STACK
   ════════════════════════════════════════════════════════════════════ */

const TECH_ICONS: Record<string, LucideIcon> = {
  Triangle,
  Leaf,
  Database,
  Zap,
  HardDrive,
  Search,
  KeyRound,
  ShieldAlert,
  Waypoints,
};

/** One node of the stack — the same card in the constellation and the grid. */
function TechCard({ tech }: { tech: Technology }) {
  const ink = useInk();
  const Icon = TECH_ICONS[tech.iconName] ?? Layers;

  return (
    <div
      className={`flex h-full items-start gap-3.5 p-4 ${CARD} ${CARD_HOVER}`}
    >
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15">
        <Icon
          className="size-4.5 text-[#2563EB] dark:text-blue-400"
          aria-hidden
        />
      </span>

      <div className="min-w-0">
        <h3
          className="truncate text-sm font-bold tracking-tight"
          style={{ color: ink }}
        >
          {tech.name}
        </h3>
        <p className="mt-0.5 text-xs leading-snug text-slate-500 dark:text-neutral-400">
          {tech.description}
        </p>
      </div>
    </div>
  );
}

/* ─── The constellation ─────────────────────────────────────────────────
   A fixed canvas rather than a responsive one: the composition is hand
   placed, so letting it reflow would only produce a different, worse
   arrangement. It renders at xl and up, where the container is wide enough
   to hold it at 1:1 — every narrower viewport gets the grid instead, since
   scaling this down would take the captions past readability.
   ──────────────────────────────────────────────────────────────────── */
const SCENE_W = 1120;
const SCENE_H = 640;
const HUB = { x: 560, y: 320 };
const NODE_W = 244;

/* Concentric rounded squares, echoing the shape of the hub tile. The outer
   two run past the canvas and are clipped, which is what stops the field
   from reading as a closed badge. */
const RINGS = [190, 290, 400, 520, 650, 790];

/* Keyed by name, not by index, so the data file can be reordered without
   silently scrambling the layout. */
const NODE_SPOTS: Record<string, { x: number; y: number; drift: number }> = {
  "Next.js": { x: 380, y: 18, drift: -8 },
  "Spring Boot": { x: 720, y: 84, drift: 9 },
  PostgreSQL: { x: 856, y: 208, drift: -7 },
  Redis: { x: 846, y: 336, drift: 8 },
  MinIO: { x: 716, y: 462, drift: -9 },
  Meilisearch: { x: 410, y: 552, drift: 7 },
  Keycloak: { x: 110, y: 462, drift: -8 },
  VirusTotal: { x: 24, y: 330, drift: 9 },
  "Reverse proxy": { x: 96, y: 150, drift: -7 },
};

function TechConstellation({
  technologies,
  inView,
}: {
  technologies: Technology[];
  inView: boolean;
}) {
  const reduce = useReducedMotion();

  return (
    <div
      className="relative overflow-hidden"
      style={{ width: SCENE_W, height: SCENE_H }}
      aria-hidden
    >
      {RINGS.map((size, i) => (
        <motion.div
          key={size}
          /* Full opacity on dark: neutral-800 at 80% over neutral-950 is below
             the point where a 1px rule still reads as a ring. */
          className="absolute rounded-[28%] border border-slate-200/80 dark:border-neutral-800"
          style={{
            left: HUB.x - size / 2,
            top: HUB.y - size / 2,
            width: size,
            height: size,
          }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={inView ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.06, ease: EASE_OUT }}
        />
      ))}

      {/* Rings that keep pulsing outward — the same signal the landing hub
          sends, in the shape this section uses. */}
      {!reduce &&
        [0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-[28%] border border-[#2563EB]/40 dark:border-blue-400/40"
            style={{
              left: HUB.x - RINGS[0] / 2,
              top: HUB.y - RINGS[0] / 2,
              width: RINGS[0],
              height: RINGS[0],
            }}
            animate={{
              scale: [1, RINGS[RINGS.length - 1] / RINGS[0]],
              opacity: [0.55, 0],
            }}
            transition={{
              duration: 5.4,
              repeat: Infinity,
              delay: i * 1.8,
              ease: "easeOut",
            }}
          />
        ))}

      {/* The hub */}
      <motion.div
        className="absolute"
        style={{ left: HUB.x - 74, top: HUB.y - 74, width: 148, height: 148 }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={inView ? { opacity: 1, scale: 1 } : undefined}
        transition={{
          type: "spring",
          stiffness: 190,
          damping: 17,
          delay: 0.15,
        }}
      >
        <span className="absolute -inset-8 rounded-full bg-[#2563EB]/25 blur-2xl" />

        <motion.div
          className="relative flex size-full items-center justify-center rounded-[28%] bg-[#2563EB] shadow-[0_26px_54px_-18px_rgba(37,99,235,0.85)]"
          animate={reduce ? undefined : { y: [0, -9, 0] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="relative size-24 overflow-hidden rounded-full bg-white shadow-[0_10px_20px_-8px_rgba(23,37,84,0.5)]">
            <Image
              src="/devsolve.png"
              alt=""
              fill
              sizes="96px"
              quality={100}
              className="object-contain p-1.5"
            />
          </span>
        </motion.div>
      </motion.div>

      {technologies.map((tech, i) => {
        const spot = NODE_SPOTS[tech.name];
        if (!spot) return null;

        return (
          <motion.div
            key={tech.name}
            className="absolute"
            style={{ left: spot.x, top: spot.y, width: NODE_W }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : undefined}
            transition={{
              delay: 0.3 + i * 0.07,
              type: "spring",
              stiffness: 320,
              damping: 22,
            }}
          >
            <motion.div
              animate={reduce ? undefined : { y: [0, spot.drift, 0] }}
              transition={{
                duration: 5.5 + Math.abs(spot.drift) * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TechCard tech={tech} />
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}

function TechStack({
  technologies = TECHNOLOGIES,
}: {
  technologies?: Technology[];
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-24 ${SECTION_LIFTED}`}
    >
      <SectionBackdrop seed={4} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        <SectionHeading
          kicker="Tech stack"
          title="What it runs on"
          lede="An end-to-end architecture picked for security and predictable operations rather than novelty — every piece feeding one platform."
          inView={inView}
        />

        <div className="mt-8 hidden justify-center xl:flex">
          <TechConstellation technologies={technologies} inView={inView} />
        </div>

        {/* The same nodes, laid out plainly for anything narrower. */}
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:hidden">
          {technologies.map((tech, i) => (
            <motion.li
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.5,
                delay: 0.15 + i * 0.06,
                ease: EASE_OUT,
              }}
            >
              <TechCard tech={tech} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   TEAM
   ════════════════════════════════════════════════════════════════════ */

/* Roles are an ordered hierarchy, so the chips ride an ink-weight ramp
   rather than four unrelated hues — the same treatment the landing gives
   severity. Every chip is labelled, so nothing rests on colour alone.
   The ramp inverts on dark: what carries the ordering is distance from
   the surface, not the direction of travel. */
const ROLE_CHIP: Record<string, string> = {
  Mentor: "bg-[#1E293B] text-white dark:bg-neutral-100 dark:text-neutral-900",
  Leader: "bg-[#1E293B] text-white dark:bg-neutral-100 dark:text-neutral-900",
  "Sub Leader":
    "bg-slate-200 text-slate-700 dark:bg-neutral-700 dark:text-neutral-100",
  Member:
    "border border-slate-200 text-slate-500 dark:border-neutral-700 dark:text-neutral-400",
};

type SocialLink = { href: string; icon: IconType | LucideIcon; label: string };

function socialsFor(member: TeamMember): SocialLink[] {
  const links: (SocialLink | null)[] = [
    member.github
      ? {
          href: member.github,
          icon: FaGithub,
          label: `${member.name} on GitHub`,
        }
      : null,
    member.linkedin
      ? {
          href: member.linkedin,
          icon: FaLinkedin,
          label: `${member.name} on LinkedIn`,
        }
      : null,
    member.telegram
      ? {
          href: member.telegram,
          icon: FaTelegram,
          label: `${member.name} on Telegram`,
        }
      : null,
    member.email
      ? {
          href: `mailto:${member.email}`,
          icon: Mail,
          label: `Email ${member.name}`,
        }
      : null,
  ];

  return links.filter((link): link is SocialLink => link !== null);
}

function MemberCard({
  member,
  inView,
  delay,
}: {
  member: TeamMember;
  inView: boolean;
  delay: number;
}) {
  const ink = useInk();
  const socials = socialsFor(member);
  const chip = ROLE_CHIP[member.badge ?? "Member"] ?? ROLE_CHIP.Member;

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, delay, ease: EASE_OUT }}
      className={`group flex h-full w-full flex-col overflow-hidden ${CARD} ${CARD_HOVER}`}
    >
      <div className="relative aspect-4/5 overflow-hidden bg-slate-100 dark:bg-neutral-800">
        <Image
          src={member.image}
          alt={member.name}
          quality={100}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Scrim exists to keep the role legible over whatever is behind it,
            not for decoration — so it only covers the strip that carries it. */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-slate-950/70 to-transparent" />

        <span className="absolute bottom-3 left-3 rounded-lg bg-white/95 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 backdrop-blur-sm dark:bg-neutral-900/90 dark:text-neutral-200">
          {member.subRole ?? "Full Stack"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <h4
            className="min-w-0 flex-1 truncate text-base font-bold tracking-tight"
            style={{ color: ink }}
          >
            {member.name}
          </h4>

          <span
            className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold ${chip}`}
          >
            {member.badge ?? "Member"}
          </span>
        </div>

        {member.quote && (
          <p className="mt-2 line-clamp-2 text-sm italic leading-relaxed text-slate-500 dark:text-neutral-400">
            &ldquo;{member.quote.replace(/^["'“”]+|["'“”]+$/g, "")}&rdquo;
          </p>
        )}

        {socials.length > 0 && (
          <div className="mt-auto flex items-center gap-1.5 border-t border-slate-200 pt-4 dark:border-neutral-800">
            {socials.map((social) => {
              const Icon = social.icon;
              const isMail = social.href.startsWith("mailto:");

              return (
                <a
                  key={social.href}
                  href={social.href}
                  target={isMail ? undefined : "_blank"}
                  rel={isMail ? undefined : "noopener noreferrer"}
                  aria-label={social.label}
                  className="flex size-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500 transition-colors hover:bg-[#2563EB] hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-blue-500 dark:hover:text-white"
                >
                  <Icon className="size-3.5" aria-hidden />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </motion.article>
  );
}

function GroupLabel({ label, count }: { label: string; count: number }) {
  const ink = useInk();

  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-10 bg-slate-200 dark:bg-neutral-800 sm:w-16" />
      <span
        className="text-xs font-bold uppercase tracking-[0.22em]"
        style={{ color: ink }}
      >
        {label}
      </span>
      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-bold tabular-nums text-slate-500 dark:bg-neutral-800 dark:text-neutral-400">
        {String(count).padStart(2, "0")}
      </span>
      <span className="h-px w-10 bg-slate-200 dark:bg-neutral-800 sm:w-16" />
    </div>
  );
}

function TeamSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="team"
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-24 ${SECTION_RECESSED}`}
    >
      <SectionBackdrop seed={5} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        <SectionHeading
          kicker="Our team"
          title="Meet the people behind DevSolve"
          lede="Mentors and developers working together to build secure, scalable software — and to learn the craft while doing it."
          inView={inView}
        />

        {/* Mentors — a centred row, as before */}
        <div className="mt-12">
          <GroupLabel label="Mentors" count={SUPERVISORS.length} />

          <div className="mt-7 flex flex-wrap justify-center gap-5 sm:gap-6">
            {SUPERVISORS.map((mentor, i) => (
              <div key={mentor.name} className="w-56 sm:w-60 md:w-64">
                <MemberCard
                  member={mentor}
                  inView={inView}
                  delay={0.15 + i * 0.08}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Developers — the same three-up grid */}
        <div className="mt-16">
          <GroupLabel label="Developers" count={STUDENT_DEVELOPERS.length} />

          <div className="mt-7 grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {STUDENT_DEVELOPERS.map((member, i) => (
              <div
                key={member.name}
                className="w-full max-w-[300px] sm:max-w-[280px]"
              >
                <MemberCard
                  member={member}
                  inView={inView}
                  delay={0.2 + i * 0.06}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CONTACT
   ════════════════════════════════════════════════════════════════════ */

const CONTACT_DETAILS = [
  {
    icon: MapPin,
    title: "Address",
    lines: [
      "#40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh",
    ],
  },
  {
    icon: Mail,
    title: "Email us",
    lines: ["contact@devsolve.com"],
    href: "mailto:contact@devsolve.com",
  },
  {
    icon: Phone,
    title: "Support HQ",
    lines: ["(+855) 70-654-951", "(+855) 16-234-432"],
  },
] as const;

const SOCIAL_ACCOUNTS = [
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/",
    label: "DevSolve on Facebook",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/",
    label: "DevSolve on LinkedIn",
  },
  { icon: FaXTwitter, href: "https://x.com/", label: "DevSolve on X" },
];

const FIELD =
  "w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#2563EB] focus:ring-4 focus:ring-blue-500/15 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-blue-400";

const EMPTY_FORM = { name: "", email: "", subject: "", message: "" };

function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const ink = useInk();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSent(false);

    setTimeout(() => {
      setIsSubmitting(false);
      setSent(true);
      setFormData(EMPTY_FORM);
    }, 1000);
  };

  return (
    <section
      id="contact"
      ref={ref}
      className={`relative overflow-hidden py-20 sm:py-24 ${SECTION_LIFTED}`}
    >
      <SectionBackdrop seed={6} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        <SectionHeading
          kicker="Contact"
          title="Get in touch"
          lede="Questions about a program, the platform, or working with us? Send a message and the team replies within one business day."
          inView={inView}
        />

        <div className="mt-10 grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.55, delay: 0.15, ease: EASE_OUT }}
            className={`p-6 sm:p-8 lg:col-span-7 ${CARD}`}
          >
            <h3
              className="text-xl font-bold tracking-[-0.03em]"
              style={{ color: ink }}
            >
              Send us a message
            </h3>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                  >
                    Full name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Dim Pathea"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={FIELD}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                  >
                    Email address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="pathea.dim@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={FIELD}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="contact-subject"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                >
                  Subject
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="What is this about?"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className={FIELD}
                />
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-neutral-300"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  required
                  placeholder="Tell us a bit more…"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`${FIELD} resize-none`}
                />
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] px-7 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(37,99,235,0.85)] transition-[filter,transform] hover:brightness-110 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="size-4" aria-hidden />
                    </>
                  )}
                </button>

                {/* Replaces the native alert(): a status line the page owns,
                    announced rather than interrupting. */}
                {sent && (
                  <motion.p
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    role="status"
                    className="flex items-center gap-2 text-sm font-medium text-[#047857] dark:text-emerald-400"
                  >
                    <CheckCircle2 className="size-4" aria-hidden />
                    Thanks — we&rsquo;ll reply within one business day.
                  </motion.p>
                )}
              </div>
            </form>
          </motion.div>

          <div className="space-y-5 lg:col-span-5">
            {CONTACT_DETAILS.map((detail, i) => {
              const Icon = detail.icon;

              return (
                <motion.div
                  key={detail.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : undefined}
                  transition={{
                    duration: 0.5,
                    delay: 0.25 + i * 0.08,
                    ease: EASE_OUT,
                  }}
                  className={`flex items-start gap-4 p-5 ${CARD}`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-neutral-800">
                    <Icon
                      className="size-4.5 text-[#2563EB] dark:text-blue-400"
                      aria-hidden
                    />
                  </span>

                  <div className="min-w-0">
                    <h4
                      className="text-base font-bold tracking-tight"
                      style={{ color: ink }}
                    >
                      {detail.title}
                    </h4>

                    <div className="mt-1 flex flex-col gap-0.5 text-sm leading-relaxed text-slate-500 dark:text-neutral-400">
                      {detail.lines.map((line) => {
                        const href =
                          "href" in detail && detail.href
                            ? detail.href
                            : detail.title === "Support HQ"
                              ? `tel:${line.replace(/[^\d+]/g, "")}`
                              : null;

                        return href ? (
                          <a
                            key={line}
                            href={href}
                            className="transition-colors hover:text-[#2563EB] dark:hover:text-blue-400"
                          >
                            {line}
                          </a>
                        ) : (
                          <span key={line}>{line}</span>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.5, delay: 0.5, ease: EASE_OUT }}
              className={`p-5 ${CARD}`}
            >
              <h4
                className="text-base font-bold tracking-tight"
                style={{ color: ink }}
              >
                Connect with us
              </h4>

              <div className="mt-3 flex items-center gap-2.5">
                {SOCIAL_ACCOUNTS.map((account) => {
                  const Icon = account.icon;

                  return (
                    <a
                      key={account.label}
                      href={account.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={account.label}
                      className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-[#2563EB] hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-blue-500 dark:hover:text-white"
                    >
                      <Icon className="size-4" aria-hidden />
                    </a>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════ */

export default function AboutPage() {
  return (
    <div className="text-slate-900 selection:bg-blue-100 selection:text-blue-900 dark:text-neutral-100 dark:selection:bg-blue-500/30 dark:selection:text-blue-50">
      <AboutHero />
      <MissionVision />
      <Capabilities />
      <TechStack />
      <TeamSection />
      <ContactSection />
    </div>
  );
}
