"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ProfileTabs, { ProfileTabId } from "./ProfileTabs";
import OverviewTab from "./overview/OverviewTab";
import HacktivityTab from "./hacktivity/HacktivityTab";
import CommunityTab from "./community/CommunityTab";
import HallOfThanksTab from "./hall-of-thanks/HallOfThanksTab";
import { ProfileStats, SeverityStats, ProfileBadge, HacktivityEntry, CommunityPost, ThanksEntry } from "@/lib/types/profile/types";

interface ProfileTabsContainerProps {
  stats: ProfileStats;
  severity: SeverityStats;
  badges: ProfileBadge[];
  hacktivity: HacktivityEntry[];
  communityPosts: CommunityPost[];
  thanks: ThanksEntry[];
}

const VALID_TABS: ProfileTabId[] = ["overview", "hacktivity", "community", "hall-of-thanks"];

export default function ProfileTabsContainer({
  stats,
  severity,
  badges,
  hacktivity,
  communityPosts,
  thanks,
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

  return (
    <div className="mt-6">
      <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <div className="mt-5">
        {activeTab === "overview" && <OverviewTab stats={stats} severity={severity} badges={badges} />}
        {activeTab === "hacktivity" && <HacktivityTab entries={hacktivity} />}
        {activeTab === "community" && <CommunityTab posts={communityPosts} />}
        {activeTab === "hall-of-thanks" && <HallOfThanksTab entries={thanks} />}
      </div>
    </div>
  );
}