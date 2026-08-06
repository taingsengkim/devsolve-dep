"use client";

import { motion } from "motion/react";

import { PublicAboutContact } from "@/components/public-about/PublicAboutContact";
import { PublicAboutHero } from "@/components/public-about/PublicAboutHero";
import { PublicAboutStory } from "@/components/public-about/PublicAboutStory";
import { PublicTeamGrid } from "@/components/public-about/PublicTeamGrid";
import { PublicProgramFooter } from "@/components/public-programs/PublicProgramFooter";

export function PublicAboutPage() {
  return (
    <>
      <section className="bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="space-y-6 pt-4 sm:pt-6"
        >
          <PublicAboutHero />
          <div className="mx-auto max-w-[1280px] space-y-6 px-4 pb-16 sm:px-6 lg:px-8">
            <PublicAboutStory />
            <PublicTeamGrid />
            <PublicAboutContact />
          </div>
        </motion.div>
      </section>
      <PublicProgramFooter />
    </>
  );
}
