import type { Metadata } from "next";
import SectionBackdrop from "@/components/landing/SectionBackdrop";
import LeaderboardClient from "@/components/Leaderboard/LeaderboardClient";
import PointsLegend from "@/components/Leaderboard/PointsLegend";

export const metadata: Metadata = {
  title: "Leaderboard · DevSolve",
  description:
    "Researchers ranked by reputation points earned from valid, critical and recognized reports.",
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header band, not a fold — people come here for the ranking, so the
          podium should already be on screen. */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <SectionBackdrop seed={4} gridSize={72} particles={false} />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-8 lg:px-8">
          <div className="min-w-0">
            <div className="mb-1.5 flex items-center gap-2">
              <span className="h-px w-6 bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                Community standing
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.035em] text-[#1E293B] sm:text-3xl">
              Leaderboard<span className="text-blue-600">.</span>
            </h1>

            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
              Ranked on reputation points from valid findings and the
              recognitions companies gave them — a Critical counts the same at a
              two-person startup or a bank.
            </p>
          </div>

          <PointsLegend className="shrink-0 sm:max-w-md sm:justify-end" />
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <LeaderboardClient />
      </div>
    </div>
  );
}
