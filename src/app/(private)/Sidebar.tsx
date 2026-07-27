import React from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  CircleDollarSign,
  Trophy,
  Bell,
  BookOpen,
  Globe,
  Bookmark,
  Settings
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Sidebar = () => {
  // Array to map through navigation items (Keeps JSX clean - DRY Principle)
  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Reports', icon: FileText },
    { name: 'Rewards', icon: CircleDollarSign },
    { name: 'Leaderboard', icon: Trophy },
    { name: 'Notification', icon: Bell, badge: 3, notificationStyle: true },
    { name: 'Solution', icon: BookOpen },
    { name: 'Programs', icon: Globe },
    { name: 'Bookmarks', icon: Bookmark, badge: 3 },
  ];

  return (
    <aside className="flex flex-col w-[260px] h-screen sticky top-0 rounded-r-[20px] border border-blue-600/15 p-5 bg-[linear-gradient(331deg,rgba(255,255,255,0.10)_59.38%,rgba(166,179,209,0.25)_92.74%,rgba(21,56,133,0.50)_132.79%),linear-gradient(154deg,rgba(255,255,255,0.30)_76.51%,rgba(37,99,235,0.30)_132.61%)] shadow-[0_4px_32px_0_rgba(37,99,235,0.10)]">

      {/* Logo Section */}
      <div className="flex flex-col items-center justify-center mt-2 mb-4 shrink-0">
        <Image
          src="/logo-1.png"
          alt="DevSolve Logo"
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
          priority
        />
      </div>

      {/* User Profile Card */}
      <div className="flex items-center gap-3 p-3 mb-4 bg-white/40 rounded-xl border border-white/30 shadow-sm shrink-0">
        <Avatar className="w-10 h-10 border-2 border-orange-400">
          <AvatarImage src="/jame-avatar.png" alt="Jame" />
          <AvatarFallback className="bg-orange-400 text-white font-bold">J</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-slate-800">Jame</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            User
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 min-h-0 space-y-1 overflow-y-auto pr-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.active;
          const isNotification = item.notificationStyle;

          return (
            <Button
              key={item.name}
              variant="ghost"
              className={`w-full justify-between h-11 px-3 ${isActive || isNotification
                  ? 'bg-blue-50/50 text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                  : 'text-slate-500 hover:bg-slate-100/50 hover:text-slate-700'
                } ${isNotification ? 'border border-blue-500/30' : ''}`}
            >
              <div className="flex items-center gap-3 font-medium">
                <Icon className={`w-5 h-5 ${isActive || isNotification ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.name}
              </div>

              {/* Badges for Notifications/Bookmarks */}
              {item.badge && (
                <Badge
                  className={`rounded-full w-5 h-5 flex items-center justify-center p-0 text-[10px] ${isNotification ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Settings Button (Pinned to bottom) */}
      <div className="mt-auto pt-3 shrink-0">
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 flex items-center gap-2 shadow-md">
          <Settings className="w-5 h-5" />
          Settings
        </Button>
      </div>

    </aside>
  );
};

export default Sidebar;