"use client";

import React from "react";
import { motion } from "motion/react";
import LeaderboardClient from "@/components/Leaderboard/LeaderboardClient";

export default function DashboardLeaderboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="space-y-6 w-full pb-12"
    >
      <LeaderboardClient />
    </motion.div>
  );
}
