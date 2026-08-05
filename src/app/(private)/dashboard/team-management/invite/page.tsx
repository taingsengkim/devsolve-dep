"use client";

import { motion } from "motion/react";

import { InviteMemberForm } from "@/components/teams/invite-member/InviteMemberForm";
import { InviteMemberHeader } from "@/components/teams/invite-member/InviteMemberHeader";

export default function InviteMemberPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="w-full space-y-6 pb-12"
    >
      <InviteMemberHeader />
      <InviteMemberForm />
    </motion.div>
  );
}
