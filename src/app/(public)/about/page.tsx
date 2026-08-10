
"use client";

import { useState, useRef, useEffect } from "react";
import { Layers } from "lucide-react";
import Image from "next/image";
import { motion } from "motion/react";
import { FaGithub, FaLinkedin, FaTelegram, FaGlobe } from "react-icons/fa6";
import { FaFacebook, FaTwitter } from "react-icons/fa";
import Link from "next/link";

import {
  ArrowRight,
  Trophy,
  Code,
  MessageSquare,
  Lock,
  Bug,
  Ribbon,
  Mail,
  GraduationCap,
  Send,
  Play,
  Phone,
  X,
  Star,
  MapPin,
  ChevronDown,
  ShieldCheck,
  Award,
  TrendingUp,
  Target,
  CheckCircle2,
} from "lucide-react";

import {
  SUPERVISORS,
  STUDENT_DEVELOPERS,
  TECHNOLOGIES,
  OFFERINGS,
} from "@/lib/types/about/mock-data";
import { TeamMember, Technology } from "@/lib/types/about/type";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 text-gray-900 font-sans antialiased">
      <AboutHeroSection />
      <DevSolveOverview />
      <TechStackSection />
      <TeamSection />
      <ContactSection />
    </div>
  );
}

function AboutHeroSection() {
  const gridNodes = [
    { left: "10%", top: "15%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 0, duration: 6 },
    { left: "25%", top: "8%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 1, duration: 8 },
    { left: "42%", top: "18%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.5, duration: 7 },
    { left: "60%", top: "12%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.5, duration: 9 },
    { left: "78%", top: "22%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 2, duration: 6.5 },
    { left: "90%", top: "10%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.2, duration: 7.5 },
    { left: "5%", top: "45%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.2, duration: 8 },
    { left: "20%", top: "38%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.4, duration: 6.5 },
    { left: "35%", top: "52%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 1.8, duration: 7 },
    { left: "50%", top: "40%", size: "w-3.5 h-3.5 sm:w-4 sm:h-4", delay: 0.8, duration: 8.5 },
    { left: "68%", top: "48%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 2.2, duration: 6 },
    { left: "85%", top: "42%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.1, duration: 7.2 },
    { left: "12%", top: "75%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 0.3, duration: 7 },
    { left: "28%", top: "82%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.6, duration: 8.2 },
    { left: "45%", top: "70%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 0.9, duration: 6.8 },
    { left: "62%", top: "78%", size: "w-4 h-4 sm:w-5 sm:h-5", delay: 2.1, duration: 7.8 },
    { left: "80%", top: "72%", size: "w-3 h-3 sm:w-4 sm:h-4", delay: 1.4, duration: 6.3 },
    { left: "92%", top: "85%", size: "w-2.5 h-2.5 sm:w-3 sm:h-3", delay: 0.7, duration: 8.8 },
  ];

  return (
    <div className="relative w-full bg-slate-50 dark:bg-[#080E17] text-slate-900 dark:text-white transition-colors duration-300 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60 dark:opacity-40">
        <svg
          className="absolute inset-0 w-full h-full text-cyan-500/20 dark:text-cyan-400/15"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern id="grid-pattern" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="currentColor" strokeWidth="0.75" strokeDasharray="3 3" />
            </pattern>
          </defs>
          <path d="M-100,100 Q 500,-50 1300,100" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,250 Q 500,50 1300,250" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,400 Q 500,180 1300,400" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,550 Q 500,320 1300,550" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M-100,700 Q 500,460 1300,700" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M100,-50 L 200,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M300,-50 L 380,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M500,-50 L 540,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M700,-50 L 710,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M900,-50 L 880,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
          <path d="M1100,-50 L 1050,900" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
        </svg>

        {gridNodes.map((node, index) => (
          <motion.div
            key={index}
            style={{ left: node.left, top: node.top }}
            animate={{
              y: [0, -12, 0, 12, 0],
              x: [0, 8, 0, -8, 0],
              scale: [1, 1.25, 1, 0.9, 1],
              opacity: [0.6, 1, 0.6, 0.8, 0.6],
            }}
            transition={{
              duration: node.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.delay,
            }}
            className={`absolute ${node.size} rounded-full bg-gradient-to-br from-cyan-300 via-[#00D2B4] to-teal-600 shadow-[0_0_12px_rgba(0,210,180,0.8)] border border-white/60 dark:border-cyan-200/50 z-0`}
          />
        ))}
      </div>

      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-[#00D2B4]/15 dark:bg-[#00D2B4]/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-[160px] pointer-events-none" />

      {/* HERO - reduced padding */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-18 lg:pt-16 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-6 space-y-5 lg:space-y-6 z-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00D2B4]/10 border border-[#00D2B4]/30 text-[#00a890] dark:text-[#00D2B4] text-xs sm:text-sm font-medium tracking-wide">
              <span>The next-gen security platform</span>
              <span className="text-[#00D2B4]/60">•</span>
              <span className="font-semibold text-slate-900 dark:text-white">Est. 2026</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
              We Are <br />
              <span className="text-[#00a890] dark:text-[#00D2B4] relative inline-block">
                Next-Gen
                <svg
                  className="absolute -bottom-2 left-0 w-full text-[#00a890]/30 dark:text-[#00D2B4]/40"
                  height="10"
                  viewBox="0 0 200 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 8C50 2 150 2 198 8"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              Security <br /> Platform
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              DevSolve connects organizations with top security researchers and developers to solve real-world technical challenges, fix vulnerabilities, and build resilient software.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                href="/programs"
                className="inline-flex items-center gap-2.5 px-7 py-4 rounded-full bg-blue-600 hover:bg-slate-800 dark:bg-[#00D2B4] dark:hover:bg-[#00c0a5] text-white dark:text-slate-950 font-bold text-sm sm:text-base transition-all duration-300 shadow-lg shadow-slate-900/10 dark:shadow-[#00D2B4]/25 hover:shadow-xl hover:scale-105"
              >
                <span>Explore Programs</span>
                <ArrowRight className="w-4 h-4 text-[#00D2B4] dark:text-slate-950" />
              </Link>

              <button
                type="button"
                className="inline-flex items-center gap-3 px-5 py-4 rounded-full text-slate-700 dark:text-white hover:text-[#00a890] dark:hover:text-[#00D2B4] font-semibold text-sm sm:text-base transition-colors duration-200 group"
              >
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 shadow-sm flex items-center justify-center text-[#00a890] dark:text-[#00D2B4] group-hover:scale-110 group-hover:border-[#00D2B4]/50 transition-all">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            <div className="flex items-center gap-4 pt-3 border-t border-slate-200 dark:border-slate-800/80 max-w-md">
              <div className="flex -space-x-2.5 overflow-hidden">
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
                <div className="inline-block h-10 w-10 rounded-full ring-2 ring-slate-50 dark:ring-[#080E17] bg-slate-200 dark:bg-slate-700 overflow-hidden relative">
                  <Image src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User" fill className="object-cover" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-500 dark:fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Join <span className="text-slate-900 dark:text-white font-semibold">2,500+</span> vetted security researchers
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-6 relative flex items-center justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-[750px] h-[500px] sm:h-[580px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-900/60 z-10">
              <Image
                src="/teams/team.jpg"
                alt="DevSolve Engineering & Security Team"
                fill
                priority
                className="object-cover object-top"
                sizes="(max-width: 1280px) 100vw, 600px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 dark:from-[#080E17]/80 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

const ICON_MAP = {
  Bug,
  Code,
  MessageSquare,
  Trophy,
  Ribbon,
  Lock,
};

const MISSION_FEATURES = [
  "Responsible vulnerability disclosure",
  "Fair rewards for meaningful findings",
  "Hands-on learning through real challenges",
  "Collaboration between researchers and orgs",
];

const VISION_FEATURES = [
  "Global, trusted community of security professionals",
  "Recognition and growth for top talent",
  "Improved resilience across the internet",
];

function OfferSection() {
  return (
    <section className="bg-slate-50/50 py-16 md:py-24 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">
            Everything in One Place
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto mt-3 leading-relaxed">
            DevSolve integrates the complete challenge lifecycle — from program creation to reward payout — in a single, cohesive, secure platform.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFERINGS.map((item, index) => {
            const Icon = ICON_MAP[item.iconName as keyof typeof ICON_MAP] || Bug;
            return (
              <div
                key={index}
                className={`bg-white rounded-3xl p-7 border ${item.borderColor} shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between`}
              >
                <div>
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.accentBg} ${item.accentText} flex items-center justify-center mb-6`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function DevSolveOverview() {
  return (
    <section className="bg-slate-50/50 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        {/* Section 1: What Drives DevSolve */}
        <div>
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              What Drives DevSolve
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                <Target className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Our Mission
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 mb-3">
                Responsible Disclosure & Continuous Learning
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                To empower ethical hackers to identify and report vulnerabilities
                responsibly, reward meaningful contributions, and cultivate a culture
                of continuous learning through real-world security challenges that make
                the digital ecosystem safer for everyone.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Structured, secure vulnerability reporting",
                  "Transparent evaluation & merit-based rewards",
                  "Anti-cheating and plagiarism prevention",
                  "Innovation through real-world challenges",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mr-3 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <FaGlobe className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Our Vision
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 mb-3">
                A Trusted Global Cybersecurity Community
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                To become the world's most trusted bridge between organizations and
                ethical hackers — an ecosystem where cybersecurity awareness grows,
                talent is recognized globally, and the internet becomes more resilient
                through collective effort.
              </p>
              <ul className="space-y-2.5">
                {[
                  "Globally trusted platform for all stakeholders",
                  "Active, security-first collaborative community",
                  "Scalable infrastructure for enterprise bounties",
                  "Cybersecurity education through practice",
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-700">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mr-3 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Section 2: Everything in One Place */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Everything in One Place
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              DevSolve integrates the complete challenge lifecycle — from program creation to reward payout — in a single, cohesive, secure platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl p-6 border-2 border-red-200 shadow-sm hover:shadow-md hover:border-red-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
                <Bug className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Bug Bounty Programs
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Organizations publish scoped programs with Markdown descriptions. Hackers find, document, and report vulnerabilities through a structured, secure workflow.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-blue-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Code className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Technical Challenges
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                A rich library of coding and security challenges with defined evaluation criteria, secure file submission, and confidential judging for complete fairness.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Discussion Forum
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                An integrated community forum to exchange ideas, ask technical questions, share write-ups, and collaborate beyond individual challenge submissions.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mb-4">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Global Leaderboards
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Real-time leaderboards ranking hackers by points, reputation, and outcomes. Outstanding contributors earn global recognition and premium badge tiers.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Reward System
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Structured reward policies with milestone bonuses, badge tiers, and monetary payouts tied directly to accepted vulnerability reports and challenge solutions.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 border-2 border-sky-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all">
              <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-1.5">
                Secure Authentication
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Enterprise-grade auth, anti-cheating mechanisms, plagiarism prevention, and duplicate submission protection keep the platform trustworthy and fair.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


interface TechStackSectionProps {
  technologies?: Technology[];
}

export function TechStackSection({
  technologies = TECHNOLOGIES,
}: TechStackSectionProps) {
  return (
    <section className="bg-slate-50/60 py-10 sm:py-14 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs sm:text-sm font-semibold mb-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Tech Stack
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Built with Modern Technologies
        </h2>
        <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto mt-2 leading-relaxed">
          An end-to-end architecture designed for security, performance, and seamless integration.
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
        {(technologies || []).map((tech, index) => (
          <div
            key={tech.name || index}
            className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-slate-100/80 group-hover:bg-emerald-50 flex items-center justify-center mb-4 transition-colors duration-300 p-2.5 relative">
              <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-110">
                <Image
                  src={tech.image}
                  alt={`${tech.name} logo`}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-1.5 group-hover:text-emerald-600 transition-colors">
              {tech.name}
            </h3>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {tech.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-14">
      <div className="text-center mb-6 sm:mb-8 md:mb-10">
        <span className="text-blue-600 uppercase tracking-[0.2em] sm:tracking-[0.3em] text-xs sm:text-sm font-semibold">
          OUR TEAM
        </span>

        <h2 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
          Meet the People Behind DevSolve
        </h2>

        <p className="mt-2 sm:mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto px-4">
          Our mentors and developers work together to build secure,
          innovative, and scalable software solutions.
        </p>
      </div>

      <div className="mb-10 sm:mb-12">
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-5 text-pink-400">
          Mentors
        </h3>

        <div className="flex flex-wrap justify-center gap-4 sm:gap-5 md:gap-6">
          {SUPERVISORS.map((mentor) => (
            <div key={mentor.name} className="w-48 sm:w-56 md:w-64">
              <MemberCard member={mentor} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl sm:text-2xl font-semibold text-center mb-4 sm:mb-5 text-blue-500">
          Developers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 justify-items-center">
          {STUDENT_DEVELOPERS.map((member) => (
            <div key={member.name} className="w-full max-w-[300px] sm:max-w-[260px] lg:max-w-[280px]">
              <MemberCard member={member} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface MemberCardProps {
  member: TeamMember;
}

export function MemberCard({ member }: MemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group w-full"
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl sm:rounded-2xl bg-gray-100 shadow-sm border border-gray-200 transition-all duration-300 group-hover:shadow-xl group-hover:shadow-blue-500/10">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        <div className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-3 sm:bottom-4 left-2 sm:left-3">
          <span className="px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-black/60 backdrop-blur-md text-white text-[8px] sm:text-[10px] md:text-[11px] font-bold tracking-wider border border-white/10 truncate max-w-[100px] sm:max-w-[130px] md:max-w-[150px] block">
            {member.subRole?.toUpperCase() || "FULL STACK"}
          </span>
        </div>

        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex gap-1 sm:gap-1.5">
          {member.github && (
            <a
              href={member.github}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaGithub size={10} className="sm:text-xs md:text-sm" />
            </a>
          )}

          {member.linkedin && (
            <a
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaLinkedin size={10} className="sm:text-xs md:text-sm" />
            </a>
          )}

          {member.telegram && (
            <a
              href={member.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-110 hover:bg-black transition duration-200"
            >
              <FaTelegram size={10} className="sm:text-xs md:text-sm" />
            </a>
          )}
        </div>
      </div>

      <div className="mt-2.5 sm:mt-3 md:mt-4 px-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-1 md:gap-2">
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 truncate">
            {member.name}
          </h3>

          <span className="text-[7px] sm:text-[8px] md:text-[10px] px-1.5 sm:px-2 md:px-3 py-0.5 sm:py-1 rounded-full border border-blue-200 text-blue-600 font-semibold bg-blue-50 self-start sm:self-center whitespace-nowrap">
            {member.badge || "MEMBER"}
          </span>
        </div>

        {member.quote && (
          <p className="mt-1 sm:mt-1.5 md:mt-2 text-[10px] sm:text-xs md:text-sm italic text-gray-500 leading-relaxed line-clamp-2">
            "{member.quote.replace(/['"]+/g, "")}"
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ============================================================
// CONTACT SECTION - COMPACT SPACING
// ============================================================
function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      console.log("Form Submitted:", formData);
      alert(
        "Thank you for reaching out! Our team will respond within 24 business hours."
      );
      setIsSubmitting(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1000);
  };

  return (
    <section id="contact" className="py-14 sm:py-16 lg:py-20 bg-[#FFFFFF] text-[#0F172A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-[36px] sm:text-[40px] font-bold text-[#0F172A] tracking-tight leading-tight">
            Get In Touch
          </h2>
          <p className="mt-2.5 text-base text-[#64748B] max-w-2xl mx-auto">
            Have questions about DevSolve or cybersecurity services? Send us a
            message and our team will respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="lg:col-span-7 bg-[#FFFFFF] rounded-3xl border border-[#CBD5E1] p-6 sm:p-8 shadow-xl">
            <h3 className="text-xl sm:text-[22px] font-bold text-[#1E2B45] mb-5">
              Send Us a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1E2B45]">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Dim Pathea"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-2.5 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#1E2B45]">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="pathea.dim@gmail.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-2.5 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#1E2B45]">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter the subject of your message..."
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-2.5 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-[#1E2B45]">
                  Message
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write more about your project..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#CBD5E1] bg-[#FFFFFF] px-4 py-2.5 text-base text-[#0F172A] placeholder:text-[#64748B] transition focus:border-[#2B68F6] focus:ring-4 focus:ring-blue-100 outline-none resize-none"
                />
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2B68F6] px-8 py-3 text-base font-semibold text-white transition-all hover:bg-blue-600 hover:-translate-y-1 shadow-lg shadow-blue-500/20 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] p-5 shadow-sm flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2B68F6]/10 text-[#2B68F6]">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-[18px] font-bold text-[#1E2B45] mb-0.5">
                  Address
                </h4>
                <p className="text-sm text-[#64748B] leading-relaxed">
                  #40, Street 273, Sangkat Boeung Kak Ti Mouy, Khan Toul Kork, Phnom Penh
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] p-5 shadow-sm flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/10 text-[#10B981]">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-[18px] font-bold text-[#1E2B45] mb-0.5">
                  Email Us
                </h4>
                <p className="text-sm text-[#64748B]">
                  contact@devsolve.com
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#CBD5E1] bg-white p-5 shadow-xs flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#2B68F6]/10 text-[#2B68F6]">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base sm:text-[18px] font-bold text-[#1E2B45] mb-0.5">
                  Support HQ
                </h4>
                <div className="text-sm text-[#64748B] space-y-0.5 flex flex-col">
                  <a
                    href="tel:096453972"
                    className="hover:text-[#2B68F6] transition-colors"
                  >
                    (+855) 70-654-951
                  </a>
                  <a
                    href="tel:16234432"
                    className="hover:text-[#2B68F6] transition-colors"
                  >
                    (+855) 16-234-432
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#CBD5E1] bg-[#FFFFFF] p-5 shadow-sm">
              <h4 className="text-base sm:text-[18px] font-bold text-[#1E2B45] mb-3">
                Connect With Us
              </h4>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#FFFFFF] text-[#2B68F6] transition-all hover:bg-[#2B68F6] hover:text-white hover:border-[#2B68F6] shadow-sm"
                >
                  <FaFacebook className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://www.linkedin./"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#FFFFFF] text-[#2B68F6] transition-all hover:bg-[#2B68F6] hover:text-white hover:border-[#2B68F6] shadow-sm"
                >
                  <FaLinkedin className="w-4.5 h-4.5" />
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our X account"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#CBD5E1] bg-[#FFFFFF] text-[#2B68F6] transition-all hover:bg-[#2B68F6] hover:text-white hover:border-[#2B68F6] shadow-sm"
                >
                  <FaTwitter className="w-4.5 h-4.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}













