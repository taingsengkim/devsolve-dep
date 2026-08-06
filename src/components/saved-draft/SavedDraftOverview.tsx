import type { ReactNode } from "react";
import { FileStack, FolderKanban, Sparkles, TimerReset } from "lucide-react";

type SavedDraftOverviewProps = {
  totalDrafts: number;
  activeCount: number;
  recentlyUpdatedCount: number;
  categoryCount: number;
};

export function SavedDraftOverview({
  totalDrafts,
  activeCount,
  recentlyUpdatedCount,
  categoryCount,
}: SavedDraftOverviewProps) {
  return (
    <section className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <div className="grid gap-0 lg:grid-cols-[minmax(0,1.2fr)_0.9fr]">
        <div className="relative overflow-hidden px-6 py-6 sm:px-7">
          <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.10),transparent_45%),linear-gradient(135deg,rgba(248,250,252,0.95),rgba(255,255,255,1))]" />

          <div className="relative flex h-full flex-col gap-6 lg:flex-row lg:items-center">
            <div className="relative flex h-[170px] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-[22px] border border-blue-100 bg-[linear-gradient(180deg,#F8FBFF_0%,#EFF6FF_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <div className="absolute left-8 top-7 flex size-14 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <FileStack className="size-6 text-[#2563EB]" />
              </div>
              <div className="absolute right-7 top-8 flex size-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <Sparkles className="size-5 text-violet-500" />
              </div>
              <div className="absolute bottom-8 left-9 flex size-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <FolderKanban className="size-5 text-emerald-500" />
              </div>
              <div className="absolute bottom-8 right-8 flex size-12 items-center justify-center rounded-2xl border border-slate-200/80 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                <TimerReset className="size-5 text-amber-500" />
              </div>

              <div className="relative flex size-20 items-center justify-center rounded-[28px] bg-[#2563EB] text-white shadow-[0_16px_30px_rgba(37,99,235,0.28)]">
                <FileStack className="size-8" />
              </div>

              <span className="absolute left-18 top-16 h-px w-20 border-t border-dashed border-blue-200" />
              <span className="absolute right-17 top-16 h-px w-20 border-t border-dashed border-blue-200" />
              <span className="absolute bottom-20 left-18 h-px w-18 border-t border-dashed border-blue-200" />
              <span className="absolute bottom-20 right-17 h-px w-18 border-t border-dashed border-blue-200" />
            </div>

            <div className="relative max-w-xl space-y-3">
              <p className="inline-flex rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2563EB]">
                Draft Workspace
              </p>
              <div className="space-y-2">
                <h2 className="text-[28px] font-semibold tracking-[-0.03em] text-[#0F172A]">
                  Keep unfinished work organized and ready to resume.
                </h2>
                <p className="max-w-lg text-sm leading-7 text-[#64748B] sm:text-base">
                  Review saved ideas, reopen unfinished reports, and continue editing from one clean workspace built for fast follow-up.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-slate-200 bg-slate-50/70 lg:border-t-0 lg:border-l">
          <OverviewMetric
            icon={<FileStack className="size-4.5" />}
            label="Total drafts"
            value={`${totalDrafts}+`}
            helper="Saved across all categories"
          />
          <OverviewMetric
            icon={<FolderKanban className="size-4.5" />}
            label="In current view"
            value={`${activeCount}`}
            helper="Ready to continue now"
          />
          <OverviewMetric
            icon={<TimerReset className="size-4.5" />}
            label="Updated recently"
            value={`${recentlyUpdatedCount}`}
            helper="Touched in the last 24 hours"
          />
          <OverviewMetric
            icon={<Sparkles className="size-4.5" />}
            label="Active categories"
            value={`${categoryCount}`}
            helper="Problem, solution, program, report"
          />
        </div>
      </div>
    </section>
  );
}

function OverviewMetric({
  icon,
  label,
  value,
  helper,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <div className="border-slate-200 p-6 odd:border-r even:border-r-0 [&:nth-child(-n+2)]:border-b">
      <div className="flex size-10 items-center justify-center rounded-xl bg-white text-[#2563EB] shadow-[0_4px_14px_rgba(15,23,42,0.06)]">
        {icon}
      </div>
      <p className="mt-4 text-[30px] font-semibold tracking-[-0.04em] text-[#0F172A]">
        {value}
      </p>
      <p className="mt-1 text-sm font-medium text-[#0F172A]">{label}</p>
      <p className="mt-1 text-sm leading-6 text-[#64748B]">{helper}</p>
    </div>
  );
}
