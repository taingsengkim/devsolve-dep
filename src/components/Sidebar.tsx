"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  Menu,
  Settings,
  X,
} from "lucide-react";

import { NAV_ITEMS } from "@/config/navigation";
import { useSidebarAuth, SidebarUser } from "@/hooks/useSidebarAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNotification } from "@/components/notifications/NotificationContext";
import { NotificationTrigger } from "@/components/notifications/NotificationTrigger";
import { cn } from "@/lib/utils";

function getInitials(text: string): string {
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Does this path sit under that nav href? */
function matches(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  if (href === "/dashboard") return pathname === "/dashboard";
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface SidebarContentProps {
  pathname: string;
  user?: SidebarUser;
  isPending: boolean;
  displayName: string;
  onNavItemClick?: () => void;
  onSignOut: () => void;
  /** Desktop icon-rail mode. The toggle itself lives on the aside's edge. */
  collapsed?: boolean;
}

function SidebarContent({
  pathname,
  user,
  isPending,
  displayName,
  onNavItemClick,
  onSignOut,
  collapsed = false,
}: SidebarContentProps) {
  const { openNotification } = useNotification();
  const userRoles = (
    user?.roles || (user?.role ? user.role.split(",") : ["USER"])
  ).map((r) => r.trim().toUpperCase());

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((reqRole) => userRoles.includes(reqRole.toUpperCase()));
  });

  /* Longest match wins, so a nested route lights up only its own entry.
     `/dashboard/profile/settings` used to highlight "My Profile" as well,
     because a plain `startsWith` can't tell a parent from the real target. */
  const activeHref = filteredNavItems
    .map((item) => item.href)
    .filter((href) => matches(pathname, href))
    .sort((a, b) => b.length - a.length)[0];

  const categories = Array.from(
    new Set(filteredNavItems.map((item) => item.category || "Overview")),
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Close control, drawer only. Desktop has no row here at all — its
          collapse toggle floats on the sidebar's edge, so the profile card
          starts flush with the top padding instead of after an empty band. */}
      {onNavItemClick && (
        <div className="mb-2 flex h-9 shrink-0 items-center justify-end">
          <Button
            size="icon"
            variant="ghost"
            onClick={onNavItemClick}
            aria-label="Close menu"
            className="size-9 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            <X className="size-5" />
          </Button>
        </div>
      )}

      {/* Profile card — resolves the real username rather than guessing a slug */}
      <Link
        href="/dashboard/profile"
        onClick={onNavItemClick}
        title={collapsed ? displayName : undefined}
        className={cn(
          "mb-3 flex shrink-0 items-center gap-3 rounded-xl border border-slate-200/60 bg-white/60 p-3 shadow-2xs transition-colors hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900",
          collapsed && "justify-center px-0",
        )}
      >
        {isPending ? (
          <div className="flex w-full animate-pulse items-center gap-3">
            <div className="size-10 shrink-0 rounded-full bg-slate-300/60 dark:bg-slate-700" />
            {!collapsed && (
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <div className="h-3.5 w-20 rounded bg-slate-300/60 dark:bg-slate-700" />
                <div className="h-2.5 w-28 rounded bg-slate-300/60 dark:bg-slate-700" />
              </div>
            )}
          </div>
        ) : (
          <>
            <Avatar className="size-10 shrink-0 border-2 border-blue-500">
              {user?.image && <AvatarImage src={user.image} alt="" />}
              <AvatarFallback className="bg-blue-600 font-bold text-white">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            {!collapsed && (
              <div className="flex min-w-0 flex-col">
                <span
                  className="truncate text-sm font-bold text-slate-800 dark:text-slate-100"
                  title={displayName}
                >
                  {displayName}
                </span>
                {user?.email && (
                  <span
                    className="truncate text-sm text-slate-500 dark:text-slate-400"
                    title={user.email}
                  >
                    {user.email}
                  </span>
                )}
              </div>
            )}
          </>
        )}
      </Link>

      {/* Navigation */}
      <nav className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {categories.map((category, catIndex) => {
          const categoryItems = filteredNavItems.filter(
            (item) => (item.category || "Overview") === category,
          );

          return (
            <div key={category} className="space-y-1">
              {catIndex > 0 && (
                <Separator className="my-2.5 bg-slate-200/60 dark:bg-slate-800" />
              )}

              {collapsed ? (
                <div className="py-1" aria-hidden />
              ) : (
                <div className="select-none px-3 pb-1 pt-1 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {category}
                </div>
              )}

              {categoryItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.href === activeHref;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={collapsed ? item.name : undefined}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => {
                      if (item.name === "Notification") {
                        e.preventDefault();
                        openNotification();
                      }
                      onNavItemClick?.();
                    }}
                    className={cn(
                      "group relative flex h-10 w-full items-center rounded-xl px-3 text-sm font-semibold transition-colors",
                      collapsed ? "justify-center px-0" : "justify-between",
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                        : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100",
                    )}
                  >
                    {/* The rail is the only active cue left when labels are
                        hidden, so it lives outside the label block. */}
                    {isActive && (
                      <motion.span
                        layoutId="sidebar-active-rail"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-blue-600 dark:bg-blue-400"
                        transition={{ type: "spring", stiffness: 400, damping: 35 }}
                      />
                    )}

                    <span
                      className={cn(
                        "flex min-w-0 items-center",
                        collapsed ? "gap-0" : "gap-3",
                      )}
                    >
                      <Icon
                        className={cn(
                          "size-4.5 shrink-0",
                          isActive
                            ? "text-blue-600 dark:text-blue-400"
                            : "text-slate-400 dark:text-slate-500",
                        )}
                      />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </span>

                    {item.badge && !collapsed && (
                      <Badge className="flex size-5 items-center justify-center rounded-full bg-blue-600 p-0 text-xs text-white hover:bg-blue-700">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="mt-auto shrink-0 space-y-1.5 border-t border-slate-200/60 pt-3 dark:border-slate-800">
        <Link
          href="/dashboard/profile/settings"
          onClick={onNavItemClick}
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex h-10 w-full items-center rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-2xs transition-colors hover:bg-blue-700",
            collapsed ? "justify-center px-0" : "justify-start gap-3 px-3",
          )}
        >
          <Settings className="size-4 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>

        <Button
          variant="ghost"
          onClick={() => {
            onNavItemClick?.();
            onSignOut();
          }}
          title={collapsed ? "Log out" : undefined}
          className={cn(
            "flex h-10 w-full cursor-pointer items-center rounded-xl text-sm font-semibold text-rose-600 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40",
            collapsed ? "justify-center px-0" : "justify-start gap-3 px-3",
          )}
        >
          <LogOut className="size-4 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </Button>
      </div>
    </div>
  );
}

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user, isPending, displayName, handleSignOut } = useSidebarAuth();

  /* Escape closes the drawer, and the page behind it stops scrolling while it
     is open — a drawer you can scroll past is a drawer that feels broken. */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  /* Back/forward navigation doesn't run a nav item's onClick, so the drawer
     would otherwise stay open over the new page. Adjusted during render
     against the previous path rather than in an effect. */
  const [renderedPath, setRenderedPath] = useState(pathname);
  if (renderedPath !== pathname) {
    setRenderedPath(pathname);
    setIsOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 flex w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden dark:border-slate-800 dark:bg-slate-900/90">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/logo-1.png"
            alt=""
            width={36}
            height={36}
            className="size-9 object-contain"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            DevSolve
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NotificationTrigger />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
            aria-expanded={isOpen}
            className="cursor-pointer rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Menu className="size-6" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 cursor-default bg-slate-900/40 backdrop-blur-xs lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 flex h-full w-70 flex-col overflow-hidden border-r border-slate-200 bg-white p-4 shadow-2xl lg:hidden dark:border-slate-800 dark:bg-slate-950"
            >
              <SidebarContent
                pathname={pathname}
                user={user}
                isPending={isPending}
                displayName={displayName}
                onNavItemClick={() => setIsOpen(false)}
                onSignOut={handleSignOut}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop — collapses to an icon rail.
          `overflow-visible` so the edge toggle can sit half outside; the
          content wrapper inside does its own clipping during the animation. */}
      <motion.aside
        animate={{ width: collapsed ? 84 : 260 }}
        transition={{ type: "spring", stiffness: 380, damping: 34 }}
        className="sticky top-0 z-30 hidden h-dvh shrink-0 flex-col overflow-visible border-r border-slate-200/80 p-4 lg:flex dark:border-slate-800"
      >
        <SidebarContent
          pathname={pathname}
          user={user}
          isPending={isPending}
          displayName={displayName}
          onSignOut={handleSignOut}
          collapsed={collapsed}
        />

        <button
          type="button"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-8 flex size-6 cursor-pointer items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-md transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-300"
        >
          {collapsed ? (
            <ChevronsRight className="size-3.5" />
          ) : (
            <ChevronsLeft className="size-3.5" />
          )}
        </button>
      </motion.aside>
    </>
  );
};

export default Sidebar;
