"use client";

import { useEffect, useState } from "react";
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
import {
  ThemeToggle,
  useThemeToggle,
} from "@/components/motion/theme-toggle";
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
    items: [
      {
        name: "Problem",
        href: "/dashboard/discussions/create/problem",
        description: "Post bugs, blockers, and security questions.",
        icon: "problem",
      },
      {
        name: "Showcase",
        href: "/dashboard/discussions/create/showcase",
        description: "Share product wins, demos, and build highlights.",
        icon: "showcase",
      },
    ],
  },
  { name: "Leaderboard", href: "/leaderboard" },
  { name: "About", href: "/about" },
];

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
  const [communityMenuOpen, setCommunityMenuOpen] = useState(false);
  const [mobileCommunityOpen, setMobileCommunityOpen] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { isDark, mounted, toggle } = useThemeToggle({
    variant: "rectangle",
    start: "bottom-up",
  });
  const isDarkLogo = mounted && isDark;
  const logoSrc = isDarkLogo
    ? darkModeLogo
    : "/devsolve-logo-removebg-preview.png";

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
    <header className="sticky top-0 z-[100] w-full">
      <div className="bg-transparent">
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6"
        >
          <div className="flex min-h-[72px] items-center rounded-2xl border border-slate-200/80 bg-white px-4 shadow-[0_2px_12px_rgba(0,0,0,0.04)] sm:px-6 dark:border-slate-800/80 dark:bg-slate-950/95 dark:shadow-[0_10px_30px_rgba(2,6,23,0.28)]">
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
                  <span className="relative block h-11 w-[154px] sm:h-12 sm:w-[168px]">
                    <Image
                      key={isDarkLogo ? "dark-logo" : "light-logo"}
                      src={logoSrc}
                      alt="DevSolve"
                      fill
                      priority
                      sizes="(min-width: 640px) 168px, 154px"
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
                          onMouseEnter={() => setCommunityMenuOpen(true)}
                          onMouseLeave={() => setCommunityMenuOpen(false)}
                        >
                          <button
                            type="button"
                            aria-expanded={communityMenuOpen}
                            aria-haspopup="menu"
                            onClick={() =>
                              setCommunityMenuOpen((current) => !current)
                            }
                            className={cn(
                              "group relative inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 text-sm font-semibold transition-all duration-200",
                              isActive || communityMenuOpen
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
                            )}
                          >
                            <span>{link.name}</span>
                            <ChevronDown
                              className={cn(
                                "size-4 transition-transform duration-200",
                                communityMenuOpen && "rotate-180",
                              )}
                            />

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
                          </button>

                          <AnimatePresence>
                            {communityMenuOpen ? (
                              <motion.div
                                initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                transition={{ duration: 0.18, ease: "easeOut" }}
                                className="absolute left-1/2 top-full z-20 mt-2.5 w-[168px] -translate-x-1/2"
                              >
                                <div className="relative overflow-hidden rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.1)] dark:border-slate-800 dark:bg-slate-950 dark:shadow-[0_16px_34px_rgba(2,6,23,0.28)]">
                                  <div className="relative z-10 flex flex-col gap-1">
                                    {link.items.map((item) => {
                                      const isItemActive = isHrefActive(pathname, item.href);

                                      return (
                                        <Link
                                          key={item.href}
                                          href={item.href}
                                          onClick={() => {
                                            setCommunityMenuOpen(false);
                                            setMobileMenuOpen(false);
                                          }}
                                          className={cn(
                                            "group flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-semibold leading-none transition-colors duration-200",
                                            isItemActive
                                              ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
                                          )}
                                        >
                                          <span className="flex size-5 shrink-0 items-center justify-center text-blue-600 dark:text-blue-300">
                                            <CommunityMenuIcon icon={item.icon} />
                                          </span>
                                          <span className="pt-px">{item.name}</span>
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
                  onClick={() =>
                    setMobileMenuOpen((current) => !current)
                  }
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
        </motion.div>

        {/* Mobile navigation */}
        <AnimatePresence>
          {mobileMenuOpen ? (
            <motion.div
              id="mobile-navigation"
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="overflow-hidden px-4 pb-4 sm:px-6 lg:hidden"
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
                          <button
                            type="button"
                            onClick={() =>
                              setMobileCommunityOpen((current) => !current)
                            }
                            className={cn(
                              "flex min-h-10 w-full items-center justify-between rounded-lg px-4 text-sm font-semibold transition-colors",
                              isActive || mobileCommunityOpen
                                ? "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900/80 dark:hover:text-white",
                            )}
                          >
                            <span>{link.name}</span>
                            <ChevronDown
                              className={cn(
                                "size-4 transition-transform duration-200",
                                mobileCommunityOpen && "rotate-180",
                              )}
                            />
                          </button>

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
                                    const isItemActive = isHrefActive(pathname, item.href);

                                    return (
                                      <Link
                                        key={`${item.href}-mobile`}
                                        href={item.href}
                                        onClick={() => {
                                          setMobileCommunityOpen(false);
                                          setMobileMenuOpen(false);
                                        }}
                                        aria-current={isItemActive ? "page" : undefined}
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
    </header>
  );
};

export default Navbar;
