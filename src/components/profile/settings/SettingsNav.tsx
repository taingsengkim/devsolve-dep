"use client";

import { User, Globe, Lock, Bell } from "lucide-react";

export interface SettingsNavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const navItems: SettingsNavItem[] = [
  { id: "personal-info", label: "Personal Information", icon: User },
  { id: "bio-social", label: "Bio & Social Links", icon: Globe },
  { id: "password", label: "Change Password", icon: Lock },
  { id: "preferences", label: "Preferences & Security", icon: Bell },
];

interface SettingsNavProps {
  activeId: string;
  onSelect: (id: string) => void;
}

export default function SettingsNav({ activeId, onSelect }: SettingsNavProps) {
  const handleClick = (id: string) => {
    onSelect(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="w-full md:w-60 flex-shrink-0 space-y-1">
      <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
        Settings Menu
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleClick(item.id)}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer text-left ${
              isActive
                ? "bg-blue-50 text-blue-600 font-semibold shadow-2xs"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Icon className={`size-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
