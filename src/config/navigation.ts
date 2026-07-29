import {
  LayoutDashboard,
  FileText,
  CircleDollarSign,
  Trophy,
  Bell,
  BookOpen,
  Globe,
  Bookmark,
  BarChart3,
  PlusCircle,
  ClipboardList,
  Users,
  Building2,
  ShieldCheck,
  FileCheck,
  MessageSquareCode,
  FileSearch,
  UserCheck,
  ShieldAlert,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  roles?: string[];
}

export const NAV_ITEMS: NavItem[] = [
  // Common / Multi-role items
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["USER", "COMPANY", "ADMIN"] },
  { name: "Programs", href: "/dashboard/programs", icon: Globe, roles: ["USER", "COMPANY"] },

  // USER Role items
  { name: "Reports", href: "/dashboard/my-reports", icon: FileText, roles: ["USER"] },
  { name: "Rewards", href: "/dashboard/rewards", icon: CircleDollarSign, roles: ["USER"] },
  { name: "Leaderboard", href: "/dashboard/leaderboard", icon: Trophy, roles: ["USER"] },
  { name: "Notification", href: "/dashboard/notifications", icon: Bell, badge: 3, roles: ["USER"] },
  { name: "Solution", href: "/dashboard/solution", icon: BookOpen, roles: ["USER"] },
  { name: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark, badge: 3, roles: ["USER"] },

  // COMPANY Role items
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3, roles: ["COMPANY"] },
  { name: "Create Program", href: "/dashboard/create-program", icon: PlusCircle, roles: ["COMPANY"] },
  { name: "Report Management", href: "/dashboard/report-management", icon: ClipboardList, roles: ["COMPANY"] },
  { name: "Team Management", href: "/dashboard/team-management", icon: Users, roles: ["COMPANY"] },
  { name: "Org Settings", href: "/dashboard/org-settings", icon: Building2, roles: ["COMPANY"] },

  // ADMIN Role items
  { name: "Company Verification", href: "/dashboard/company-verification", icon: ShieldCheck, roles: ["ADMIN"] },
  { name: "Report Confirmation", href: "/dashboard/report-confirmation", icon: FileCheck, roles: ["ADMIN"] },
  { name: "Community Moderation", href: "/dashboard/community-moderation", icon: MessageSquareCode, roles: ["ADMIN"] },
  { name: "Review Report", href: "/dashboard/review-report", icon: FileSearch, roles: ["ADMIN"] },
  { name: "Users", href: "/dashboard/users", icon: UserCheck, roles: ["ADMIN"] },
  { name: "Content Moderation", href: "/dashboard/content-moderation", icon: ShieldAlert, roles: ["ADMIN"] },
];
