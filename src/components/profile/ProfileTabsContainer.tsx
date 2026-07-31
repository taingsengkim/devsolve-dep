"use client";

import { useCallback, useMemo } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import ProfileHeader from "./ProfileHeader";
import ProfileBio from "./ProfileBio";
import ProfileTabs, { ProfileTabId } from "./ProfileTabs";
import OverviewTab from "./overview/OverviewTab";
import HacktivityTab from "./hacktivity/HacktivityTab";
import CommunityTab from "./community/CommunityTab";
import HallOfThanksTab from "./hall-of-thanks/HallOfThanksTab";
import {
  Profile,
  ProfileStats,
  SeverityStats,
  ProfileBadge,
  HacktivityEntry,
  CommunityPost,
  ThanksEntry,
} from "@/lib/types/profile/types";
import { ProfileStats, SeverityStats, ProfileBadge } from "@/lib/types/profile/types";
import {
  useGetHacktivityQuery,
  useGetCommunityPostsQuery,
  useGetThanksQuery,
} from "@/lib/redux/services/profileApi";

interface ProfileTabsContainerProps {
  profile: Profile;
  stats: ProfileStats;
  severity: SeverityStats;
  badges: ProfileBadge[];
  username: string;
}

const VALID_TABS: ProfileTabId[] = ["overview", "hacktivity", "community", "hall-of-thanks"];

export default function ProfileTabsContainer({
  profile,
  stats,
  severity,
  badges,
  username,
}: ProfileTabsContainerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeTab = useMemo<ProfileTabId>(() => {
    const param = searchParams.get("tab") as ProfileTabId | null;
    return param && VALID_TABS.includes(param) ? param : "overview";
  }, [searchParams]);

  const handleTabChange = useCallback(
    (tab: ProfileTabId) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("tab", tab);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const { data: hacktivity } = useGetHacktivityQuery(username, { skip: activeTab !== "hacktivity" });
  const { data: communityPosts } = useGetCommunityPostsQuery(username, { skip: activeTab !== "community" });
  const { data: thanks } = useGetThanksQuery(username, { skip: activeTab !== "hall-of-thanks" });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column — Avatar, Stats & Badges Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          {/* Avatar Picture */}
          <div className="w-full aspect-square rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative group bg-slate-100">
            <Image
              src="/justin.png"
              alt={profile.displayName}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Stats Divider Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              <span>Stats</span>
              <div className="h-px flex-1 bg-slate-200/80" />
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <p className="font-bold text-slate-700 text-2xl tracking-tight">{stats.reputation.toLocaleString()}</p>
                <p className="text-sm text-slate-500 font-medium">Reputation Points</p>
              </div>

              <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Global Rank</span>
                <span className="text-sm font-bold text-slate-600">#{stats.globalRank}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Reports Submitted</span>
                <span className="text-sm font-bold text-slate-600">{stats.reportsSubmitted}</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Accepted Rate</span>
                <span className="text-sm font-bold text-emerald-600">{stats.acceptedRate}%</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-t border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Total Earned</span>
                <span className="text-sm font-bold text-emerald-600">${stats.totalEarned.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column — Header, Tabs & Main Content */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-6">
          <ProfileHeader profile={profile} />

          <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <ProfileBio profile={profile} />
                  <div className="pt-2">
                    <OverviewTab stats={stats} severity={severity} />
                  </div>
                </div>
              )}
              {activeTab === "hacktivity" && <HacktivityTab entries={hacktivity} />}
              {activeTab === "community" && <CommunityTab posts={communityPosts} />}
              {activeTab === "hall-of-thanks" && <HallOfThanksTab entries={thanks} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}