import { Researcher } from "@/lib/types/leaderboard/types";
import { motion } from "motion/react";

interface TopThreePodiumProps {
  topThree: Researcher[];
}

export default function TopThreePodium({ topThree }: TopThreePodiumProps) {
  // Assuming topThree is sorted 1, 2, 3
  const rank1 = topThree.find((r) => r.rank === 1);
  const rank2 = topThree.find((r) => r.rank === 2);
  const rank3 = topThree.find((r) => r.rank === 3);

  const podiumItems = [
    {
      researcher: rank2,
      position: 2,
      delay: 0.1,
      stepHeight: "h-24 sm:h-28",
      trophyType: "silver",
      badgeBg: "bg-slate-800 text-white border-slate-600",
      floatDuration: 3.2,
      floatDistance: -5,
    },
    {
      researcher: rank1,
      position: 1,
      delay: 0,
      stepHeight: "h-32 sm:h-36",
      trophyType: "gold",
      badgeBg: "bg-amber-800 text-amber-200 border-amber-600",
      floatDuration: 2.5,
      floatDistance: -8,
    },
    {
      researcher: rank3,
      position: 3,
      delay: 0.2,
      stepHeight: "h-16 sm:h-20",
      trophyType: "bronze",
      badgeBg: "bg-amber-950 text-amber-300 border-amber-800",
      floatDuration: 2.9,
      floatDistance: -4,
    },
  ];

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-purple-600 to-indigo-700 p-4 sm:p-8 pt-10 sm:pt-12 overflow-hidden shadow-md">
      <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-4 md:gap-6 mt-2">
        {podiumItems.map((item) => {
          if (!item.researcher) return null;
          const isFirst = item.position === 1;

          return (
            <motion.div
              key={item.researcher.id}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: item.delay, duration: 0.5 }}
              className="flex flex-col items-center flex-1 max-w-[140px] sm:max-w-[170px]"
            >
              {/* Floating Container (Avatar + Trophy) */}
              <motion.div
                animate={{ y: [0, item.floatDistance, 0] }}
                transition={{
                  duration: item.floatDuration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex flex-col items-center w-full"
              >
                {/* Profile Avatar */}
                <div className="relative flex flex-col items-center mb-2">
                  <div className="relative">
                    {item.researcher.avatarUrl ? (
                      <img
                        src={item.researcher.avatarUrl}
                        alt={item.researcher.handle}
                        className={`rounded-full object-cover ring-4 ring-white/50 shadow-md ${
                          isFirst ? "h-20 w-20 sm:h-24 sm:w-24" : "h-16 w-16 sm:h-20 sm:w-20"
                        }`}
                      />
                    ) : (
                      <div
                        className={`flex items-center justify-center rounded-full bg-slate-100 text-slate-800 ring-4 ring-white/50 shadow-md font-bold ${
                          isFirst ? "h-20 w-20 sm:h-24 sm:w-24 text-2xl" : "h-16 w-16 sm:h-20 sm:w-20 text-xl"
                        }`}
                      >
                        {item.researcher.avatarInitials}
                      </div>
                    )}
                  </div>

                  {/* Handle / Name */}
                  <div className="mt-2 text-center">
                    <p className="font-bold text-white text-xs sm:text-sm truncate max-w-[110px] sm:max-w-[140px]">
                      @{item.researcher.handle}
                    </p>
                  </div>
                </div>

                {/* Trophy & Score Plaque */}
                <div className="flex flex-col items-center my-1 sm:my-2 relative">
                  {/* Trophy SVG */}
                  {item.trophyType === "gold" && (
                    <svg className="w-16 h-20 sm:w-22 sm:h-26" viewBox="0 0 100 120" fill="none">
                      <defs>
                        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDE047" />
                          <stop offset="100%" stopColor="#EAB308" />
                        </linearGradient>
                      </defs>
                      <path d="M18 24 C2 24 2 54 22 54" stroke="url(#goldGrad)" strokeWidth="7" fill="none" strokeLinecap="round" />
                      <path d="M82 24 C98 24 98 54 78 54" stroke="url(#goldGrad)" strokeWidth="7" fill="none" strokeLinecap="round" />
                      <path d="M18 12 H82 V44 C82 66 66 76 50 76 C34 76 18 66 18 44 Z" fill="url(#goldGrad)" />
                      <path d="M42 74 H58 V88 H42 Z" fill="#CA8A04" />
                      <path d="M30 88 H70 V96 H30 Z" fill="url(#goldGrad)" />
                      <motion.polygon
                        animate={{ scale: [1, 1.15, 1], opacity: [0.9, 1, 0.9] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        points="50,26 53,35 62,35 55,40 57,49 50,44 43,49 45,40 38,35 47,35"
                        fill="#FFFFFF"
                      />
                    </svg>
                  )}

                  {item.trophyType === "silver" && (
                    <svg className="w-14 h-18 sm:w-18 sm:h-22" viewBox="0 0 100 120" fill="none">
                      <defs>
                        <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FFFFFF" />
                          <stop offset="100%" stopColor="#94A3B8" />
                        </linearGradient>
                      </defs>
                      <path d="M20 24 C5 24 5 54 22 54" stroke="url(#silverGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                      <path d="M80 24 C95 24 95 54 78 54" stroke="url(#silverGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                      <path d="M20 14 H80 V44 C80 64 65 74 50 74 C35 74 20 64 20 44 Z" fill="url(#silverGrad)" />
                      <path d="M43 74 H57 V86 H43 Z" fill="#64748B" />
                      <path d="M32 86 H68 V94 H32 Z" fill="url(#silverGrad)" />
                      <polygon points="41,30 43,36 49,36 44,40 46,46 41,42 36,46 38,40 33,36 39,36" fill="#FFFFFF" />
                      <polygon points="59,30 61,36 67,36 62,40 64,46 59,42 54,46 56,40 51,36 57,36" fill="#FFFFFF" />
                    </svg>
                  )}

                  {item.trophyType === "bronze" && (
                    <svg className="w-12 h-16 sm:w-16 sm:h-20" viewBox="0 0 100 120" fill="none">
                      <defs>
                        <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FDBA74" />
                          <stop offset="100%" stopColor="#C2410C" />
                        </linearGradient>
                      </defs>
                      <path d="M20 24 C5 24 5 54 22 54" stroke="url(#bronzeGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                      <path d="M80 24 C95 24 95 54 78 54" stroke="url(#bronzeGrad)" strokeWidth="6" fill="none" strokeLinecap="round" />
                      <path d="M20 14 H80 V44 C80 64 65 74 50 74 C35 74 20 64 20 44 Z" fill="url(#bronzeGrad)" />
                      <path d="M43 74 H57 V86 H43 Z" fill="#9A3412" />
                      <path d="M32 86 H68 V94 H32 Z" fill="url(#bronzeGrad)" />
                      <polygon points="50,26 52,31 57,31 53,34 54,39 50,36 46,39 47,34 43,31 48,31" fill="#FFFFFF" />
                      <polygon points="34,36 36,41 41,41 37,44 38,49 34,46 30,49 31,44 27,41 32,41" fill="#FFFFFF" />
                      <polygon points="66,36 68,41 73,41 69,44 70,49 66,46 62,49 63,44 59,41 64,41" fill="#FFFFFF" />
                    </svg>
                  )}

                  {/* Score Plaque Pill */}
                  <div
                    className={`-mt-2 px-3 py-0.5 rounded border ${item.badgeBg} text-[11px] sm:text-xs font-bold z-10`}
                  >
                    {item.researcher.reputation.toLocaleString()}
                  </div>
                </div>
              </motion.div>

              {/* Podium Block */}
              <div className="w-full relative flex flex-col items-center">
                {/* Top face of podium step */}
                <div className="w-full h-2 bg-slate-200 rounded-t-sm" />
                
                {/* Main Front face of podium step */}
                <div
                  className={`w-full ${item.stepHeight} bg-slate-100 border-t border-white flex items-center justify-center relative overflow-hidden`}
                >
                  <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-400">
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
