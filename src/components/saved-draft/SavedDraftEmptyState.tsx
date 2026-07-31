import Link from "next/link";
import { FileSearch, Plus } from "lucide-react";

import type { DraftCategory } from "@/components/saved-draft/types";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SavedDraftEmptyStateProps = {
  activeTab: DraftCategory;
  searchTerm: string;
  onClear: () => void;
};

function getCreateHref(category: DraftCategory) {
  if (category === "program") {
    return "/dashboard/programs";
  }

  if (category === "report") {
    return "/dashboard/report-management";
  }

  return "/dashboard/my-reports";
}

export function SavedDraftEmptyState({
  activeTab,
  searchTerm,
  onClear,
}: SavedDraftEmptyStateProps) {
  const createHref = getCreateHref(activeTab);

  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[14px] border border-dashed border-slate-200 bg-white px-6 text-center shadow-[0_1px_4px_rgba(15,23,42,0.04)]">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB]">
        <FileSearch className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-[#0F172A]">
        No saved drafts found
      </h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-[#64748B]">
        {searchTerm
          ? "Try a different keyword or clear your search to see the rest of your saved drafts."
          : "There are no drafts in this section yet. Start a new item and it will appear here once it is saved."}
      </p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        {searchTerm ? (
          <Button
            type="button"
            variant="outline"
            onClick={onClear}
            className="rounded-xl border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-50"
          >
            Clear search
          </Button>
        ) : null}
        <Link
          href={createHref}
          className={cn(
            buttonVariants({ variant: "default" }),
            "rounded-xl bg-[#2563EB] px-4 text-white hover:bg-[#1D4ED8]"
          )}
        >
          <Plus data-icon="inline-start" />
          Create new content
        </Link>
      </div>
    </div>
  );
}
