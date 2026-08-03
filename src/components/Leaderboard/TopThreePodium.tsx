"use client";

import { Researcher } from "@/lib/types/leaderboard/types";
import { motion } from "motion/react";
import { Crown, Flame } from "lucide-react";

interface TopThreePodiumProps {
  topThree: Researcher[];
  onSelect?: (id: string) => void;
}

export default function TopThreePodium({ topThree, onSelect }: TopThreePodiumProps) {
  const rank1 = topThree.find((r) => r.rank === 1);
  const rank2 = topThree.find((r) => r.rank === 2);
  const rank3 = topThree.find((r) => r.rank === 3);

  const podiumItems = [
    {
      researcher: rank2,
      position: 2,
      delay: 0.1,
      stepHeight: "h-24 sm:h-32",
      trophyType: "silver",
      badgeBg: "bg-slate-800 text-white border-slate-600",
      glowColor: "shadow-slate-400/20",
      accentBg: "from-slate-700 to-slate-900",
      floatDuration: 3.2,
      floatDistance: -5,
    },
    {
      researcher: rank1,
      position: 1,
      delay: 0,
      stepHeight: "h-32 sm:h-40",
      trophyType: "gold",
      badgeBg: "bg-amber-500 text-slate-950 border-amber-300 font-extrabold",
      glowColor: "shadow-amber-500/30 border-amber-400/50",
      accentBg: "from-amber-500 to-amber-700",
      floatDuration: 2.5,
      floatDistance: -8,
    },
    {
      researcher: rank3,
      position: 3,
      delay: 0.2,
      stepHeight: "h-18 sm:h-24",
      trophyType: "bronze",
      badgeBg: "bg-amber-950 text-amber-200 border-amber-800",
      glowColor: "shadow-orange-900/20",
      accentBg: "from-amber-800 to-orange-950",
      floatDuration: 2.9,
      floatDistance: -4,
    },
  ];

  return (
    <div className="relative w-full rounded-3xl bg-slate-900 p-6 sm:p-8 pt-10 sm:pt-12 overflow-hidden shadow-xl border border-slate-800">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex items-end justify-center gap-3 sm:gap-6 mt-4">
        {podiumItems.map((item) => {
          if (!item.researcher) return null;
          const isFirst = item.position === 1;

          return (
            <motion.div
              key={item.researcher.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: item.delay, duration: 0.5 }}
              onClick={() => onSelect?.(item.researcher!.id)}
              className="flex flex-col items-center flex-1 max-w-[150px] sm:max-w-[190px] cursor-pointer group"
            >
              {/* Floating Container (Avatar + Score) */}
              <motion.div
                animate={{ y: [0, item.floatDistance, 0] }}
                transition={{
                  duration: item.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center w-full"
              >
                {/* Crown for #1 */}
                {isFirst && (
                  <motion.div
                    animate={{ rotate: [-3, 3, -3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="mb-1"
                  >
                    <Crown size={28} className="text-amber-400 fill-amber-400 drop-shadow-md" />
                  </motion.div>
                )}

                {/* Profile Avatar */}
                <div className="relative flex flex-col items-center mb-2">
                  <div className="relative">
                    {item.researcher.avatarUrl ? (
                      <img
                        src={item.researcher.avatarUrl}
                        alt={item.researcher.handle}
                        className={`rounded-full object-cover ring-4 transition-transform group-hover:scale-105 ${
                          isFirst
                            ? "h-20 w-20 sm:h-26 sm:w-26 ring-amber-400 shadow-xl shadow-amber-500/20"
                            : "h-16 w-16 sm:h-20 sm:w-20 ring-slate-400 shadow-lg"
                        }`}
                      />
                    ) : (
                      <div
                        className={`flex items-center justify-center rounded-full bg-slate-800 text-white ring-4 font-bold ${
                          isFirst
                            ? "h-20 w-20 sm:h-26 sm:w-26 ring-amber-400 text-2xl"
                            : "h-16 w-16 sm:h-20 sm:w-20 ring-slate-400 text-xl"
                        }`}
                      >
                        {item.researcher.avatarInitials}
                      </div>
                    )}

                    {/* Streak indicator */}
                    <div className="absolute -bottom-1 -right-1 flex items-center gap-0.5 rounded-full bg-slate-900 px-1.5 py-0.5 text-[10px] font-bold text-amber-400 border border-slate-700 shadow-xs">
                      <Flame size={10} className="fill-amber-400 text-amber-400" />
                      <span>14d</span>
                    </div>
                  </div>

                  {/* Handle / Name */}
                  <div className="mt-2 text-center">
                    <p className="font-bold text-white text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[150px]">
                      @{item.researcher.handle}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate max-w-[110px] sm:max-w-[150px]">
                      {item.researcher.realName}
                    </p>
                  </div>
                </div>

                {/* Score Plaque Pill */}
                <div className="my-1.5">
                  <div
                    className={`px-3 py-1 rounded-full border ${item.badgeBg} text-xs font-extrabold shadow-md tracking-tight`}
                  >
                    {item.researcher.reputation.toLocaleString()} pts
                  </div>
                </div>
              </motion.div>

              {/* Podium Block */}
              <div className="w-full relative flex flex-col items-center">
                {/* Top face of podium step */}
                <div
                  className={`w-full h-2 rounded-t-md bg-gradient-to-r ${item.accentBg}`}
                />

                {/* Main Front face of podium step */}
                <div
                  className={`w-full ${item.stepHeight} bg-slate-800/80 backdrop-blur-md border-t border-white/10 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-800 transition-colors`}
                >
                  <span
                    className={`font-black ${
                      isFirst
                        ? "text-5xl sm:text-7xl text-amber-400/30"
                        : "text-4xl sm:text-6xl text-slate-600/30"
                    }`}
                  >
                    {item.position}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
