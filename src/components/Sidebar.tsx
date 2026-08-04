"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Settings, LogOut, Menu, X } from "lucide-react";

import { NAV_ITEMS } from "@/config/navigation";
import { useSidebarAuth, SidebarUser } from "@/hooks/useSidebarAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNotification } from "@/components/notifications/NotificationContext";
import { NotificationTrigger } from "@/components/notifications/NotificationTrigger";

function getInitials(text: string): string {
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface SidebarContentProps {
  pathname: string;
  user?: SidebarUser;
  isPending: boolean;
  displayName: string;
  onNavItemClick?: () => void;
  onSignOut: () => void;
}

function SidebarContent({
  pathname,
  user,
  isPending,
  displayName,
  onNavItemClick,
  onSignOut,
}: SidebarContentProps) {
  const { openNotification } = useNotification();
  // Derive a profile slug from the signed-in user — swap this for `user.username`
  // once the session/auth provider exposes a real username directly.
  const profileSlug = (user?.name || user?.email?.split("@")[0] || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  const userRoles = (
    user?.roles ||
    (user?.role ? user.role.split(",") : ["USER"])
  ).map((r) => r.trim().toUpperCase());

  const filteredNavItems = NAV_ITEMS.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((reqRole) => userRoles.includes(reqRole.toUpperCase()));
  });

  const categories = Array.from(
    new Set(filteredNavItems.map((item) => item.category || "Overview"))
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mt-1 mb-3 shrink-0 px-1">
        {/* <Link href="/" onClick={onNavItemClick} className="flex items-center gap-2">
          <Image
            src="/logo-1.png"
            alt="DevSolve Logo"
            width={48}
            height={48}
            className="w-12 h-12 object-contain"
            priority
          />
          <span className="text-xl font-bold text-slate-900 tracking-tight lg:hidden">
            DevSolve
          </span>
        </Link> */}
        {onNavItemClick && (
          <Button
            size="icon"
            variant="ghost"
            onClick={onNavItemClick}
            className="lg:hidden rounded-lg text-slate-500 hover:text-slate-900"
          >
            <X className="w-5 h-5" />
          </Button>
        )}
      </div>

      {/* User Profile Card — links to the user's own public profile */}
      <Link
        href={profileSlug ? `/dashboard/profile/${profileSlug}` : "#"}
        onClick={onNavItemClick}
        className="block"
      >
        <div className="flex items-center gap-3 p-3 mb-3 bg-white/40 rounded-xl border border-white/30 shadow-2xs shrink-0 transition hover:bg-white/60 cursor-pointer">
          {isPending ? (
            <div className="flex items-center gap-3 w-full animate-pulse">
              <div className="w-10 h-10 rounded-full bg-slate-300/60" />
              <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                <div className="h-3.5 w-20 rounded bg-slate-300/60" />
                <div className="h-2.5 w-28 rounded bg-slate-300/60" />
              </div>
            </div>
          ) : (
            <>
              <Avatar className="w-10 h-10 border-2 border-orange-400 shrink-0">
                {user?.image && <AvatarImage src={user.image} alt={displayName} />}
                <AvatarFallback className="bg-orange-400 text-white font-bold">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span
                  className="text-sm sm:text-base font-bold text-slate-800 truncate"
                  title={displayName}
                >
                  {displayName}
                </span>
                {user?.email && (
                  <span className="text-xs text-slate-500 truncate" title={user.email}>
                    {user.email}
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </Link>

      {/* Navigation List grouped by Category with Separator */}
      <nav className="flex-1 min-h-0 space-y-3 overflow-y-auto pr-1">
        {categories.map((category, catIndex) => {
          const categoryItems = filteredNavItems.filter(
            (item) => (item.category || "Overview") === category
          );

          return (
            <div key={category} className="space-y-1">
              {catIndex > 0 && <Separator className="my-2.5 bg-slate-200/60" />}

              <div className="px-3 pt-1 pb-1 text-xs font-bold tracking-wider text-slate-400 uppercase select-none">
                {category}
              </div>

              {categoryItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.name === "Notification") {
                        e.preventDefault();
                        openNotification();
                      }
                      if (onNavItemClick) onNavItemClick();
                    }}
                    className="block w-full"
                  >
                    <Button
                      variant="ghost"
                      className={`w-full cursor-pointer justify-between h-10 px-3 rounded-xl ${
                        isActive
                          ? "bg-blue-50/60 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold"
                          : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-3 text-sm font-semibold">
                        <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <Badge className="rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-3 shrink-0 space-y-1.5 border-t border-slate-200/50">
        <Link href="/dashboard/profile/settings" onClick={onNavItemClick} className="block w-full">
          <Button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-10 flex items-center justify-start px-3 gap-3 shadow-2xs text-sm font-semibold">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Button>
        </Link>

        <Button
          variant="ghost"
          onClick={() => {
            if (onNavItemClick) onNavItemClick();
            onSignOut();
          }}
          className="w-full cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl h-10 flex items-center justify-start px-3 gap-3 text-sm font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}

const Sidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isPending, displayName, handleSignOut } = useSidebarAuth();

  return (
    <>
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 w-full">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo-1.png"
            alt="DevSolve Logo"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
            priority
          />
          <span className="text-lg font-bold text-slate-900 tracking-tight">DevSolve</span>
        </Link>

        <div className="flex items-center gap-2">
          <NotificationTrigger />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsOpen(true)}
            aria-label="Open Menu"
            className="rounded-xl text-slate-700 hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="lg:hidden fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 flex flex-col w-[280px] h-full p-4 bg-[linear-gradient(331deg,rgba(255,255,255,0.95)_59.38%,rgba(240,244,255,0.95)_92.74%),linear-gradient(154deg,rgba(255,255,255,0.95)_76.51%,rgba(239,246,255,0.95)_132.61%)] backdrop-blur-xl border-r border-blue-600/15 shadow-2xl overflow-hidden"
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

      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] shrink-0 h-[100dvh] sticky top-0 p-4 border border-gray-100 overflow-hidden">
        <SidebarContent
          pathname={pathname}
          user={user}
          isPending={isPending}
          displayName={displayName}
          onSignOut={handleSignOut}
        />
      </aside>
    </>
  );
};

export default Sidebar;
