"use client";

import React from "react";
import { TrendingUp, Zap, Users } from "lucide-react";
import { AuthHeroPanel, type HeroBadge } from "@/components/auth/AuthHeroPanel";
import { UserRegisterForm } from "@/components/auth/UserRegisterForm";

const USER_HERO_BADGES: HeroBadge[] = [
  {
    icon: TrendingUp,
    label: "Discover Programs",
    borderColorClass: "border-blue-200/80",
    iconColorClass: "text-blue-600",
  },
  {
    icon: Zap,
    label: "Build Reputation",
    borderColorClass: "border-emerald-200/80",
    iconColorClass: "text-emerald-600",
  },
  {
    icon: Users,
    label: "Strong Community",
    borderColorClass: "border-indigo-200/80",
    iconColorClass: "text-indigo-600",
  },
];

export default function UserRegisterPage() {
  return (
    <div className="min-h-[100dvh] w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans antialiased overflow-x-hidden">
      {/* LEFT PANEL - Hero Section */}
      <AuthHeroPanel
        lottieSrc="/lottie/researcher.lottie"
        badges={USER_HERO_BADGES}
        headline="Join thousands of user"
        description="Start discovering vulnerabilities, earning bounties, and building your security career today."
        glowColor1="bg-blue-400/20"
        glowColor2="bg-emerald-400/20"
      />

      {/* RIGHT PANEL - User Registration Form */}
      <div className="bg-white p-6 sm:p-10 lg:p-12 xl:p-16 flex flex-col justify-center items-center overflow-y-auto">
        <UserRegisterForm />
      </div>
    </div>
  );
}
