"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { MapPin, ChevronDown, Loader2, Search, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import type { CountryOption } from "@/lib/redux/services/geoApi";

/**
 * The searchable, flagged country picker — the dashboard's copy of the one the
 * register flow uses (`components/auth/CustomCountrySelect`), fed by the same
 * `geoApi` list.
 *
 * It is a separate component rather than a shared one because the register
 * screens paint a white page regardless of theme: giving that component the
 * `dark:` variants a dashboard page needs would turn its select dark inside a
 * light page. Same markup and same data, different surface.
 */

export type { CountryOption };

interface CustomCountrySelectProps {
  value: string;
  countryCode: string | null;
  countries: CountryOption[];
  onSelect: (country: CountryOption) => void;
  /** Shows a spinner in place of the chevron while the list is loading. */
  isDetecting?: boolean;
  error?: boolean;
  id?: string;
}

export default function CustomCountrySelect({
  value,
  countryCode,
  countries,
  onSelect,
  isDetecting,
  error,
  id,
}: CustomCountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Escape closes without picking, which a click-outside listener alone does
     not cover for someone on a keyboard. */
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase();
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [countries, searchQuery]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border bg-background px-3.5 text-base text-foreground shadow-2xs outline-none transition-all hover:bg-muted/50 focus:ring-2 focus:ring-blue-600/20",
          error
            ? "border-rose-400 focus:ring-rose-500/30 dark:border-rose-700"
            : "border-border focus:border-blue-600",
          isOpen &&
            !error &&
            "border-blue-600 ring-2 ring-blue-600/20 dark:border-blue-500",
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {countryCode ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`}
              alt=""
              className="h-3.5 w-5 shrink-0 rounded-sm border border-border object-cover shadow-2xs"
            />
          ) : (
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span
            className={cn(
              "truncate font-medium",
              !value && "font-normal text-muted-foreground",
            )}
          >
            {value || "Select a country or region"}
          </span>
        </div>

        <div className="ml-2 flex shrink-0 items-center gap-1.5 text-muted-foreground">
          {isDetecting ? (
            <Loader2 className="size-4 animate-spin text-blue-600 dark:text-blue-400" />
          ) : (
            <ChevronDown
              className={cn(
                "size-4 transition-transform duration-200",
                isOpen && "rotate-180 text-blue-600 dark:text-blue-400",
              )}
            />
          )}
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.15 }}
          className="absolute left-0 right-0 z-50 mt-1.5 flex max-h-72 flex-col overflow-hidden rounded-2xl border border-border bg-popover p-2 shadow-xl"
        >
          <div className="relative mb-2 px-1 pt-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country..."
              autoFocus
              className="h-9 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-blue-600 focus:outline-none"
            />
          </div>

          <div className="max-h-52 space-y-0.5 overflow-y-auto pr-1">
            {filteredCountries.length === 0 ? (
              <div className="py-4 text-center text-sm font-medium text-muted-foreground">
                No country matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = value === c.name;
                return (
                  <button
                    key={`${c.code}-${c.name}`}
                    type="button"
                    onClick={() => {
                      onSelect(c);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition-colors",
                      isSelected
                        ? "bg-blue-50 font-semibold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        : "font-medium text-foreground hover:bg-muted",
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png`}
                        alt=""
                        className="h-3.5 w-5 shrink-0 rounded-sm border border-border object-cover shadow-2xs"
                      />
                      <span className="truncate">{c.name}</span>
                    </div>
                    {isSelected && (
                      <Check className="ml-2 size-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
