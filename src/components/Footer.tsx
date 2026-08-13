"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import darkModeLogo from "@/app/devsolve_dark_mode-removebg-preview.png";
import mptcLight from "../../public/mptc-lightmode.png";
import mptcDark from "../../public/mptc-darkmode.png";
import istadLight from "../../public/istad-lightmode.png";
import istadDark from "../../public/istad-darkmode.png";
import cbrdLight from "../../public/crbd-lightmode.png";
import cbrdDark from "../../public/crbd-darkmode.png";
import { useIsDark } from "@/components/landing/SectionBackdrop";
import { cn } from "@/lib/utils";

/**
 * Site footer for the public pages.
 *
 * Every link here points at a route that exists. The previous version carried
 * five columns of which sixteen entries were `href="#"` — Features,
 * Documentation, Help and most of Company were headings over dead ends — plus
 * a social row aimed at the bare facebook.com / youtube.com / linkedin.com /
 * github.com homepages rather than any DevSolve account. Sections come back
 * when there is something to point them at.
 */

/** Grouped from the public routes the navbar already exposes. */
const footerNavSections = [
  {
    title: "PLATFORM",
    links: [
      { name: "Programs", href: "/programs" },
      { name: "Problems", href: "/problems" },
      { name: "Showcases", href: "/showcases" },
      { name: "Community", href: "/community" },
    ],
  },
  {
    title: "EXPLORE",
    links: [
      { name: "Hacktivity", href: "/hacktivity" },
      { name: "Leaderboard", href: "/leaderboard" },
      { name: "About", href: "/about" },
    ],
  },
  {
    title: "ACCOUNT",
    links: [
      { name: "Sign in", href: "/login" },
      { name: "Create an account", href: "/account-type" },
    ],
  },
];

/**
 * The programme's backers, each with its light and dark artwork.
 *
 * Imported rather than referenced by URL so the dimensions come from the files
 * themselves. Next reads them at build time and hands `<Image>` the real
 * width, height and blur data — no numbers to type, and none to get wrong.
 *
 * That mattered here: hand-written sizes had MPTC declared square against a
 * 5.18:1 lockup. With `w-auto`, the browser takes its aspect ratio from those
 * attributes, so a wide wordmark was being fitted into a square box and came
 * out a fraction of its proper size. Re-exported artwork also silently
 * invalidates any figure typed against the previous file.
 */
const partners = [
  {
    alt: "Ministry of Post and Telecommunications",
    light: mptcLight,
    dark: mptcDark,
  },
  { alt: "iSTAD", light: istadLight, dark: istadDark },
  { alt: "CBRD Fund", light: cbrdLight, dark: cbrdDark },
];

export default function Footer() {
  /* The wordmark is theme-dependent and next-themes only knows the theme
     after hydration, so the server render has to commit to the light file or
     the two disagree. `useIsDark` is the codebase's guard for exactly this:
     it reports `false` for one frame, then the real value. */
  const isDarkLogo = useIsDark();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    /* The brand rule along the top is the colour: a flat 4px band of the
       primary, which design.md allows where a gradient would not be. The page
       itself stays white. */
    <footer className="w-full border-t-4 border-blue-600 bg-white font-sans text-slate-700 dark:bg-neutral-950 dark:text-neutral-300">
      <div className="mx-auto max-w-7xl px-4 pb-8 pt-12 sm:px-6 sm:pt-16 lg:px-8">
        {/* Navigation leads, since that is what a footer is for: brand on the
            left, links on the right. The backers moved below it. */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12"
        >
          <div className="flex flex-col items-start gap-5 lg:col-span-5">
            {/* The navbar's wordmark, rendered the same way in both places —
                `mix-blend-multiply` drops the light file's white box. It is
                2.5:1, so the box has to be wide enough for the height to be
                reached: at the old h-11/w-40 the art fit to 44px and left the
                rest of the box empty. */}
            <Link href="/" aria-label="DevSolve home" className="group block">
              <span className="relative block h-16 w-44 sm:h-20 sm:w-56">
                <Image
                  key={isDarkLogo ? "dark-logo" : "light-logo"}
                  src={isDarkLogo ? darkModeLogo : "/devsolve-logo.png"}
                  alt="DevSolve"
                  fill
                  quality={95}
                  sizes="(min-width: 640px) 224px, 176px"
                  className={cn(
                    "object-contain object-left transition-transform duration-200 group-hover:scale-[1.03]",
                    !isDarkLogo && "mix-blend-multiply",
                  )}
                />
              </span>
            </Link>

            <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-neutral-400">
              Bug bounty and vulnerability disclosure platform for developers,
              security engineers, and organizations. Built to find
              vulnerabilities before attackers do.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 text-left sm:grid-cols-3 lg:col-span-7">
            {footerNavSections.map((section) => (
              <div key={section.title} className="flex flex-col gap-3">
                <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-neutral-100">
                  <span
                    aria-hidden="true"
                    className="h-3 w-0.5 rounded-full bg-blue-600"
                  />
                  {section.title}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className="text-sm font-normal text-slate-600 transition-colors hover:text-blue-600 dark:text-neutral-400 dark:hover:text-blue-400"
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

        {/* Backers sit under the navigation, near the legal line, instead of
            heading the whole footer as a banner. */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mt-12 border-t border-slate-200/70 pt-10 dark:border-neutral-800/80"
        >
          <h2 className="mb-8 text-center text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            Sponsors and organizers
          </h2>

          {/* Sized by height alone. A `max-w` cap here is what shrank MPTC:
              its lockup is 5.18:1, so at a 64px row it wants 332px of width,
              the cap pulled that back to 260px, and the height came down to
              50px with it while the 2.7:1 logos kept the full 64. */}
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            {partners.map((partner) => {
              const art = isDarkLogo ? partner.dark : partner.light;

              return (
                <div
                  key={partner.alt}
                  className="flex h-12 items-center sm:h-16"
                >
                  <Image
                    key={art.src}
                    src={art}
                    alt={partner.alt}
                    quality={95}
                    sizes="(min-width: 640px) 340px, 260px"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
              );
            })}
          </div>
        </motion.section>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200/70 pt-6 text-sm text-slate-500 sm:flex-row dark:border-neutral-800/80 dark:text-neutral-500">
          <p>© {new Date().getFullYear()} DevSolve. All rights reserved.</p>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-xs transition-colors hover:bg-blue-700"
          >
            <ArrowUp className="size-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
