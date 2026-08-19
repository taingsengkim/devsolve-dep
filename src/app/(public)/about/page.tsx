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
  Play,
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

import { Dialog, DialogContent } from "@/components/ui/dialog";
import SectionBackdrop, { useInk } from "@/components/landing/SectionBackdrop";
import { SystemArchitectureDiagram } from "@/components/public-about/SystemArchitectureDiagram";
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
  lede?: string;
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

      {lede && (
        <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-neutral-400">
          {lede}
        </p>
      )}
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
  return (
    <section className="relative -mt-(--navbar-height) overflow-hidden bg-background pt-(--navbar-height)">
      <div className="relative mx-auto max-w-7xl px-6 pt-12 sm:px-12 sm:pt-16 lg:px-16">
        {/* ─── Top Header: Editorial Split Layout ─── */}
        <div className="grid grid-cols-1 items-start justify-between gap-8 pb-8 sm:pb-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Kicker + Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="lg:col-span-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
              ABOUT DEVSOLVE
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
              The team that turns
              <br />
              findings into fixes
              <span className={BRAND_INK}>.</span>
            </h1>
          </motion.div>

          {/* Right Column: Paragraph + CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
            className="flex flex-col items-start justify-between gap-6 pt-1 lg:col-span-5"
          >
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              DevSolve connects organizations with security researchers and developers to solve real technical problems, close vulnerabilities responsibly, and build software that holds up in production.
            </p>

            <Link
              href="/programs"
              className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-xs font-semibold text-background shadow-xs transition-all hover:opacity-90 active:scale-98"
            >
              Explore programs
            </Link>
          </motion.div>
        </div>

        {/* ─── Hero Image Container: Framed Inside Max-Width Bounds ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: EASE_OUT }}
          className="relative pb-16 sm:pb-24"
        >
          <div className="relative aspect-16/10 sm:aspect-video lg:aspect-21/10 w-full overflow-hidden rounded-2xl sm:rounded-3xl bg-muted shadow-xl ring-1 ring-foreground/10">
            <Image
              src="/teams/team.jpg"
              alt="The DevSolve engineering and security team"
              fill
              priority
              quality={95}
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover object-top sm:object-center"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}





/* ════════════════════════════════════════════════════════════════════
   TECH STACK & SYSTEM ARCHITECTURE
   ════════════════════════════════════════════════════════════════════ */

function TechStack() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      ref={ref}
      className={`relative overflow-hidden py-16 sm:py-24 ${SECTION_LIFTED}`}
    >
      <SectionBackdrop seed={4} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="w-full"
        >
          <SystemArchitectureDiagram />
        </motion.div>
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
      className={`group flex h-full w-full flex-col overflow-hidden rounded-3xl ${CARD} ${CARD_HOVER}`}
    >
      <div className="relative aspect-6/7 overflow-hidden bg-slate-100 dark:bg-neutral-800">
        <Image
          src={member.image}
          alt={member.name}
          quality={100}
          fill
          className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Scrim */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-slate-950/75 to-transparent" />

        <span className="absolute bottom-3.5 left-3.5 rounded-xl bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-700 backdrop-blur-md shadow-sm dark:bg-neutral-900/90 dark:text-neutral-200">
          {member.subRole ?? "Full Stack"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <h4
            className="min-w-0 flex-1 truncate text-lg font-bold tracking-tight sm:text-xl"
            style={{ color: ink }}
          >
            {member.name}
          </h4>

          <span
            className={`shrink-0 rounded-xl px-2.5 py-1 text-xs font-bold ${chip}`}
          >
            {member.badge ?? "Member"}
          </span>
        </div>

        {member.quote && (
          <p className="mt-3 line-clamp-2 text-sm italic leading-relaxed text-slate-500 dark:text-neutral-400">
            &ldquo;{member.quote.replace(/^["'“”]+|["'“”]+$/g, "")}&rdquo;
          </p>
        )}

        {socials.length > 0 && (
          <div className="mt-auto flex items-center gap-2 border-t border-slate-200 pt-5 dark:border-neutral-800">
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
                  className="flex size-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors hover:bg-[#2563EB] hover:text-white dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-blue-500 dark:hover:text-white"
                >
                  <Icon className="size-4" aria-hidden />
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
          inView={inView}
        />

        {/* Mentors */}
        <div className="mt-14">
          <GroupLabel label="Mentors" count={SUPERVISORS.length} />

          <div className="mt-8 flex flex-wrap justify-center gap-8 sm:gap-10">
            {SUPERVISORS.map((mentor, i) => (
              <div key={mentor.name} className="w-full max-w-85 sm:max-w-90 lg:max-w-95">
                <MemberCard
                  member={mentor}
                  inView={inView}
                  delay={0.15 + i * 0.08}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Developers */}
        <div className="mt-20">
          <GroupLabel label="Developers" count={STUDENT_DEVELOPERS.length} />

          <div className="mt-8 grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-3">
            {STUDENT_DEVELOPERS.map((member, i) => (
              <div
                key={member.name}
                className="w-full max-w-85 sm:max-w-90 lg:max-w-95"
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
      <TechStack />
      <TeamSection />
      <ContactSection />
    </div>
  );
}
