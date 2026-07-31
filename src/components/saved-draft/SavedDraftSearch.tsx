import { ArrowDownUp, Filter, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SavedDraftSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  sortBy: "recent" | "oldest" | "title";
  onSortChange: (value: "recent" | "oldest" | "title") => void;
  resultCount: number;
};

export function SavedDraftSearch({
  value,
  onChange,
  placeholder,
  sortBy,
  onSortChange,
  resultCount,
}: SavedDraftSearchProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            className="h-11 rounded-xl border border-[#E2E8F0] bg-white pr-3 pl-9 text-sm text-slate-700 shadow-[0_1px_3px_rgba(15,23,42,0.04)] focus-visible:border-blue-500 focus-visible:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#E2E8F0] bg-white px-3 text-sm text-slate-500 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
            <ArrowDownUp className="size-4" />
            <span>Sort by</span>
            <select
              value={sortBy}
              onChange={(event) =>
                onSortChange(event.target.value as "recent" | "oldest" | "title")
              }
              className="bg-transparent text-sm font-medium text-slate-700 outline-none"
            >
              <option value="recent">Recently updated</option>
              <option value="oldest">Oldest updated</option>
              <option value="title">Title A-Z</option>
            </select>
          </label>

          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl border-[#E2E8F0] bg-white px-3 text-slate-600 shadow-[0_1px_3px_rgba(15,23,42,0.04)] hover:border-blue-200 hover:bg-blue-50 hover:text-[#2563EB]"
          >
            <Filter data-icon="inline-start" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <p className="text-sm font-medium text-[#64748B]">{resultCount} drafts in view</p>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
          Resume work faster
        </p>
      </div>
    </div>
  );
}
