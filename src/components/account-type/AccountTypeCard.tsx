"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccountTypeButton from "./AccountTypeButton";
import type { FeatureItem } from "@/lib/constants/auth";

interface AccountTypeCardProps {
  title: string;
  badgeLabel: string;
  badgeBgClass: string;
  badgeTextClass: string;
  badgeBorderClass: string;
  hoverShadowClass: string;
  hoverBorderClass: string;
  gradientClass: string;
  hoverTitleColorClass: string;
  iconBgClass: string;
  iconBorderClass: string;
  iconColorClass: string;
  lottieSrc: string;
  features: FeatureItem[];
  buttonLabel: string;
  buttonRole: "user" | "company";
  buttonHref: string;
  buttonTheme: "blue" | "emerald";
  variants: Variants;
}

export function AccountTypeCard({
  title,
  badgeLabel,
  badgeBgClass,
  badgeTextClass,
  badgeBorderClass,
  hoverShadowClass,
  hoverBorderClass,
  gradientClass,
  hoverTitleColorClass,
  iconBgClass,
  iconBorderClass,
  iconColorClass,
  lottieSrc,
  features,
  buttonLabel,
  buttonRole,
  buttonHref,
  buttonTheme,
  variants,
}: AccountTypeCardProps) {
  return (
    <motion.div variants={variants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card
        className={`group relative bg-white border border-slate-200/80 rounded-3xl shadow-xs ${hoverShadowClass} ${hoverBorderClass} transition-all duration-300 flex flex-col justify-between overflow-hidden h-full`}
      >
        {/* Top Gradient Highlight */}
        <div
          className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${gradientClass} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
        />

        {/* Top Right Badge */}
        <div className="absolute top-6 right-6 z-10">
          <Badge
            className={`${badgeBgClass} ${badgeTextClass} ${badgeBorderClass} font-medium text-xs rounded-full px-3 py-1`}
          >
            {badgeLabel}
          </Badge>
        </div>

        <CardContent className="flex flex-col justify-between h-full">
          <div>
            {/* Lottie Animation */}
            <div className="w-full flex justify-center items-center">
              <div className="w-48 h-48 sm:w-72 sm:h-72 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <DotLottieReact src={lottieSrc} loop autoplay />
              </div>
            </div>

            <h2
              className={`text-2xl font-bold text-slate-900 mb-2 tracking-tight ${hoverTitleColorClass} transition-colors`}
            >
              {title}
            </h2>

            {/* Divider */}
            <div className="h-px w-full bg-slate-100 mb-6" />

            {/* Features List */}
            <ul className="space-y-3.5 mb-8">
              {features.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.08 }}
                    className="flex items-center gap-3 text-sm text-slate-700"
                  >
                    <div
                      className={`w-6 h-6 rounded-full ${iconBgClass} ${iconBorderClass} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${iconColorClass}`} />
                    </div>
                    <span className="font-medium text-slate-700">{item.text}</span>
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <AccountTypeButton
              label={buttonLabel}
              role={buttonRole}
              href={buttonHref}
              theme={buttonTheme}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
