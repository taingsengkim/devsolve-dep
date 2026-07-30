"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Code2,
  ShieldCheck,
  Trophy,
  UsersRound,
} from "lucide-react";
import { useTheme } from "next-themes";

import { FireworksBackground } from "@/components/animate-ui/components/backgrounds/fireworks";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

const HERO_FEATURES = [
  {
    title: "Secure",
    description: "Find vulnerabilities and improve security",
    icon: ShieldCheck,
    position: "left-6 top-10 sm:left-8",
    iconClassName: "text-blue-600",
  },
  {
    title: "Collaborate",
    description: "Share knowledge and help others",
    icon: UsersRound,
    position: "left-0 top-48 sm:left-2 sm:top-56",
    iconClassName: "text-blue-600",
  },
  {
    title: "Solve",
    description: "Ask questions and find solutions",
    icon: Code2,
    position: "right-4 top-12 sm:right-8",
    iconClassName: "text-blue-600",
  },
  {
    title: "Showcase",
    description: "Show your work and build reputation",
    icon: Trophy,
    position: "right-0 top-52 sm:right-8 sm:top-64",
    iconClassName: "text-violet-600",
  },
] as const;

export function PublicAboutHero() {
  const { resolvedTheme } = useTheme();

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.08),transparent_26%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.12),transparent_24%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_62%)] lg:block dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.12),transparent_58%)]" />

      <div className="relative mx-auto grid max-w-[1280px] gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.94fr_1.06fr] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-2xl">
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-400/25 dark:bg-blue-500/12 dark:text-blue-200"
          >
            About DevSolve
          </Badge>

          <h1 className="mt-8 text-5xl font-bold tracking-[-0.06em] text-slate-900 dark:text-white sm:text-6xl lg:text-7xl">
            Secure Today.
            <span className="mt-2 block text-blue-600">Build Tomorrow.</span>
          </h1>

          <div className="mt-7 h-1 w-16 rounded-full bg-blue-600" />

          <p className="mt-6 max-w-xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            DevSolve is a unified platform that combines bug bounty programs with a
            developer community. We empower organizations to secure their systems and
            developers to learn, share, and grow together.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/program"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.20)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Explore Programs
            </Link>
            <Link
              href="/#community"
              className="inline-flex h-11 items-center rounded-xl border border-blue-300 bg-white px-5 text-sm font-semibold text-blue-700 transition-colors duration-200 hover:border-blue-400 hover:bg-blue-50 dark:border-blue-400/25 dark:bg-slate-900/70 dark:text-blue-200 dark:hover:border-blue-400/40 dark:hover:bg-blue-500/10"
            >
              Join Community
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[700px]">
          <div className="absolute inset-x-14 top-8 h-[460px] rounded-full border border-blue-100/80 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),rgba(255,255,255,0)_68%)] dark:border-blue-400/10 dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.14),rgba(2,6,23,0)_70%)]" />
          <div className="pointer-events-none absolute right-0 top-8 hidden h-24 w-24 bg-[radial-gradient(circle,rgba(37,99,235,0.22)_1.5px,transparent_1.5px)] bg-[length:16px_16px] opacity-50 lg:block" />

          <div className="relative min-h-[520px]">
            <div className="pointer-events-none absolute inset-x-10 top-0 z-0 h-[460px] overflow-hidden rounded-[40px] opacity-55">
              <FireworksBackground
                population={20}
                color={resolvedTheme === "dark" ? "white" : "#2563eb"}
                className="absolute inset-0"
              />
            </div>

            {HERO_FEATURES.map((feature, index) => {
              const Icon = feature.icon;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, delay: 0.08 * index }}
                  className={`absolute z-10 hidden w-[160px] rounded-[28px] border border-slate-200 bg-white p-5 text-center shadow-[0_18px_40px_rgba(15,23,42,0.08)] lg:block dark:border-white/10 dark:bg-slate-900 ${feature.position}`}
                >
                  <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800">
                    <Icon className={`size-6 ${feature.iconClassName}`} />
                  </div>
                  <p className="mt-4 text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                    {feature.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}

            <div className="absolute inset-x-0 top-10 flex justify-center">
              <div className="relative flex h-[380px] w-[380px] items-end justify-center rounded-full border border-blue-100/70 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.10),rgba(255,255,255,0)_65%)] dark:border-blue-400/10 dark:bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.16),rgba(2,6,23,0)_66%)]">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.38, ease: "easeOut" }}
                  className="relative z-10 mb-12"
                >
                  <Image
                    src="/logo_devsolve-removebg.png"
                    alt="DevSolve logo"
                    width={260}
                    height={260}
                    className="h-auto w-[260px] object-contain drop-shadow-[0_28px_48px_rgba(15,23,42,0.16)]"
                    priority
                  />
                </motion.div>

                <div className="absolute bottom-0 h-[86px] w-[380px] rounded-[999px] border border-blue-100 bg-white shadow-[0_24px_48px_rgba(37,99,235,0.12)] dark:border-blue-400/10 dark:bg-slate-900" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
