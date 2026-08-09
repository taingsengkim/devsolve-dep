"use client";

import React from "react";
import { motion } from "motion/react";
import { CircleSlash, LayoutTemplate, MessageSquare, Tags } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CategoryResponse } from "@/lib/redux/services/categoriesApi";

/**
 * The four figures at the top of category management, in the same shape as the
 * users dashboard's cards: a neutral icon chip and one number.
 *
 * Categories arrive as a plain array rather than a page, so every figure is a
 * count of the whole set — there is no "of the current page" caveat here.
 */

export function CategoryStatCards({
  categories,
}: {
  categories: CategoryResponse[];
}) {
  const total = categories.length;
  const active = categories.filter((c) => c.isActive).length;
  const problems = categories.filter((c) => c.scope === "PROBLEM").length;
  const showcases = categories.filter((c) => c.scope === "SHOWCASE").length;

  const stats = [
    {
      title: "Total Categories",
      value: total,
      subtext: `${total - active} inactive`,
      icon: Tags,
    },
    {
      title: "Active",
      value: active,
      subtext: "Offered in the pickers",
      icon: CircleSlash,
    },
    {
      title: "Problem Scope",
      value: problems,
      subtext: "Filed against problems",
      icon: MessageSquare,
    },
    {
      title: "Showcase Scope",
      value: showcases,
      subtext: "Filed against showcases",
      icon: LayoutTemplate,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.05 }}
          >
            <Card className="gap-3 rounded-2xl border border-slate-200 bg-white py-5 shadow-2xs transition-shadow hover:shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <CardHeader className="grid grid-cols-[1fr_auto] items-center gap-3 px-5">
                <CardTitle className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  {stat.title}
                </CardTitle>
                <div className="flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                  <Icon className="size-4" />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-0.5 px-5">
                <div className="text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
                  {stat.value}
                </div>
                <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.subtext}
                </CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
