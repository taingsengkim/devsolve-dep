"use client";

import { motion } from "motion/react";

import { TeamsMembersSection } from "@/components/teams/TeamsMembersSection";
import { TeamsPageHeader } from "@/components/teams/TeamsPageHeader";
import { TeamsStatsGrid } from "@/components/teams/TeamsStatsGrid";
import { useTeamMembers } from "@/hooks/useTeamMembers";

export default function TeamsPage() {
  const {
    counts,
    filteredMembers,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
  } = useTeamMembers();

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex flex-col gap-6 pb-12"
    >
      <TeamsPageHeader />
      <TeamsStatsGrid counts={counts} />
      <TeamsMembersSection
        counts={counts}
        filteredMembers={filteredMembers}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
    </motion.section>
  );
}
