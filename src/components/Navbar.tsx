"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import DynamicNavigation from "@/components/lightswind-pro/dynamic-navigation";
import { ThemeToggle } from '@/components/motion/theme-toggle';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth/auth-client';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Programs', href: '/programs' },
    { name: 'Discussions', href: '/discussions' },
    { name: 'Community', href: '/community' },
    { name: 'Leaderboard', href: '/leaderboard' },
    { name: 'About', href: '/about' },
];

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const pathname = usePathname();

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

    return (
        <header className="sticky top-0 z-[100] w-full border-b border-border/80 bg-background/80 backdrop-blur-md transition-colors duration-200">
            <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <Image
                                src="/logo-1.png"
                                alt="DevSolve Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8 object-contain"
                                priority
                            />
                        </motion.div>
                        <span className="text-lg font-bold text-foreground tracking-tight transition-colors group-hover:text-blue-600">
                            DevSolve
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1 relative" onMouseLeave={() => setHoveredPath(null)}>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            const isHovered = hoveredPath === link.name;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onMouseEnter={() => setHoveredPath(link.name)}
                                    className="relative text-base font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full transition-colors duration-200"
                                >
                                    {isHovered && (
                                        <motion.span
                                            layoutId="navbar-hover"
                                            className="absolute inset-0 bg-slate-100 rounded-full -z-10"
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ type: "spring", stiffness: 350, damping: 25 }}
                                        />
                                    )}
                                    <span className={isActive ? "text-slate-900 font-semibold" : ""}>{link.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-2.5">
                        {/* Dark Mode Toggle */}
                        <ThemeToggle
                            variant="circle-blur"
                            start="bottom-up"
                            className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            iconClassName="h-4 w-4"
                        />

                        {/* Log in Button */}
                        <Button
                            variant="ghost"
                            onClick={handleLogin}
                            disabled={isLoggingIn}
                            className="h-9 cursor-pointer rounded-full px-4 text-base font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-10"
                        >
                            {isLoggingIn ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Connecting...</span>
                                </span>
                            ) : (
                                "Log in"
                            )}
                        </Button>

                        {/* CTA Button */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                nativeButton={false}
                                render={<Link href="/account-type" />}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-9 sm:h-10 rounded-full font-semibold text-base tracking-tight shadow-md shadow-blue-500/20 group flex items-center gap-1.5 cursor-pointer"
                            >
                                <span>Get started</span>
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </Button>
                        </motion.div>

                        {/* Mobile Menu Toggle Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
                            aria-label="Toggle mobile menu"
                        >
                            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>

                </div>
            </div>

            {/* Mobile Nav Menu Drawer */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-border bg-background/95 px-4 py-4 backdrop-blur-md lg:hidden"
                    >
                        <nav className="flex flex-col gap-1.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="rounded-xl px-3 py-2.5 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="mt-1 flex flex-col gap-2 border-t border-border pt-2">
                                <div className="flex justify-end pb-1">
                                    <ThemeToggle
                                        variant="circle-blur"
                                        start="bottom-up"
                                        className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                                        iconClassName="h-4 w-4"
                                    />
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        handleLogin();
                                    }}
                                    disabled={isLoggingIn}
                                    className="h-10 w-full rounded-full font-semibold text-base"
                                >
                                    {isLoggingIn ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>Connecting...</span>
                                        </span>
                                    ) : (
                                        "Log in"
                                    )}
                                </Button>
                                <Button
                                    nativeButton={false}
                                    render={<Link href="/account-type" onClick={() => setMobileMenuOpen(false)} />}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-base h-10 shadow-md shadow-blue-500/20"
                                >
                                    Get started
                                </Button>
                            </div>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Navbar;
