"use client";

import { motion } from "motion/react";

import { ExportHeader } from "@/components/report-management/export/ExportHeader";
import { ExportOptions } from "@/components/report-management/export/ExportOptions";
import { RecentExports } from "@/components/report-management/export/RecentExports";

export default function Page() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto w-full max-w-[1400px] space-y-5 pb-12"
    >
      <ExportHeader />
      <ExportOptions />
      <RecentExports />
    </motion.section>
  );
}
