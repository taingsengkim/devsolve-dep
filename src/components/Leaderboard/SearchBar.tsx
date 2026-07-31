"use client";

import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={16} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search researchers..."
        className="w-full rounded-xl bg-slate-100 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
