"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export type DynamicNavigationItem = {
  label: string;
  href: string;
};

type DynamicNavigationProps = {
  items: DynamicNavigationItem[];
  pathname: string;
  className?: string;
  onItemHover?: (label: string | null) => void;
};

function isLinkActive(pathname: string, href: string) {
  const baseHref = href.split("#")[0];

  if (href === "/") {
    return pathname === "/";
  }

  return baseHref !== "/" && pathname === baseHref;
}

export default function DynamicNavigation({
  items,
  pathname,
  className,
  onItemHover,
}: DynamicNavigationProps) {
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);

  return (
    <nav
      className={cn("hidden items-center gap-1 lg:flex", className)}
      onMouseLeave={() => {
        setHoveredLabel(null);
        onItemHover?.(null);
      }}
    >
      {items.map((item) => {
        const isActive = isLinkActive(pathname, item.href);
        const isHovered = hoveredLabel === item.label;
        const isHighlighted = isHovered || (!hoveredLabel && isActive);

        return (
          <Link
            key={item.label}
            href={item.href}
            onMouseEnter={() => {
              setHoveredLabel(item.label);
              onItemHover?.(item.label);
            }}
            className="group relative rounded-full px-3.5 py-2 text-base font-medium text-muted-foreground transition-colors duration-200"
          >
            <motion.span
              className={cn(
                "absolute inset-0 -z-10 rounded-full border transition-colors duration-200",
                isHighlighted
                  ? "border-blue-200 bg-blue-50 dark:border-blue-400/25 dark:bg-blue-500/12"
                  : "border-transparent bg-transparent",
              )}
              layoutId={isHighlighted ? "dynamic-navigation-active" : undefined}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
            />

            <span
              className={cn(
                "relative transition-colors duration-200",
                isHighlighted
                  ? "font-semibold text-blue-600 dark:text-blue-300"
                  : isActive
                    ? "font-semibold text-slate-500 dark:text-slate-400"
                    : "text-muted-foreground",
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
