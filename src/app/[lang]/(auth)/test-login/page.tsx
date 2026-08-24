"use client";

import React from "react";
import { ShieldCheck, Sparkles, Zap } from "lucide-react";
import { AuthHeroPanel, type HeroBadge } from "@/components/auth/AuthHeroPanel";
import { TestLoginForm } from "@/components/auth/TestLoginForm";

/**
 * /test-login — static sign-in screen, no auth wired up.
 * Shares the register screens' two-panel shell so the flows stay visually
 * consistent; the form itself lives in `TestLoginForm`.
 */

const LOGIN_HERO_BADGES: HeroBadge[] = [
  {
    icon: ShieldCheck,
    label: "Secure by Default",
    borderColorClass: "border-blue-200/80",
    iconColorClass: "text-blue-600",
  },
  {
    icon: Zap,
    label: "Pick Up Where You Left Off",
    borderColorClass: "border-emerald-200/80",
    iconColorClass: "text-emerald-600",
  },
  {
    icon: Sparkles,
    label: "One Account, Everywhere",
    borderColorClass: "border-indigo-200/80",
    iconColorClass: "text-indigo-600",
  },
];

export default function TestLoginPage() {
  return (
    <div className="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased overflow-x-hidden">
      {/* LEFT PANEL - Hero Section */}
      <AuthHeroPanel
        lottieSrc="/lottie/researcher.lottie"
        badges={LOGIN_HERO_BADGES}
        headline="Good to see you again"
        description="Sign in to pick up your reports, track your bounties, and get back to the hunt."
        glowColor1="bg-blue-400/20"
        glowColor2="bg-emerald-400/20"
        backHref="/"
        backLabel="Back to home"
      />

      {/* RIGHT PANEL - Login Form */}
      <div className="bg-white p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center items-center overflow-y-auto">
        <TestLoginForm />
      </div>
    </div>
  );
}
