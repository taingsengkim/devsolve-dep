"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { Bug, ExternalLink, Shield, Globe, Cpu, Zap } from "lucide-react";

/* ─── Sample programs ──────────────────────────────────────────────── */
const programs = [
  {
    name: "Phantom Finance",
    scope: "Web • API • Mobile",
    reward: "$500 – $20,000",
    status: "Active",
    severity: "Critical",
    reports: 48,
    icon: Shield,
    color: "from-blue-600 to-indigo-700",
    bg: "bg-blue-50",
    borderHover: "hover:border-blue-300",
    glowColor: "shadow-blue-500/15",
    tag: "Fintech",
  },
  {
    name: "Buildflow Cloud",
    scope: "Web • Infrastructure",
    reward: "$250 – $10,000",
    status: "Active",
    severity: "High",
    reports: 31,
    icon: Globe,
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50",
    borderHover: "hover:border-emerald-300",
    glowColor: "shadow-emerald-500/15",
    tag: "Cloud",
  },
  {
    name: "Nexus AI",
    scope: "API • Web • LLM",
    reward: "$1,000 – $50,000",
    status: "Active",
    severity: "Critical",
    reports: 72,
    icon: Cpu,
    color: "from-purple-600 to-violet-700",
    bg: "bg-purple-50",
    borderHover: "hover:border-purple-300",
    glowColor: "shadow-purple-500/15",
    tag: "AI/ML",
  },
  {
    name: "DevOps Matrix",
    scope: "CI/CD • Containers",
    reward: "$300 – $8,000",
    status: "Active",
    severity: "Medium",
    reports: 19,
    icon: Zap,
    color: "from-orange-500 to-red-500",
    bg: "bg-orange-50",
    borderHover: "hover:border-orange-300",
    glowColor: "shadow-orange-500/15",
    tag: "DevOps",
  },
];

const SEVERITY_COLORS: Record<string, string> = {
  Critical: "bg-red-50 text-red-700 border-red-200",
  High: "bg-orange-50 text-orange-700 border-orange-200",
  Medium: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

/* ─── Single program card ──────────────────────────────────────────── */
function ProgramCard({
  program,
  index,
}: {
  program: (typeof programs)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const Icon = program.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      className="flex-shrink-0 w-72 sm:w-auto"
    >
      <div
        className={`group bg-white rounded-2xl border border-slate-200 ${program.borderHover} p-5 h-full flex flex-col gap-4 cursor-default transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 ${program.glowColor}`}
      >
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${program.color} flex items-center justify-center shadow-sm flex-shrink-0`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 truncate">{program.name}</h3>
              <span className="text-xs font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {program.tag}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{program.scope}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100" />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Reward</p>
            <p className="text-sm font-bold text-slate-800">{program.reward}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs text-slate-400 uppercase tracking-wide">Reports</p>
            <p className="text-sm font-bold text-slate-800 flex items-center gap-1">
              <Bug className="w-3.5 h-3.5 text-slate-400" />
              {program.reports}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-emerald-600 font-semibold">{program.status}</span>
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${SEVERITY_COLORS[program.severity]}`}>
            {program.severity}
          </span>
        </div>

        {/* CTA on hover */}
        <Link
          href="/programs"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 group/btn"
        >
          View Program
          <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </Link>
      </div>
    </motion.div>
  );
}

/* ─── Main component ───────────────────────────────────────────────── */
export function BountyPreview() {
  const headerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(headerRef, { once: true, margin: "-60px" });

  return (
    <section className="py-24 bg-[#FAF9F5] overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div className="space-y-3">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
              Bounty Programs
            </span>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
              Active Bug Bounty Programs
            </h2>
            <p className="text-base text-slate-500 max-w-lg">
              Find programs that match your skills. From web apps to AI systems — high-impact
              targets with competitive rewards.
            </p>
          </div>

          <Link
            href="/programs"
            className="inline-flex items-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-full shadow-sm transition-colors whitespace-nowrap shrink-0"
          >
            All programs
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {programs.map((p, i) => (
            <ProgramCard key={p.name} program={p} index={i} />
          ))}
        </div>

        {/* Bottom banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="mt-10 bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Bug className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-base">Are you a company?</p>
              <p className="text-slate-400 text-sm">Launch your own bug bounty program on DevSolve.</p>
            </div>
          </div>
          <Link
            href="/account-type"
            className="shrink-0 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md shadow-blue-500/25 transition-colors"
          >
            Launch a program
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default BountyPreview;
