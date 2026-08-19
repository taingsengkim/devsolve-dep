"use client";

import React, { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import SectionBackdrop from "@/components/landing/SectionBackdrop";
import { SectionHeading } from "@/components/public-about/SectionHeading";
import { MemberCard, GroupLabel } from "@/components/public-about/MemberCard";
import { SystemArchitectureDiagram } from "@/components/public-about/SystemArchitectureDiagram";
import {
  SUPERVISORS,
  STUDENT_DEVELOPERS,
} from "@/lib/types/about/mock-data";

export function ArchitectureAndTeamSection() {
  const [activeTab, setActiveTab] = useState<"architecture" | "team">("architecture");
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section
      id="platform-and-team"
      ref={ref}
      className="relative overflow-hidden py-16 sm:py-24 border-t border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-950"
    >
      <SectionBackdrop seed={4} gridSize={88} />

      <div className="relative mx-auto w-full max-w-7xl px-6 sm:px-12">
        {/* ─── Premium Segmented Capsule Switcher ─── */}
        <div className="mb-12 sm:mb-16 flex items-center justify-center">
          <div className="relative inline-flex items-center gap-1 rounded-full bg-slate-100/90 p-1.5 shadow-xs ring-1 ring-slate-200/80 backdrop-blur-md dark:bg-neutral-900/90 dark:ring-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab("architecture")}
              className={`relative z-10 cursor-pointer rounded-full px-8 py-2.5 text-sm sm:text-base font-semibold tracking-tight transition-colors duration-200 ${
                activeTab === "architecture"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {activeTab === "architecture" && (
                <motion.span
                  layoutId="aboutActiveTabPill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">Architecture</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("team")}
              className={`relative z-10 cursor-pointer rounded-full px-8 py-2.5 text-sm sm:text-base font-semibold tracking-tight transition-colors duration-200 ${
                activeTab === "team"
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-500 hover:text-slate-800 dark:text-neutral-400 dark:hover:text-neutral-200"
              }`}
            >
              {activeTab === "team" && (
                <motion.span
                  layoutId="aboutActiveTabPill"
                  className="absolute inset-0 rounded-full bg-white shadow-sm ring-1 ring-black/5 dark:bg-neutral-800 dark:ring-white/10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">Team</span>
            </button>
          </div>
        </div>

        {/* ─── Animated Tab Content ─── */}
        <AnimatePresence mode="wait">
          {activeTab === "architecture" ? (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full"
            >
              <SystemArchitectureDiagram />
            </motion.div>
          ) : (
            <motion.div
              key="team"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="w-full"
            >
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
                    <div
                      key={mentor.name}
                      className="w-full max-w-85 sm:max-w-90 lg:max-w-95"
                    >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
