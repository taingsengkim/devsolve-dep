import Image from "next/image";
import { motion } from "motion/react";

import {
  ABOUT_TEAM_MEMBERS,
  type AboutTeamMember,
} from "@/components/public-about/mock-data";
import { Badge } from "@/components/ui/badge";

const TEAM_TAGS = [
  "Mentor",
  "Leader",
  "Sub Leader",
  "Member",
  "Frontend Developer",
  "Backend Developer",
];

export function PublicTeamGrid() {
  const mentorMembers = ABOUT_TEAM_MEMBERS.filter(
    (member) => member.group === "Mentorship"
  );
  const studentMembers = ABOUT_TEAM_MEMBERS.filter(
    (member) => member.group !== "Mentorship"
  );

  return (
    <section className="space-y-8 rounded-[36px] border border-slate-200 bg-white p-6 shadow-[0_2px_12px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-900 sm:p-8 lg:p-10">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-slate-900 dark:text-white sm:text-4xl">
            The People Behind DevSolve
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-7 text-slate-500 dark:text-slate-400">
            A focused team showcase with cleaner portraits, calmer spacing, and a
            more structured role presentation.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2">
          {TEAM_TAGS.map((tag, index) => (
            <Badge
              key={tag}
              variant="outline"
              className={
                index === 0
                  ? "rounded-full border-pink-200 bg-pink-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-pink-600 dark:border-pink-400/20 dark:bg-pink-500/10 dark:text-pink-200"
                  : index < 4
                    ? "rounded-full border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-200"
                    : "rounded-full border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-600 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-200"
              }
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <TeamSection title="Supervisors & Mentors">
        <div className="grid gap-8 md:grid-cols-2 md:justify-center lg:mx-auto lg:max-w-2xl">
          {mentorMembers.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} featured />
          ))}
        </div>
      </TeamSection>

      <TeamSection title="Student Developers">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {studentMembers.map((member, index) => (
            <TeamCard key={member.name} member={member} index={index} />
          ))}
        </div>
      </TeamSection>
    </section>
  );
}

function TeamSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">
          {title}
        </p>
        <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
      </div>
      {children}
    </div>
  );
}

type TeamCardProps = {
  member: AboutTeamMember;
  index: number;
  featured?: boolean;
};

function TeamCard({ member, index, featured = false }: TeamCardProps) {
  const accentClasses =
    member.accent === "blue"
      ? {
          frame: "border-blue-100 dark:border-blue-500/20",
          badge:
            "border-blue-200 bg-blue-50/95 text-blue-700 dark:border-blue-400/25 dark:bg-blue-500/12 dark:text-blue-200",
          text: "text-blue-600 dark:text-blue-300",
        }
      : member.accent === "emerald"
        ? {
            frame: "border-emerald-100 dark:border-emerald-500/20",
            badge:
              "border-emerald-200 bg-emerald-50/95 text-emerald-700 dark:border-emerald-400/25 dark:bg-emerald-500/12 dark:text-emerald-200",
            text: "text-emerald-600 dark:text-emerald-300",
          }
        : {
            frame: "border-slate-200 dark:border-white/10",
            badge:
              "border-slate-200 bg-slate-100/95 text-slate-700 dark:border-white/10 dark:bg-slate-800 dark:text-slate-200",
            text: "text-slate-700 dark:text-slate-300",
          };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05, ease: "easeOut" }}
      className={`group text-center ${featured ? "mx-auto w-full max-w-[280px]" : "w-full max-w-[248px]"}`}
    >
      <div
        className={`relative mx-auto overflow-hidden rounded-[22px] border bg-white shadow-[0_8px_18px_rgba(15,23,42,0.08)] transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_34px_rgba(15,23,42,0.12)] dark:bg-slate-950 ${accentClasses.frame} ${
          featured ? "h-[180px] w-[132px]" : "h-[128px] w-[128px]"
        }`}
      >
        <Image
          src={member.imageSrc}
          alt={member.name}
          fill
          sizes={featured ? "132px" : "128px"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.24),transparent_52%)]" />
        <div className="absolute inset-x-2 -bottom-px flex justify-center">
          <Badge variant="outline" className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] shadow-sm ${accentClasses.badge}`}>
            {member.role}
          </Badge>
        </div>
      </div>

      <h3 className="mt-6 text-[22px] font-semibold tracking-[-0.03em] text-slate-900 dark:text-white">
        {member.name}
      </h3>
      <p className={`mt-1 text-[11px] font-bold uppercase tracking-[0.14em] ${accentClasses.text}`}>
        {member.specialty}
      </p>
      <p className="mx-auto mt-3 max-w-[240px] text-sm leading-6 text-slate-500 dark:text-slate-400">
        &quot;{member.quote}&quot;
      </p>
    </motion.article>
  );
}
