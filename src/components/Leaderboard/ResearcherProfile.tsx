import { Researcher } from "@/lib/types/leaderboard/types";
import { motion } from "motion/react";
import { Star, Info, Award, MessageCircle, Heart, Users } from "lucide-react";

interface ResearcherProfileProps {
  researcher: Researcher;
}

const ICONS = [MessageCircle, Heart, Users, Award];

export default function ResearcherProfile({ researcher }: ResearcherProfileProps) {
  if (!researcher) return null;

  return (
    <motion.div
      key={researcher.id}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full sticky top-8"
    >
      {/* Header Profile */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          {researcher.avatarUrl ? (
            <img
              src={researcher.avatarUrl}
              alt={researcher.handle}
              className="h-28 w-28 rounded-full object-cover shadow-lg border-4 border-white"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 text-3xl font-bold text-white shadow-lg border-4 border-white">
              {researcher.avatarInitials}
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold text-slate-900">{researcher.realName}</h2>
        {/* <div className="flex flex-col items-center mt-2 bg-blue-600 rounded-lg px-6 py-2 shadow-sm text-white">
          <span className="text-sm font-semibold">Level {researcher.level}</span>
          <div className="flex gap-1 mt-1">
            {Array.from({ length: Math.min(researcher.level, 5) }).map((_, i) => (
              <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div> */}
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Achiever in other categories</h3>
        <div className="flex flex-wrap gap-2">
          {researcher.categories?.map((cat, idx) => (
            <span
              key={idx}
              className="px-3 py-1 bg-cyan-500 text-white text-xs font-semibold rounded-full shadow-sm"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-slate-700 mb-4">Achievements</h3>
        <div className="grid grid-cols-2 gap-4">
          {researcher.achievements?.map((ach, idx) => {
            const Icon = ICONS[idx % ICONS.length];
            // Cycle through colors just for mockup visual variety
            const bgColors = ["bg-blue-600", "bg-cyan-500", "bg-indigo-500", "bg-purple-600"];
            const colorClass = bgColors[idx % bgColors.length];
            
            return (
              <div
                key={ach.id}
                className="relative bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex items-start gap-3 transition-transform hover:-translate-y-1"
              >
                {/* Hexagon shape mockup for icon */}
                <div className={`relative flex items-center justify-center w-12 h-12 rounded-lg ${colorClass} text-white shrink-0`}>
                  <Icon size={20} />
                  <span className="absolute -bottom-2 -right-2 text-[10px] font-bold bg-white text-slate-800 px-1 rounded shadow-sm border border-slate-100">
                    {ach.value}
                  </span>
                </div>
                
                <div className="flex flex-col justify-center h-full">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-slate-900">Level {ach.level}</span>
                    <Info size={12} className="text-slate-400" />
                  </div>
                  <span className="text-xs text-slate-500 mt-0.5 leading-tight">{ach.label}</span>
                </div>

                <div className="absolute top-2 right-2 text-[10px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>
              </div>
            );
          })}
        </div>
    
      </div>
    </motion.div>
  );
}
