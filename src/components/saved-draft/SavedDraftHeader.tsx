import { FileStack } from "lucide-react";

type SavedDraftHeaderProps = {
  totalDrafts: number;
};

export function SavedDraftHeader({ totalDrafts }: SavedDraftHeaderProps) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-2.5">
        <h1 className="text-[32px] font-semibold tracking-[-0.03em] text-[#0F172A]">
          Saved Draft
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-[#64748B] sm:text-base">
          Manage all your saved drafts across problems, solutions, programs, and reports.
        </p>
      </div>

      <div className="w-full max-w-[240px] rounded-[20px] border border-[#E2E8F0] bg-white px-4 py-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#EFF6FF_0%,#DBEAFE_100%)] text-[#2563EB]">
            <FileStack className="size-4.5" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Total Drafts
            </p>
            <p className="mt-1 text-base font-semibold tracking-[-0.02em] text-[#0F172A]">
              {totalDrafts} saved items
            </p>
            <p className="mt-1 text-sm text-[#64748B]">Always ready to continue</p>
          </div>
        </div>
      </div>
    </header>
  );
}
