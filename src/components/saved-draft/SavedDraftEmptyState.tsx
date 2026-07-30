import { FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button";

type SavedDraftEmptyStateProps = {
  searchTerm: string;
  onClear: () => void;
};

export function SavedDraftEmptyState({
  searchTerm,
  onClear,
}: SavedDraftEmptyStateProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-200 bg-white px-6 text-center shadow-2xs">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <FileSearch className="size-6" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-slate-900">No saved drafts found</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        {searchTerm
          ? "Try a different keyword or clear the search to see the rest of your saved drafts."
          : "There are no drafts in this section yet. Start a new activity and your draft will appear here."}
      </p>
      {searchTerm ? (
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          className="mt-5 rounded-full border-slate-300 bg-white px-4 text-slate-700 hover:bg-slate-50"
        >
          Clear search
        </Button>
      ) : null}
    </div>
  );
}
