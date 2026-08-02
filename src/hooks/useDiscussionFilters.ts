"use client";

import { useState } from "react";
import {
  useGetDiscussionsQuery,
  useGetDiscussionTopicsQuery,
  useGetTrendingTagsQuery,
  useGetDiscussionStatsQuery,
} from "@/lib/redux/services/discussionsApi";
import type { DiscussionCategory, TopicFilter } from "@/lib/types/dicussion/types";

const DEFAULT_LIMIT = 3;

export function useDiscussionFilters() {
  const [category, setCategory] = useState<DiscussionCategory>("All");
  const [topic, setTopic] = useState<TopicFilter | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  // Reset page to 1 on filter change
  const handleSetCategory = (value: DiscussionCategory) => {
    setCategory(value);
    setPage(1);
  };
  const handleSetTopic = (value: TopicFilter | null) => {
    setTopic(value);
    setPage(1);
  };
  const handleSetTag = (value: string | null) => {
    setTag(value);
    setPage(1);
  };
  const handleSetSearch = (value: string) => {
    setSearchQuery(value);
    setPage(1);
  };
  const handleResetFilters = () => {
    setCategory("All");
    setTopic(null);
    setTag(null);
    setSearchQuery("");
    setPage(1);
  };

  // RTK Query hooks
  const discussionsResult = useGetDiscussionsQuery({
    category,
    topic,
    tag,
    searchQuery,
    page,
    limit,
  });

  const topicsResult = useGetDiscussionTopicsQuery();
  const tagsResult = useGetTrendingTagsQuery();
  const statsResult = useGetDiscussionStatsQuery();

  return {
    // Filter state
    category,
    topic,
    tag,
    searchQuery,
    page,
    limit,
    // Filter handlers
    setCategory: handleSetCategory,
    setTopic: handleSetTopic,
    setTag: handleSetTag,
    setSearchQuery: handleSetSearch,
    setPage,
    setLimit,
    resetFilters: handleResetFilters,
    // Query results
    discussionsResult,
    topicsResult,
    tagsResult,
    statsResult,
  };
}
