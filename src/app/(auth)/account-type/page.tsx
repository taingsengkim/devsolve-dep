"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { authClient } from "@/lib/auth/auth-client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
    ShieldCheck,
    Lock,
    Trophy,
    Users,
    PlusCircle,
    Inbox,
    BarChart3,
    UserCheck,
    User,
    Building2,
    HelpCircle,
    ArrowRight,
    Sparkles,
    Loader2
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AccountTypeButton from "@/components/account-type/AccountTypeButton";

export default function AccountTypeSelectionPage() {
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    useEffect(() => {
        const handleResetLoading = () => {
            setIsLoggingIn(false);
        };

        window.addEventListener("pageshow", handleResetLoading);
        window.addEventListener("focus", handleResetLoading);

        return () => {
            window.removeEventListener("pageshow", handleResetLoading);
            window.removeEventListener("focus", handleResetLoading);
        };
    }, []);

    const handleLogin = async () => {
        setIsLoggingIn(true);
        try {
            const result = await authClient.signIn.oauth2({
                providerId: "keycloak",
                callbackURL: "/",
                disableRedirect: true,
            });

            if (result?.error) {
                console.error("[Auth] Keycloak sign-in failed:", result.error);
                setIsLoggingIn(false);
                return;
            }

            if (result?.data?.url) {
                console.log("[Auth] Redirecting to Keycloak:", result.data.url);
                window.location.href = result.data.url;
            } else {
                console.error("[Auth] No redirect URL returned:", result);
                setIsLoggingIn(false);
            }
        } catch (error) {
            console.error("[Auth] Keycloak sign-in error:", error);
            setIsLoggingIn(false);
        }
    };

    const userFeatures = [
        { icon: ShieldCheck, text: "Discover & report bug bounty programs" },
        { icon: Lock, text: "Access private and public vulnerability programs" },
        { icon: Trophy, text: "Build security reputation & earn financial rewards" },
        { icon: Users, text: "Connect with a global security researcher community" },
    ];

    const companyFeatures = [
        { icon: PlusCircle, text: "Create & manage custom bug bounty programs" },
        { icon: Inbox, text: "Receive, triage, and manage vulnerability reports" },
        { icon: BarChart3, text: "Track program performance & security metrics" },
        { icon: UserCheck, text: "Manage security team access & submissions" },
    ];

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
                    <button
                        onClick={handleLogin}
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
                    <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Card className="group relative bg-white border border-slate-200/80 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
                            {/* Top Gradient Highlight */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Top Right Badge */}
                            <div className="absolute top-6 right-6 z-10">
                                <Badge className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-50 font-medium text-xs rounded-full px-3 py-1">
                                    For Researchers
                                </Badge>
                            </div>

                            <CardContent className="flex flex-col justify-between h-full">
                                <div>
                                    {/* Prominent Lottie Animation */}
                                    <div className="w-full flex justify-center items-center ">
                                        <div className="w-48 h-48 sm:w-72 sm:h-72 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                            <DotLottieReact
                                                src="/lottie/researcher.lottie"
                                                loop
                                                autoplay
                                            />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
                                        Security Researcher
                                    </h2>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-slate-100 mb-6" />

                                    {/* Features List */}
                                    <ul className="space-y-3.5 mb-8">
                                        {userFeatures.map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.2 + index * 0.08 }}
                                                    className="flex items-center gap-3 text-sm text-slate-700"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                                                        <Icon className="w-3.5 h-3.5 text-blue-600" />
                                                    </div>
                                                    <span className="font-medium text-slate-700">{item.text}</span>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    <AccountTypeButton label="Continue as Researcher" role="user" href="/register/user" theme="blue" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Company / Organization Card */}
                    <motion.div variants={cardVariants} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Card className="group relative bg-white border border-slate-200/80 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
                            {/* Top Gradient Highlight */}
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Top Right Badge */}
                            <div className="absolute top-6 right-6 z-10">
                                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 font-medium text-xs rounded-full px-3 py-1">
                                    For Companies
                                </Badge>
                            </div>

                            <CardContent className="flex flex-col justify-between h-full">
                                <div>
                                    {/* Prominent Lottie Animation */}
                                    <div className="w-full flex justify-center items-center ">
                                        <div className="w-48 h-48 sm:w-72 sm:h-72 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                                            <DotLottieReact
                                                src="/lottie/company.lottie"
                                                loop
                                                autoplay
                                            />
                                        </div>
                                    </div>

                                    <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight group-hover:text-emerald-600 transition-colors">
                                        Organization / Company
                                    </h2>
        

                                    {/* Divider */}
                                    <div className="h-px w-full bg-slate-100 mb-6" />

                                    {/* Features List */}
                                    <ul className="space-y-3.5 mb-8">
                                        {companyFeatures.map((item, index) => {
                                            const Icon = item.icon;
                                            return (
                                                <motion.li
                                                    key={index}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: 0.35 + index * 0.08 }}
                                                    className="flex items-center gap-3 text-sm text-slate-700"
                                                >
                                                    <div className="w-6 h-6 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                                                        <Icon className="w-3.5 h-3.5 text-emerald-600" />
                                                    </div>
                                                    <span className="font-medium text-slate-700">{item.text}</span>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                </div>

                                {/* Action Button */}
                                <div className="pt-2">
                                    <AccountTypeButton label="Continue as Organization" role="company" href="/register/company" theme="emerald" />
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                </motion.div>
            </div>

            {/* Footer Navigation / Support Link
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-8 sm:mt-12 text-center text-xs sm:text-sm text-slate-500 flex items-center gap-2"
            >
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Not sure which account type is right for you?</span>
                <Link href="#" className="text-blue-600 hover:text-blue-700 hover:underline font-semibold inline-flex items-center gap-0.5">
                    <span>Read guide</span>
                    <ArrowRight className="w-3 h-3" />
                </Link>
            </motion.div> */}
        </div>
    );
}