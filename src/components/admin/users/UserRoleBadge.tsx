"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Shield, Building2, User, ShieldAlert } from "lucide-react";

export type UserRole = "USER" | "COMPANY" | "ADMIN" | "MODERATOR";

interface RoleConfig {
  label: string;
  className: string;
  icon: React.ElementType;
}

const ROLE_CONFIG: Record<UserRole, RoleConfig> = {
  ADMIN: {
    label: "Admin",
    icon: Shield,
    className:
      "bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  MODERATOR: {
    label: "Moderator",
    icon: ShieldAlert,
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  },
  COMPANY: {
    label: "Company",
    icon: Building2,
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  USER: {
    label: "Researcher",
    icon: User,
    className:
      "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  },
};

export function getRoleConfig(role: string): RoleConfig {
  return ROLE_CONFIG[role as UserRole] ?? ROLE_CONFIG.USER;
}

interface UserRoleBadgeProps {
  role: string;
}

export function UserRoleBadge({ role }: UserRoleBadgeProps) {
  const config = getRoleConfig(role);
  const Icon = config.icon;
  return (
    <Badge className={`rounded-full px-2.5 py-0.5 text-xs font-bold gap-1 ${config.className}`}>
      <Icon className="w-3 h-3 shrink-0" />
      {config.label}
    </Badge>
  );
}
