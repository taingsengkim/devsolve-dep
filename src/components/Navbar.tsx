"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  ChevronDown,
  Lightbulb,
  Loader2,
  Menu,
  Moon,
  Sun,
  Trophy,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import darkModeLogo from "@/app/devsolve_dark_mode-removebg-preview.png";
import { ThemeToggle, useThemeToggle } from "@/components/motion/theme-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { cn } from "@/lib/utils";

type NavItem = {
  name: string;
  href: string;
  description?: string;
  icon?: "problem" | "showcase";
};

type NavLink = {
  name: string;
  href?: string;
  items?: NavItem[];
};

const navLinks: NavLink[] = [
  { name: "Home", href: "/" },
  { name: "Programs", href: "/programs" },
  { name: "Hacker Activity", href: "/hacktivity" },
  {
    name: "Community",
    href: "/community",
    items: [
      {
        name: "Problem",
        href: "/problems",
        description: "Post bugs, blockers, and security questions.",
        icon: "problem",
      },
      {
        name: "Showcase",
        href: "/showcases",
        description: "Share product wins, demos, and build highlights.",
        icon: "showcase",
      },
    ],
  },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "About", href: "/about" },
];

// Scrolling down only retracts the island once the reader is past this much of
// the page, so a short flick near the top never makes the nav flicker away.
const HIDE_AFTER = 160;

function isHrefActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function isNavLinkActive(pathname: string, link: NavLink) {
  if (link.href) {
    return isHrefActive(pathname, link.href);
  }

  return link.items?.some((item) => isHrefActive(pathname, item.href)) ?? false;
}

function CommunityMenuIcon({ icon }: { icon?: NavItem["icon"] }) {
  if (icon === "showcase") {
    return <Trophy className="size-4.5" />;
  }

  return <Lightbulb className="size-4.5" />;
}

