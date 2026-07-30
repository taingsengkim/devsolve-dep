import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type SavedDraftSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function SavedDraftSearch({
  value,
  onChange,
  placeholder,
}: SavedDraftSearchProps) {
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-full border-slate-200 bg-white pl-4 pr-12 text-sm text-slate-700 shadow-2xs focus-visible:border-blue-500 focus-visible:ring-blue-400"
      />
      <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-300" />
    </div>
  );
}
