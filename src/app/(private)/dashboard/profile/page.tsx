"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { UserX } from "lucide-react";
import { useGetEditProfileFormQuery } from "@/lib/redux/services/profileApi";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import CompanyProfileView from "@/components/profile/company/CompanyProfileView";
import AdminProfileView from "@/components/profile/admin/AdminProfileView";
import { useSidebarAuth } from "@/hooks/useSidebarAuth";

/**
 * /dashboard/profile — "my profile".
 *
 * Supports all 3 profile types in DevSolve:
 * 1. Admin: renders AdminProfileView
 * 2. Company: renders CompanyProfileView
 * 3. User: redirects to canonical /dashboard/profile/${username}
 */
export default function MyProfilePage() {
  const router = useRouter();
  const { user, areRolesResolved } = useSidebarAuth();
  const isCompany = user?.roles?.includes("COMPANY") ?? false;
  const isAdmin = user?.roles?.includes("ADMIN") ?? false;
  const { data, isError } = useGetEditProfileFormQuery(undefined, {
    skip: !areRolesResolved || isCompany || isAdmin,
  });
  const username = data?.username;

  useEffect(() => {
    if (areRolesResolved && !isCompany && !isAdmin && username) {
      router.replace(`/dashboard/profile/${username}`);
    }
  }, [areRolesResolved, isCompany, isAdmin, username, router]);

  if (!areRolesResolved) {
    return <ProfileSkeleton />;
  }

  if (isAdmin) {
    return <AdminProfileView />;
  }

  if (isCompany) {
    return <CompanyProfileView />;
  }

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full pb-12"
      >
        <div className="mx-auto max-w-lg space-y-4 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-slate-900">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
            <UserX className="size-6" />
          </span>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Couldn&apos;t load your profile
          </h1>
          <p className="text-base text-slate-500 dark:text-slate-400">
            Your session may have expired. Try signing in again.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex h-11 items-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            Back to dashboard
          </Link>
        </div>
      </motion.div>
    );
  }

  // Covers both the fetch and the moment between resolving and the redirect
  // committing, so there is never a blank frame.
  return <ProfileSkeleton />;
}

