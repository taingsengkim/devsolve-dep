"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProgramHeaderProps {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
}

export const ProgramHeader: React.FC<ProgramHeaderProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Program Marketplace
        </h1>
        <p className="text-slate-600 mt-1.5 text-base font-normal">
          Discover bug bounty programs and responsible disclosure opportunities worldwide.
        </p>
      </div>

      {/* Search Bar Form */}
      <form
        onSubmit={onSearchSubmit}
        className="flex items-center gap-2 w-full md:w-[420px]"
      >
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            placeholder="Search program , companies , keywords...."
            className="h-11 pl-4 pr-10 rounded-xl bg-white border-slate-300 text-sm shadow-2xs focus-visible:ring-blue-600 focus-visible:border-blue-600"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={onClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-semibold"
            >
              Clear
            </button>
          )}
        </div>
        <Button
          type="submit"
          className="h-11 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs shrink-0 cursor-pointer font-semibold"
        >
          <Search className="w-4 h-4" />
          <span className="sr-only sm:not-sr-only sm:inline-block">Search</span>
        </Button>
      </form>
    </header>
  );
};
