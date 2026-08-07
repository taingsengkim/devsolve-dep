"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { KeyRound, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useKeycloakLogin } from "@/hooks/useKeycloakLogin";
import { USER_FEATURES, COMPANY_FEATURES } from "@/lib/constants/auth";
import { AccountTypeCard } from "@/components/account-type/AccountTypeCard";
import {
  OrganizationArt,
  ResearcherArt,
} from "@/components/account-type/AccountTypeArt";
import SectionBackdrop from "@/components/landing/SectionBackdrop";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

/* Claims below are drawn from what the platform actually does — PKCE is on the
   Keycloak client, and organizations really do sit in review before going live. */
const ASSURANCES = [
  { icon: KeyRound, text: "PKCE-secured sign-in through Keycloak" },
  { icon: ShieldCheck, text: "Coordinated disclosure by default" },
  { icon: Sparkles, text: "Free to join, no card required" },
];

export default function AccountTypeSelectionPage() {
  const { isLoggingIn, handleLogin } = useKeycloakLogin();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Same backdrop system as the landing page */}
      {/* Pinned light: no dark styling on this page yet, so a theme-following
          backdrop would draw white gridlines on a white surface. */}
      <SectionBackdrop tone="light" seed={6} gridSize={80} />

      {/* ── Top bar ── */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full border-b border-slate-200/70"
      >
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-[#1E293B] transition-opacity hover:opacity-70"
          >
            <Image
              src="/logo-1.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
              priority
            />
            DevSolve
          </Link>

          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span className="hidden sm:inline">Already have an account?</span>
            <button
              type="button"
              onClick={() => handleLogin("/")}
              disabled={isLoggingIn}
              className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-semibold text-blue-700 transition-colors hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Connecting…
                </>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* ── Main ── */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-4 flex items-center justify-center gap-2.5">
            <span className="h-px w-8 bg-blue-600" />
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              Step 1 of 2
            </span>
            <span className="h-px w-8 bg-blue-600" />
          </div>

          <h1 className="text-3xl font-bold leading-[1.08] tracking-[-0.04em] text-[#1E293B] sm:text-4xl lg:text-5xl">
            How will you use DevSolve
            <span className="text-blue-600">?</span>
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-slate-500">
            Pick the account that matches your work. It decides what you sign up
            with and what your dashboard opens on.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-10 grid w-full max-w-4xl grid-cols-1 items-stretch gap-5 sm:mt-12 md:grid-cols-2 md:gap-6"
        >
          <AccountTypeCard
            eyebrow="For builders"
            title="Developer & Researcher"
            description="One account for all of it — chase bounties, ask the questions you're stuck on, answer the ones you've solved, and let the record speak for you."
            art={<ResearcherArt />}
            features={USER_FEATURES}
            ctaLabel="Continue as developer"
            href="/register/user"
            note="Browse programs and discussions the moment you sign up."
            accent="blue"
            variants={cardVariants}
          />

          <AccountTypeCard
            eyebrow="For companies"
            title="Organization"
            description="Run your own bounty programs, triage what comes in, and keep the whole security workflow in one place."
            art={<OrganizationArt />}
            features={COMPANY_FEATURES}
            ctaLabel="Continue as organization"
            href="/register/company"
            note="Organizations go through a short verification review before programs go live."
            accent="emerald"
            variants={cardVariants}
          />
        </motion.div>

        {/* ── Assurances ── */}
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-sm text-slate-500"
        >
          {ASSURANCES.map((item) => (
            <li key={item.text} className="flex items-center gap-2">
              <item.icon className="h-4 w-4 text-slate-400" aria-hidden />
              {item.text}
            </li>
          ))}
        </motion.ul>
      </main>
    </div>
  );
}
