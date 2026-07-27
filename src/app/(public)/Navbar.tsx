"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Program', href: '/' },
    { name: 'Hacker activity', href: '/' },
    { name: 'Forum', href: '/' },
    { name: 'Leader board', href: '/' },
    { name: 'About', href: '/' },
];

const Navbar = () => {
    const [hoveredPath, setHoveredPath] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <header className="w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-[100] transition-colors duration-200">
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
                        <span className="text-base font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors">
                            DevSolve
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-1 relative" onMouseLeave={() => setHoveredPath(null)}>
                        {navLinks.map((link, index) => {
                            const isActive = pathname === link.href && index === 0;
                            const isHovered = hoveredPath === link.name;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onMouseEnter={() => setHoveredPath(link.name)}
                                    className="relative text-sm font-medium text-slate-600 hover:text-slate-900 px-3.5 py-2 rounded-full transition-colors duration-200"
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
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Toggle theme"
                            className="w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                        >
                            <Moon className="w-4 h-4" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>

                        {/* CTA Button */}
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                render={<Link href="/account-type" />}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-9 rounded-full font-semibold text-sm tracking-tight shadow-md shadow-blue-500/20 group flex items-center gap-1.5 cursor-pointer"
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
                            className="lg:hidden w-9 h-9 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100"
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
                        className="lg:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md overflow-hidden px-4 py-4"
                    >
                        <nav className="flex flex-col gap-1.5">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-sm font-medium text-slate-700 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <div className="pt-2 mt-1 border-t border-slate-100">
                                <Button
                                    render={<Link href="/account-type" onClick={() => setMobileMenuOpen(false)} />}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-sm h-10 shadow-md shadow-blue-500/20"
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