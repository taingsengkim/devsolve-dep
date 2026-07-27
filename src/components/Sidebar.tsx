"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { authClient } from '@/lib/auth/auth-client';
import {
  LayoutDashboard,
  FileText,
  CircleDollarSign,
  Trophy,
  Bell,
  BookOpen,
  Globe,
  Bookmark,
  Settings,
  LogOut
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function getInitials(text: string): string {
  return text
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const displayName = user?.name ?? user?.email ?? "User";

  const handleSignOut = async () => {
    await authClient.signOut();

    const issuer = process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER;
    const clientId = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID;

    if (issuer && clientId) {
      const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
      logoutUrl.searchParams.set("client_id", clientId);
      logoutUrl.searchParams.set("post_logout_redirect_uri", window.location.origin);
      window.location.href = logoutUrl.toString();
    } else {
      window.location.href = "/";
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Reports', href: '/dashboard/my-reports', icon: FileText },
    { name: 'Rewards', href: '/dashboard/rewards', icon: CircleDollarSign },
    { name: 'Leaderboard', href: '/dashboard/leaderboard', icon: Trophy },
    { name: 'Notification', href: '/dashboard/notifications', icon: Bell, badge: 3 },
    { name: 'Solution', href: '/dashboard/solution', icon: BookOpen },
    { name: 'Programs', href: '/dashboard/programs', icon: Globe },
    { name: 'Bookmarks', href: '/dashboard/bookmarks', icon: Bookmark, badge: 3 },
  ];

  return (
    <aside className="flex flex-col w-[260px] shrink-0 h-screen sticky top-0 rounded-r-[20px] border border-blue-600/15 p-5 bg-[linear-gradient(331deg,rgba(255,255,255,0.10)_59.38%,rgba(166,179,209,0.25)_92.74%,rgba(21,56,133,0.50)_132.79%),linear-gradient(154deg,rgba(255,255,255,0.30)_76.51%,rgba(37,99,235,0.30)_132.61%)] shadow-[0_4px_32px_0_rgba(37,99,235,0.10)]">

      {/* Logo Section */}
      <Link href="/" className="flex flex-col items-center justify-center mt-2 mb-4 shrink-0">
        <Image
          src="/logo-1.png"
          alt="DevSolve Logo"
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
          priority
        />
      </Link>

      {/* User Profile Card */}
      <div className="flex items-center gap-3 p-3 mb-4 bg-white/40 rounded-xl border border-white/30 shadow-sm shrink-0">
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
              <span className="text-sm sm:text-base font-bold text-slate-800 truncate" title={displayName}>
                {displayName}
              </span>
              {user?.email && (
                <span className="text-xs sm:text-sm text-slate-500 truncate" title={user.email}>
                  {user.email}
                </span>
              )}
            </div>
          </>
        )}
      </div>

      {/* Navigation List */}
      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));

          return (
            <Link key={item.name} href={item.href} className="block w-full">
              <Button
                variant="ghost"
                className={`w-full cursor-pointer justify-between h-11 px-3 rounded-xl ${isActive
                    ? 'bg-blue-50/50 text-blue-600 hover:bg-blue-50 hover:text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900 font-medium'
                  }`}
              >
                <div className="flex items-center gap-3 text-sm">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>

                {/* Badges for Notifications/Bookmarks */}
                {item.badge && (
                  <Badge
                    className="rounded-full w-5 h-5 flex items-center justify-center p-0 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Settings & Logout Buttons (Pinned to bottom) */}
      <div className="mt-auto pt-3 shrink-0 space-y-1.5">
        <Link href="/" className="block w-full">
          <Button className="w-full cursor-pointer bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 flex items-center justify-start px-3 gap-3 shadow-md text-sm font-medium">
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </Button>
        </Link>

        <Button 
          variant="ghost"
          onClick={handleSignOut}
          className="w-full cursor-pointer text-rose-600 hover:bg-rose-50 hover:text-rose-700 rounded-xl h-11 flex items-center justify-start px-3 gap-3 text-sm font-medium transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>

    </aside>
  );
};

export default Sidebar;