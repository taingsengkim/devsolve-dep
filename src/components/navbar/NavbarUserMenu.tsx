"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Loader2,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSidebarAuth } from "@/hooks/useSidebarAuth";

function getInitials(text: string): string {
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface NavbarUserMenuProps {
  /** Sign-in handler, used only while signed out. */
  onLogin: () => void;
  isLoggingIn: boolean;
}

/**
 * The right-hand end of the public navbar.
 *
 * Signed out it offers Log in / Get Started; signed in it shows the account,
 * which is what the rest of the app already assumed. Previously the public
 * pages had no idea a session existed, so a signed-in reader was still being
 * asked to log in on every page outside /dashboard.
 */
export function NavbarUserMenu({ onLogin, isLoggingIn }: NavbarUserMenuProps) {
  const { user, isPending, displayName, handleSignOut } = useSidebarAuth();

  if (isPending) {
    return (
      <div
        aria-hidden
        className="hidden h-10 w-10 animate-pulse rounded-full bg-slate-200 sm:block dark:bg-slate-800"
      />
    );
  }

  if (!user) {
    return (
      <>
        <Button
          type="button"
          variant="outline"
          onClick={onLogin}
          disabled={isLoggingIn}
          className="hidden h-10 rounded-lg border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed md:inline-flex xl:px-5 dark:border-slate-700/80 dark:bg-slate-900/80 dark:text-slate-100 dark:hover:border-blue-500/40 dark:hover:bg-slate-800 dark:hover:text-blue-200"
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

        <motion.div whileTap={{ scale: 0.98 }} className="hidden sm:block">
          <Button
            nativeButton={false}
            render={<Link href="/account-type" />}
            className="group h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#1D4ED8] hover:shadow-[0_8px_18px_rgba(37,99,235,0.18)] xl:px-5 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-500"
          >
            Get Started
            <ArrowRight className="hidden size-4 transition-transform duration-200 group-hover:translate-x-1 xl:block" />
          </Button>
        </motion.div>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            aria-label="Account menu"
            className="hidden cursor-pointer items-center gap-2 rounded-full border border-slate-200/80 bg-white p-1 pr-2 shadow-xs transition-colors hover:border-blue-200 hover:bg-blue-50 sm:inline-flex dark:border-slate-800 dark:bg-slate-900/80 dark:hover:border-blue-500/40 dark:hover:bg-slate-800"
          />
        }
      >
        <Avatar className="size-8 shrink-0">
          {user.image && <AvatarImage src={user.image} alt="" />}
          <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-4 text-slate-400" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-60 rounded-2xl border-slate-200/90 bg-white p-1.5 dark:border-slate-800 dark:bg-slate-950"
      >
        <div className="px-3 py-2.5">
          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">
            {displayName}
          </p>
          {user.email && (
            <p className="truncate text-sm text-slate-500 dark:text-slate-400">
              {user.email}
            </p>
          )}
        </div>

        <DropdownMenuSeparator className="bg-slate-200/70 dark:bg-slate-800" />

        <DropdownMenuItem
          render={<Link href="/dashboard/profile" />}
          className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium"
        >
          <UserRound className="size-4 text-slate-400" />
          My profile
        </DropdownMenuItem>

        {/* Leaving the dashboard for a public page must not be a one-way trip. */}
        <DropdownMenuItem
          render={<Link href="/dashboard" />}
          className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium"
        >
          <LayoutDashboard className="size-4 text-slate-400" />
          Dashboard
        </DropdownMenuItem>

        <DropdownMenuItem
          render={<Link href="/dashboard/profile/settings" />}
          className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium"
        >
          <Settings className="size-4 text-slate-400" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-slate-200/70 dark:bg-slate-800" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400"
        >
          <LogOut className="size-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NavbarUserMenu;
