"use client";

import { motion } from "motion/react";

import { InviteMemberForm } from "@/components/teams/invite-member/InviteMemberForm";
import { InviteMemberHeader } from "@/components/teams/invite-member/InviteMemberHeader";
import { InviteMemberSidebar } from "@/components/teams/invite-member/InviteMemberSidebar";

export default function InviteMemberPage() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 pb-12"
    >
      <InviteMemberHeader />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.75fr)]">
        <InviteMemberForm />
        <InviteMemberSidebar />
      </div>
    </motion.section>
  );
}
