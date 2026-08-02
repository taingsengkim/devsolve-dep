"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight, Users, CheckCircle2 } from "lucide-react";

const benefits = [
  "Earn bounties for every validated report",
  "Build a public reputation that gets you hired",
  "Access challenges designed by industry experts",
  "Join a global community of 2,400+ researchers",
  "Free to join — get started in minutes",
];

export function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden bg-slate-950">
      {/* Animated background glow blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-900/30 rounded-full blur-3xl" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cta-grid" width="48" height="48" patternUnits="userSpaceOnUse">
              <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#FFFFFF" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-grid)" />
        </svg>
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                <Users className="w-3.5 h-3.5" />
                Join the community
              </span>

              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Ready to join
                <br />
                <span className="text-blue-400">DevSolve</span> today?
              </h2>

              <p className="text-lg text-slate-400 leading-relaxed max-w-md">
                The best researchers, developers, and security professionals use DevSolve
                to grow, earn, and make an impact.
              </p>
            </div>

            {/* Benefits list */}
            <ul className="space-y-2.5">
              {benefits.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                  className="flex items-center gap-2.5 text-sm text-slate-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  {b}
                </motion.li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/account-type"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base px-7 py-3.5 rounded-full shadow-lg shadow-blue-500/30 transition-colors group"
                >
                  Get started free
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/programs"
                  className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-base px-7 py-3.5 rounded-full transition-colors group"
                >
                  Browse programs
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right decorative element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block relative"
          >
            {/* Central glowing card */}
            <div className="relative mx-auto w-80">
              {/* Glow ring */}
              <div className="absolute -inset-4 bg-blue-500/20 rounded-3xl blur-xl" />

              <div className="relative bg-slate-900 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-xs text-slate-500 font-mono">devsolve.platform</span>
                </div>

                {/* Fake terminal lines */}
                <div className="font-mono text-sm space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-emerald-400">$</span>
                    <span className="text-slate-300">devsolve login --sso</span>
                  </div>
                  <div className="text-slate-500 pl-4">→ Authenticating with Keycloak...</div>
                  <div className="text-emerald-400 pl-4">✓ Logged in as @0xShadow</div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-emerald-400">$</span>
                    <span className="text-slate-300">devsolve programs --list</span>
                  </div>
                  <div className="text-slate-500 pl-4">→ Fetching active programs...</div>
                  <div className="text-blue-400 pl-4">Found 150+ programs</div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-emerald-400">$</span>
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-slate-300"
                    >
                      █
                    </motion.span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 pt-2 border-t border-white/5">
                  {[
                    { v: "150+", l: "Programs" },
                    { v: "2.4k", l: "Members" },
                    { v: "$5M+", l: "Paid Out" },
                  ].map((s) => (
                    <div key={s.l} className="text-center">
                      <p className="text-base font-bold text-white">{s.v}</p>
                      <p className="text-xs text-slate-500">{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default CTABanner;
