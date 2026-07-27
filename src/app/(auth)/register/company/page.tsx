"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function CompanyRegister() {
    return (
        <div className="min-h-[100dvh] bg-slate-50/60 relative overflow-hidden flex flex-col justify-between items-center px-4 py-8 sm:px-6 lg:px-8">
            {/* Background Ambient Glows */}
            <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 overflow-hidden -z-10">
                <motion.div
                    animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
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
                <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight text-slate-900 hover:opacity-80 transition-opacity">
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
                    <Link
                        href="/account-type"
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                    >
                        Register
                    </Link>
                </div>
            </motion.div>

            {/* Main Content */}
            
        </div>
    );
}