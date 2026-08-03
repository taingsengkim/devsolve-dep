"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomSelectProps {
  value: string;
  options: string[];
  placeholder: string;
  icon?: React.ReactNode;
  onSelect: (val: string) => void;
  error?: boolean;
}

export function CustomSelect({
  value,
  options,
  placeholder,
  icon,
  onSelect,
  error,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "w-full h-11 px-3.5 bg-white hover:bg-slate-50 border rounded-xl text-slate-900 text-sm flex items-center justify-between transition-all cursor-pointer outline-none",
          error
            ? "border-red-400 focus:ring-2 focus:ring-red-400"
            : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
          isOpen && "border-blue-500 ring-2 ring-blue-500/20 bg-white"
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className={cn("truncate font-medium", !value && "text-slate-400 font-normal")}>
            {value || placeholder}
          </span>
        </div>

        <ChevronDown
          className={cn(
            "w-4 h-4 text-slate-400 shrink-0 ml-2 transition-transform duration-200",
            isOpen && "rotate-180 text-blue-600"
          )}
        />
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          className="absolute z-50 left-0 right-0 mt-1.5 bg-white border border-slate-200/90 rounded-2xl shadow-xl p-1.5 max-h-60 overflow-y-auto space-y-0.5"
        >
          {options.map((opt) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onSelect(opt);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full px-3 py-2 text-xs sm:text-sm rounded-xl flex items-center justify-between text-left transition-colors cursor-pointer",
                  isSelected
                    ? "bg-blue-50 text-blue-700 font-semibold"
                    : "hover:bg-slate-50 text-slate-700 font-medium"
                )}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
              </button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
