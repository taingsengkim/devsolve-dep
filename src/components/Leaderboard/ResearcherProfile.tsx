"use client";

import { Researcher } from "@/lib/types/leaderboard/types";
import { motion } from "motion/react";
import { Star, Award, MessageCircle, Heart, Users, ShieldCheck, Flame } from "lucide-react";

interface ResearcherProfileProps {
  researcher: Researcher;
}

const ICONS = [MessageCircle, Heart, Users, Award];

export default function ResearcherProfile({ researcher }: ResearcherProfileProps) {
  if (!researcher) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-slate-500">
        Select a researcher to view details
      </div>
    );
  }

  return (
    <motion.div
      key={researcher.id}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-6"
    >
      {/* Header Profile */}
      <div className="flex flex-col items-center text-center pb-6 border-b border-slate-200/80">
        <div className="relative mb-3">
          {researcher.avatarUrl ? (
            <img
              src={researcher.avatarUrl}
              alt={researcher.handle}
              className="h-24 w-24 rounded-full object-cover shadow-md border-4 border-white ring-2 ring-slate-200"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-2xl font-bold text-white shadow-md border-4 border-white">
              {researcher.avatarInitials}
            </div>
          )}

          {/* Rank Badge */}
          <span className="absolute -bottom-1.5 right-0 rounded-full bg-slate-900 px-2.5 py-0.5 text-xs font-extrabold text-amber-400 border-2 border-white shadow-xs">
            #{researcher.rank}
          </span>
        </div>

        <h2 className="text-xl font-bold text-slate-900">{researcher.realName}</h2>
        <p className="text-sm font-medium text-slate-500">@{researcher.handle}</p>

        {/* Level Tag & Level Progress Bar */}
        <div className="w-full mt-4 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="flex items-center gap-1 text-slate-700">
              <Star size={14} className="text-amber-500 fill-amber-500" />
              Level {researcher.level ?? 3}
            </span>
            <span className="text-slate-500">{researcher.levelProgress ?? 87}% Progress</span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              style={{ width: `${researcher.levelProgress ?? 87}%` }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600"
            />
          </div>
        </div>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Reputation</div>
          <div className="text-base font-bold text-slate-900 mt-0.5">
            {researcher.reputation.toLocaleString()}
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Accepted</div>
          <div className="text-base font-bold text-emerald-600 mt-0.5">
            {researcher.accepted}
          </div>
        </div>

        <div className="rounded-xl bg-white p-3 border border-slate-200/80 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Critical</div>
          <div className="text-base font-bold text-amber-600 mt-0.5">
            {researcher.critical}
          </div>
        </div>
      </div>

      {/* Achiever Categories */}
      {researcher.categories && researcher.categories.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
            Category Milestones
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {researcher.categories.map((cat, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Achievements Grid */}
      {researcher.achievements && researcher.achievements.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Achievements & Trophies
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {researcher.achievements.map((ach, idx) => {
              const Icon = ICONS[idx % ICONS.length];
              const bgColors = [
                "bg-blue-600",
                "bg-indigo-600",
                "bg-purple-600",
                "bg-emerald-600",
              ];
              const colorClass = bgColors[idx % bgColors.length];

              return (
                <div
                  key={ach.id || idx}
                  className="relative bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex items-start gap-2.5 transition-transform hover:-translate-y-0.5"
                >
                  <div
                    className={`relative flex items-center justify-center w-10 h-10 rounded-lg ${colorClass} text-white shrink-0 shadow-xs`}
                  >
                    <Icon size={18} />
                    <span className="absolute -bottom-1.5 -right-1 text-[10px] font-bold bg-white text-slate-900 px-1 py-0.5 rounded border border-slate-200 shadow-2xs">
                      {ach.value}
                    </span>
                  </div>

                  <div className="flex flex-col justify-center min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      Level {ach.level}
                    </span>
                    <span className="text-xs text-slate-500 leading-tight truncate">
                      {ach.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
