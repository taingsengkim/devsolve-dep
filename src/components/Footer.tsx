"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUp, Globe } from "lucide-react";
import EtherWavesBackground from "@/components/lightswind/ether-waves";
import WavyRippleBackground from "@/components/lightswind/wavy-ripple-background";
import SmoothCursor from "@/components/lightswind/smooth-cursor";

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <polygon points="10 15 15 12 10 9 10 15" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    width="16"
    height="16"
    stroke="currentColor"
    strokeWidth="2"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const footerNavSections = [
  {
    title: "PRODUCT",
    links: [
      { name: "Programs", href: "/programs" },
      { name: "Hacker Activity", href: "/hacktivity" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "Submit Report", href: "/account-type" },
    ],
  },
  {
    title: "FEATURES",
    links: [
      { name: "Vulnerability Management", href: "#" },
      { name: "Bounty Matrix", href: "#" },
      { name: "Responsible Disclosure", href: "#" },
      { name: "Real-time Feed", href: "#" },
    ],
  },
  {
    title: "DOCUMENTATION",
    links: [
      { name: "Introduction", href: "#" },
      { name: "Platform Features", href: "#" },
      { name: "Developer Reference", href: "#" },
      { name: "Security Policy", href: "#" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { name: "About Us", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Sponsors & Partners", href: "#" },
      { name: "Careers", href: "#" },
    ],
  },
  {
    title: "HELP",
    links: [
      { name: "Support Center", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Privacy Policy", href: "#" },
      { name: "FAQ", href: "#" },
    ],
  },
];

export default function Footer() {
  const [isFooterHovered, setIsFooterHovered] = React.useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      onMouseEnter={() => setIsFooterHovered(true)}
      onMouseLeave={() => setIsFooterHovered(false)}
      className="w-full bg-[#FAFBFD] border-t border-slate-200/70 text-slate-700 relative overflow-hidden font-sans dark:bg-neutral-950 dark:border-neutral-800/80 dark:text-neutral-300"
    >
      {/* Smooth Cursor Effect on Footer Hover */}
      {isFooterHovered && (
        <SmoothCursor
          color="#0066FF"
          size={20}
          glowEffect={true}
          showTrail={true}
          trailLength={4}
        />
      )}
      {/* Dynamic Interactive Background Layers */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <EtherWavesBackground
          linesGradient={["#0066FF", "#00C853", "#3B82F6", "#10B981"]}
          animationSpeed={0.6}
          transparentBg={true}
          interactive={true}
          lineCount={6}
          parallax={true}
        />
      </div>

      {/* Wavy Ripple Background at bottom of footer */}
      <div className="absolute bottom-0 left-0 right-0 h-72 pointer-events-none opacity-40 z-0 overflow-hidden">
        <WavyRippleBackground
          waveColor="#0066FF"
          speed={0.6}
          frequency={2.8}
          ringSharpness={0.4}
          maxOpacity={0.35}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 relative z-10">
        {/* Sponsors and Organized By Group */}
        <section className="text-center pb-10 border-b border-slate-200/70 dark:border-neutral-800/80">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-xl sm:text-2xl font-extrabold text-[#0066FF] tracking-tight mb-6 sm:mb-8"
          >
            Our <span className="text-[#00C853]">Sponsors</span> And Organized
            By
          </motion.h2>

          {/* Logo Group Container */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-4xl mx-auto flex flex-col items-center gap-6 sm:gap-8"
          >
            {/* 1. Logo_MPTC.png (Top Centered) */}
            <div className="w-full flex justify-center">
              <Image
                src="/Logo_MPTC.png"
                alt="Ministry of Post and Telecommunications"
                width={600}
                height={150}
                className="h-16 sm:h-24 max-w-full w-auto object-contain transition-transform hover:scale-[1.02]"
              />
            </div>

            {/* 2 & 3. istad.png and CBRD-Logo-Final.png (Bottom Row Side by Side) */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 w-full">
              {/* 2. istad.png */}
              <Image
                src="/istad.png"
                alt="iSTAD"
                width={340}
                height={110}
                className="h-12 sm:h-16 max-w-full w-auto object-contain transition-transform hover:scale-[1.02]"
              />
              {/* 3. CBRD-Logo-Final.png */}
              <Image
                src="/CBRD-Logo-Final.png"
                alt="CBRD Fund"
                width={340}
                height={110}
                className="h-12 sm:h-16 max-w-full w-auto object-contain transition-transform hover:scale-[1.02]"
              />
            </div>
          </motion.div>
        </section>

        {/* Main Footer Section: Brand Info + 5-Column Navigation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 py-10 sm:py-12 border-b border-slate-200/70 dark:border-neutral-800/80"
        >
          {/* Brand Info Column (lg:col-span-4) */}
          <div className="lg:col-span-4 flex flex-col items-start gap-4">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo-1.png"
                alt="DevSolve Logo"
                width={36}
                height={36}
                className="w-9 h-9 object-contain transition-transform group-hover:scale-105"
              />
              <span className="text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-600 transition-colors dark:text-neutral-100 dark:group-hover:text-blue-400">
                DevSolve
              </span>
            </Link>

            {/* Tagline & Subtitle */}
            <p className="text-sm text-slate-600 leading-relaxed font-normal max-w-md dark:text-neutral-400">
              Bug bounty and vulnerability disclosure platform for developers,
              security engineers, and organizations. Built to find
              vulnerabilities before attackers do.
            </p>

            {/* Status Pill Quote */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs font-medium text-slate-700 shadow-2xs dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                &ldquo;Your bug bounty stack, without the hassle&rdquo;
              </span>
            </div>

            {/* Social Icons Row */}
            <div className="flex items-center gap-2.5 mt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-2xs"
              >
                <YoutubeIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all shadow-2xs"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100 transition-all shadow-2xs"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Website"
                className="w-8 h-8 rounded-full bg-white hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center text-slate-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-800 dark:text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all shadow-2xs"
              >
                <Globe className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* 5-Column Navigation Grid (lg:col-span-8) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 text-left">
            {footerNavSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase dark:text-neutral-100">
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-slate-600 hover:text-blue-600 font-normal transition-colors dark:text-neutral-400 dark:hover:text-blue-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom Copyright & Back To Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500 dark:text-neutral-500">
          <p>
            © Copyright {new Date().getFullYear()}, All rights reserved.
            DevSolve - Built for Security Engineers &amp; Ethical Hackers
          </p>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-2xs flex items-center justify-center transition-colors cursor-pointer dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
