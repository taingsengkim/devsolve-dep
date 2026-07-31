"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { Loader2 } from "lucide-react";
import { useKeycloakLogin } from "@/hooks/useKeycloakLogin";
import { USER_FEATURES, COMPANY_FEATURES } from "@/lib/constants/auth";
import { AccountTypeCard } from "@/components/account-type/AccountTypeCard";

export default function AccountTypeSelectionPage() {
  const { isLoggingIn, handleLogin } = useKeycloakLogin();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <div className="min-h-[100dvh] bg-slate-50/60 relative overflow-hidden flex flex-col justify-between items-center px-4 py-8 sm:px-6 lg:px-8">
      {/* Background Ambient Glows */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 overflow-hidden -z-10">
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute -top-32 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"
        />
      </div>

      {/* Top Brand Bar */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl flex justify-between items-center mb-6 sm:mb-10"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo-1.png"
            alt="DevSolve Logo"
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            priority
          />
          <span>DevSolve</span>
        </Link>

        <div className="text-xs sm:text-sm text-slate-600 font-medium flex items-center gap-1">
          <span>Already have an account?</span>{" "}
          <button
            onClick={() => handleLogin("/")}
            disabled={isLoggingIn}
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors cursor-pointer disabled:opacity-50 inline-flex items-center gap-1"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Connecting...</span>
              </>
            ) : (
              "Login"
            )}
          </button>
        </div>
      </motion.div>

      {/* Main Content Container */}
      <div className="w-full max-w-5xl my-auto flex flex-col items-center">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center mb-10 sm:mb-12 max-w-xl mx-auto"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Choose account type
          </h1>
        </motion.div>

        {/* Cards Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl"
        >
          {/* Researcher / User Card */}
          <AccountTypeCard
            title="Security Researcher"
            badgeLabel="For Researchers"
            badgeBgClass="bg-blue-50"
            badgeTextClass="text-blue-700"
            badgeBorderClass="border-blue-100 hover:bg-blue-50"
            hoverShadowClass="hover:shadow-xl hover:shadow-blue-500/5"
            hoverBorderClass="hover:border-blue-500/30"
            gradientClass="from-blue-500 to-indigo-500"
            hoverTitleColorClass="group-hover:text-blue-600"
            iconBgClass="bg-blue-50"
            iconBorderClass="border border-blue-100"
            iconColorClass="text-blue-600"
            lottieSrc="/lottie/researcher.lottie"
            features={USER_FEATURES}
            buttonLabel="Continue as Researcher"
            buttonRole="user"
            buttonHref="/register/user"
            buttonTheme="blue"
            variants={cardVariants}
          />

          {/* Company / Organization Card */}
          <AccountTypeCard
            title="Organization / Company"
            badgeLabel="For Companies"
            badgeBgClass="bg-emerald-50"
            badgeTextClass="text-emerald-700"
            badgeBorderClass="border-emerald-100 hover:bg-emerald-50"
            hoverShadowClass="hover:shadow-xl hover:shadow-emerald-500/5"
            hoverBorderClass="hover:border-emerald-500/30"
            gradientClass="from-emerald-500 to-teal-500"
            hoverTitleColorClass="group-hover:text-emerald-600"
            iconBgClass="bg-emerald-50"
            iconBorderClass="border border-emerald-100"
            iconColorClass="text-emerald-600"
            lottieSrc="/lottie/company.lottie"
            features={COMPANY_FEATURES}
            buttonLabel="Continue as Organization"
            buttonRole="company"
            buttonHref="/register/company"
            buttonTheme="emerald"
            variants={cardVariants}
          />
        </motion.div>
      </div>
    </div>
  );
}