const Navbar = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [communityMenuOpen, setCommunityMenuOpen] = useState(false);
  const [mobileCommunityOpen, setMobileCommunityOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isDark, mounted, toggle } = useThemeToggle({
    variant: "rectangle",
    start: "bottom-up",
  });
  const isDarkLogo = mounted && isDark;
  const logoSrc = isDarkLogo ? darkModeLogo : "/devsolve-logo.png";

  // The header is a fixed island with no backdrop band, so it always overlaps
  // page content. To keep the screen clear it retracts while the reader moves
  // down the page and springs back the moment they scroll up.
  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;

      const currentY = window.scrollY;
      const delta = currentY - previousY;

      setScrolled(currentY > 4);

      // Ignore sub-pixel jitter and rubber-band overscroll, and never retract
      // over the first screenful — the island should be there on arrival.
      if (Math.abs(delta) > 4 && currentY > 0) {
        setHidden(delta > 0 && currentY > HIDE_AFTER);
      }

      previousY = currentY;
    };

    const handleScroll = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  // An open menu must never be dragged off-screen with the island.
  useEffect(() => {
    if (mobileMenuOpen || communityMenuOpen) {
      setHidden(false);
    }
  }, [mobileMenuOpen, communityMenuOpen]);

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

  // Hover intent: the panel hangs a few pixels below the trigger, so an
  // instant close would drop the menu while the pointer crosses the gap.
  const communityCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const openCommunityMenu = () => {
    if (communityCloseTimer.current) {
      clearTimeout(communityCloseTimer.current);
      communityCloseTimer.current = null;
    }

    setCommunityMenuOpen(true);
  };

  const closeCommunityMenu = (delay = 0) => {
    if (communityCloseTimer.current) {
      clearTimeout(communityCloseTimer.current);
    }

    communityCloseTimer.current = setTimeout(
      () => setCommunityMenuOpen(false),
      delay,
    );
  };

  useEffect(
    () => () => {
      if (communityCloseTimer.current) {
        clearTimeout(communityCloseTimer.current);
      }
    },
    [],
  );

  // Navigating away should never leave a menu hanging over the new page.
  useEffect(() => {
    setCommunityMenuOpen(false);
    setMobileMenuOpen(false);
    setMobileCommunityOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!communityMenuOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCommunityMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [communityMenuOpen]);

  const handleLogin = async () => {
    if (isLoggingIn) {
      return;
    }

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

      if (!result?.data?.url) {
        console.error("[Auth] No redirect URL returned:", result);
        setIsLoggingIn(false);
        return;
      }

      window.location.assign(result.data.url);
    } catch (error) {
      console.error("[Auth] Keycloak sign-in error:", error);
      setIsLoggingIn(false);
    }
  };

  return (
    // Fixed and out of flow: no full-width band, just the island floating over
    // the page. `--navbar-height` is what reserves room for it in the layout.
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={hidden ? { y: "-115%", opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.9 }}
      className="fixed inset-x-0 top-0 z-[100] w-full"
    >
      <div className="pointer-events-none">
        <div className="mx-auto w-full max-w-7xl px-4 py-3 sm:px-6">
          {/* Translucent + blurred, because page content now passes directly
              behind it rather than under an opaque band. */}
          <div
            className={cn(
              "pointer-events-auto flex min-h-16 items-center rounded-2xl border px-4 backdrop-blur-xl transition-shadow duration-300 sm:px-6",
              "border-slate-200/80 bg-white/90 dark:border-slate-800/80 dark:bg-slate-950/85",
              scrolled
                ? "shadow-[0_0_0_1px_rgba(30,41,59,0.05),0_14px_34px_-12px_rgba(15,23,42,0.45)] dark:shadow-[0_16px_38px_rgba(2,6,23,0.5)]"
                : "shadow-[0_0_0_1px_rgba(30,41,59,0.04),0_8px_24px_-14px_rgba(15,23,42,0.35)] dark:shadow-[0_10px_30px_rgba(2,6,23,0.28)]",
            )}
          >
            <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4">
              <Link
                href="/"
                aria-label="Go to DevSolve homepage"
                className="group flex shrink-0 items-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <motion.div
                  whileHover={{ scale: 1.025 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 24,
                  }}
                  className="flex items-center"
                >
                  <span className="relative block h-10 w-35 sm:h-11 sm:w-38.5">
                    <Image
                      key={isDarkLogo ? "dark-logo" : "light-logo"}
                      src={logoSrc}
                      alt="DevSolve"
                      fill
                      priority
                      sizes="(min-width: 640px) 154px, 140px"
                      className={cn(
                        "origin-left object-contain object-left transition-transform scale-[1.15]",
                        isDarkLogo && "translate-x-[2px]",
                      )}
                    />
                  </span>
                </motion.div>
              </Link>

              <nav
                aria-label="Main navigation"
                className="hidden min-w-0 items-center justify-center lg:flex"
              >
                <div className="flex items-center gap-1">
                  {navLinks.map((link) => {
                    const isActive = isNavLinkActive(pathname, link);

                    if (link.items?.length) {
                      return (
                        <div
                          key={link.name}
                          className="relative"
                          onMouseEnter={openCommunityMenu}
                          onMouseLeave={() => closeCommunityMenu(140)}
                        >
                          <div
                            className={cn(
                              "group relative inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200",
                              isActive || communityMenuOpen
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
                            )}
                          >
                            {/* The label navigates straight to /community;
                                the chevron is the only thing that toggles
                                the flyout, so a click never fights a nav. */}
                            <Link
                              href={link.href ?? "/community"}
                              aria-current={isActive ? "page" : undefined}
                              onClick={() => {
                                setCommunityMenuOpen(false);
                                setMobileMenuOpen(false);
                              }}
                              className="inline-flex h-9 items-center rounded-l-lg pl-4 pr-1.5"
                            >
                              {link.name}
                            </Link>
                            <button
                              type="button"
                              aria-expanded={communityMenuOpen}
                              aria-haspopup="menu"
                              aria-label={`${communityMenuOpen ? "Close" : "Open"} ${link.name} menu`}
                              onClick={() => {
                                if (communityMenuOpen) {
                                  closeCommunityMenu();
                                } else {
                                  openCommunityMenu();
                                }
                              }}
                              className="inline-flex h-9 items-center rounded-r-lg pl-1.5 pr-4"
                            >
                              <ChevronDown
                                className={cn(
                                  "size-4 transition-transform duration-200",
                                  communityMenuOpen && "rotate-180",
                                )}
                              />
                            </button>

                            {isActive ? (
                              <motion.span
                                layoutId="navbar-active-indicator"
                                className="absolute -bottom-[8px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-blue-600 dark:bg-blue-400"
                                transition={{
                                  type: "spring",
                                  stiffness: 380,
                                  damping: 30,
                                }}
                              />
                            ) : null}
                          </div>

                          <AnimatePresence>
                            {communityMenuOpen ? (
                              <motion.div
                                role="menu"
                                aria-label={link.name}
                                initial={{ opacity: 0, y: -6, scale: 0.94 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{
                                  opacity: 0,
                                  y: -4,
                                  scale: 0.96,
                                  transition: { duration: 0.12 },
                                }}
                                transition={{
                                  type: "spring",
                                  stiffness: 460,
                                  damping: 32,
                                  mass: 0.7,
                                }}
                                style={{ transformOrigin: "top center" }}
                                // Padding, not margin: the gap under the
                                // trigger stays hoverable so the pointer can
                                // travel into the panel.
                                className="absolute left-1/2 top-full z-20 w-84 -translate-x-1/2 pt-2.5"
                              >
                                {/* Notch, tying the island back to its trigger */}
                                <span
                                  aria-hidden="true"
                                  className="absolute left-1/2 top-1.75 size-3 -translate-x-1/2 rotate-45 rounded-[3px] border-l border-t border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-950"
                                />

                                <div className="relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-2 shadow-[0_18px_44px_-14px_rgba(15,23,42,0.3)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_22px_50px_-16px_rgba(2,6,23,0.6)]">
                                  <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-linear-to-b from-blue-50/80 to-transparent dark:from-blue-500/10"
                                  />

                                  <p className="relative z-10 px-3 pb-1 pt-1.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-400 dark:text-slate-500">
                                    Start a discussion
                                  </p>

                                  <div className="relative z-10 flex flex-col gap-0.5">
                                    {link.items.map((item) => {
                                      const isItemActive = isHrefActive(
                                        pathname,
                                        item.href,
                                      );

                                      return (
                                        <Link
                                          key={item.href}
                                          href={item.href}
                                          role="menuitem"
                                          aria-current={
                                            isItemActive ? "page" : undefined
                                          }
                                          onClick={() => {
                                            setCommunityMenuOpen(false);
                                            setMobileMenuOpen(false);
                                          }}
                                          className={cn(
                                            "group/item flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 dark:focus-visible:ring-blue-500/40",
                                            isItemActive
                                              ? "bg-blue-50 dark:bg-blue-500/15"
                                              : "hover:bg-slate-50 dark:hover:bg-slate-900/80",
                                          )}
                                        >
                                          <span
                                            className={cn(
                                              "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset transition-colors duration-200",
                                              isItemActive
                                                ? "bg-blue-600 text-white ring-blue-600"
                                                : "bg-blue-50 text-blue-600 ring-blue-100 group-hover/item:bg-blue-600 group-hover/item:text-white group-hover/item:ring-blue-600 dark:bg-slate-900 dark:text-blue-300 dark:ring-slate-800 dark:group-hover/item:bg-blue-500 dark:group-hover/item:text-white dark:group-hover/item:ring-blue-500",
                                            )}
                                          >
                                            <CommunityMenuIcon
                                              icon={item.icon}
                                            />
                                          </span>

                                          <span className="min-w-0 flex-1">
                                            <span
                                              className={cn(
                                                "flex items-center gap-1.5 text-sm font-semibold",
                                                isItemActive
                                                  ? "text-blue-700 dark:text-blue-300"
                                                  : "text-slate-900 dark:text-slate-100",
                                              )}
                                            >
                                              {item.name}
                                              <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                                            </span>
                                            <span className="mt-0.5 block text-sm leading-5 text-slate-500 dark:text-slate-400">
                                              {item.description}
                                            </span>
                                          </span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    // A link is either a dropdown (handled above) or a plain
                    // href — this narrows the optional away for both.
                    if (!link.href) {
                      return null;
                    }

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={isActive ? "page" : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "group relative inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition-all duration-200",
                          isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
                        )}
                      >
                        <span>{link.name}</span>

                        {isActive ? (
                          <motion.span
                            layoutId="navbar-active-indicator"
                            className="absolute -bottom-[8px] left-1/2 h-[3px] w-6 -translate-x-1/2 rounded-full bg-blue-600 dark:bg-blue-400"
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 30,
                            }}
                          />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              </nav>

              <div className="flex items-center justify-end gap-2 sm:gap-2.5">
                <ThemeToggle
                  variant="rectangle"
                  start="bottom-up"
                  aria-label={
                    mounted && isDark
                      ? "Switch to light mode"
                      : "Switch to dark mode"
                  }
                  className="hidden size-11 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-600 shadow-[0_2px_10px_rgba(15,23,42,0.05)] transition-all duration-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-300 dark:focus-visible:ring-blue-500/30 sm:inline-flex"
                  iconClassName="size-[18px]"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                  className="hidden h-10 rounded-lg border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-200 sm:inline-flex"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    "Log in"
                  )}
                </Button>

                <motion.div
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden sm:block"
                >
                  <Button
                    nativeButton={false}
                    render={<Link href="/account-type" />}
                    className="group h-10 rounded-lg bg-primary px-5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#1D4ED8] hover:shadow-[0_8px_18px_rgba(37,99,235,0.18)] dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500 dark:hover:shadow-[0_10px_24px_rgba(37,99,235,0.28)]"
                  >
                    Get Started
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </Button>
                </motion.div>

                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setMobileMenuOpen((current) => !current)}
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-navigation"
                  aria-label={
                    mobileMenuOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                  className="size-10 rounded-lg border-slate-300 bg-white text-slate-700 shadow-xs hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-200 lg:hidden"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={mobileMenuOpen ? "close" : "menu"}
                      initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1 }}
                      exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                    >
                      {mobileMenuOpen ? (
                        <X className="size-5" />
                      ) : (
                        <Menu className="size-5" />
                      )}
                    </motion.span>
                  </AnimatePresence>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="pointer-events-auto overflow-hidden px-4 pb-4 sm:px-6 lg:hidden"
            >
              <div className="mx-auto w-full max-w-7xl rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_8px_24px_rgba(15,23,42,0.08)] dark:border-slate-800/80 dark:bg-slate-950/95 dark:shadow-[0_12px_32px_rgba(2,6,23,0.3)]">
                <nav
                  aria-label="Mobile navigation"
                  className="flex flex-col gap-1"
                >
                  {navLinks.map((link) => {
                    const isActive = isNavLinkActive(pathname, link);

                    if (link.items?.length) {
                      return (
                        <div key={`${link.name}-mobile`} className="space-y-1">
                          <div
                            className={cn(
                              "flex min-h-10 w-full items-center justify-between rounded-lg text-sm font-semibold transition-colors",
                              isActive || mobileCommunityOpen
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
                            )}
                          >
                            {/* Same split as desktop: label navigates, the
                                chevron only expands the submenu. */}
                            <Link
                              href={link.href ?? "/community"}
                              onClick={() => setMobileMenuOpen(false)}
                              aria-current={isActive ? "page" : undefined}
                              className="flex min-h-10 flex-1 items-center pl-4"
                            >
                              {link.name}
                            </Link>
                            <button
                              type="button"
                              aria-expanded={mobileCommunityOpen}
                              aria-label={`${mobileCommunityOpen ? "Close" : "Open"} ${link.name} menu`}
                              onClick={() =>
                                setMobileCommunityOpen((current) => !current)
                              }
                              className="flex min-h-10 items-center pl-3 pr-4"
                            >
                              <ChevronDown
                                className={cn(
                                  "size-4 transition-transform duration-200",
                                  mobileCommunityOpen && "rotate-180",
                                )}
                              />
                            </button>
                          </div>

                          <AnimatePresence initial={false}>
                            {mobileCommunityOpen ? (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="overflow-hidden"
                              >
                                <div className="grid grid-cols-1 gap-2 pl-3 pt-1 sm:grid-cols-2">
                                  {link.items.map((item) => {
                                    const isItemActive = isHrefActive(
                                      pathname,
                                      item.href,
                                    );

                                    return (
                                      <Link
                                        key={`${item.href}-mobile`}
                                        href={item.href}
                                        onClick={() => {
                                          setMobileCommunityOpen(false);
                                          setMobileMenuOpen(false);
                                        }}
                                        aria-current={
                                          isItemActive ? "page" : undefined
                                        }
                                        className={cn(
                                          "grid min-h-[104px] grid-cols-[40px_1fr_18px] items-start gap-3 rounded-xl bg-white px-3.5 py-3 transition-colors dark:bg-slate-900/70",
                                          isItemActive
                                            ? "bg-slate-100 text-blue-700 dark:bg-slate-800/90 dark:text-blue-300"
                                            : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-800/90 dark:hover:text-white",
                                        )}
                                      >
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-300">
                                          <CommunityMenuIcon icon={item.icon} />
                                        </span>
                                        <span className="min-w-0">
                                          <span className="block text-base font-semibold text-slate-900 dark:text-slate-100">
                                            {item.name}
                                          </span>
                                          <span className="mt-1 block text-sm leading-5 text-slate-500 dark:text-slate-400">
                                            {item.description}
                                          </span>
                                        </span>
                                      </Link>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            ) : null}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    if (!link.href) {
                      return null;
                    }

                    return (
                      <Link
                        key={`${link.href}-mobile`}
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          "flex min-h-10 items-center rounded-lg px-4 text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
                        )}
                      >
                        {link.name}
                      </Link>
                    );
                  })}

                  <div className="mt-3 grid gap-2 border-t border-slate-200 pt-4 dark:border-slate-800">
                    <Button
                      nativeButton={false}
                      render={
                        <Link
                          href="/account-type"
                          onClick={() => setMobileMenuOpen(false)}
                        />
                      }
                      className="h-10 rounded-lg bg-primary text-sm font-semibold text-white hover:bg-[#1D4ED8] dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
                    >
                      Get Started
                      <ArrowRight className="size-4" />
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleLogin}
                      disabled={isLoggingIn}
                      className="h-10 rounded-lg border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-200"
                    >
                      {isLoggingIn ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Log in"
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={toggle}
                      className="h-10 rounded-lg border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-200"
                    >
                      {mounted && isDark ? (
                        <>
                          <Sun className="size-4" />
                          Light mode
                        </>
                      ) : (
                        <>
                          <Moon className="size-4" />
                          Dark mode
                        </>
                      )}
                    </Button>
                  </div>
                </nav>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
