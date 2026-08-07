"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { UserX } from "lucide-react";
import { useGetEditProfileFormQuery } from "@/lib/redux/services/profileApi";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";

/**
 * /dashboard/profile — "my profile".
 *
 * The username is not in the session, so it has to come from the backend
 * before the canonical URL can be built. Everything else in the app links
 * here rather than trying to derive a slug from a display name or an email
 * prefix, which is how "@adminuser" ended up pointing at a profile the
 * backend calls "@devsolve".
 *
 * Redirecting rather than rendering in place keeps one canonical, shareable
 * URL per profile, and keeps the `followers`/`following` children reachable
 * under the same segment.
 */
export default function MyProfilePage() {
  const router = useRouter();
  const { data, isError } = useGetEditProfileFormQuery();
  const username = data?.username;

  useEffect(() => {
    if (username) {
      router.replace(`/dashboard/profile/${username}`);
    }
  }, [username, router]);

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
