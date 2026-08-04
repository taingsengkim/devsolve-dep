"use client";

import { useCallback, useEffect, useState } from "react";
import {
  useGetDiscussionsQuery,
  useGetDiscussionTopicsQuery,
  useGetTrendingTagsQuery,
  useGetDiscussionStatsQuery,
} from "@/lib/redux/services/discussionsApi";
import type {
  DiscussionCategory,
  DiscussionSort,
  TopicFilter,
} from "@/lib/types/dicussion/types";

const DEFAULT_LIMIT = 3;
const DEFAULT_SORT: DiscussionSort = "newest";
const SEARCH_DEBOUNCE_MS = 300;

export function useDiscussionFilters() {
  const [category, setCategory] = useState<DiscussionCategory>("All");
  const [topic, setTopic] = useState<TopicFilter | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<DiscussionSort>(DEFAULT_SORT);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  // `searchInput` drives the text field (instant); `searchQuery` drives the
  // query (debounced) so typing doesn't fire a request per keystroke.
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const trimmed = searchInput.trim();
    if (trimmed === searchQuery) return;
    const timeout = setTimeout(() => {
      setSearchQuery(trimmed);
      setPage(1);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [searchInput, searchQuery]);

  // Any filter change returns to the first page.
  const handleSetCategory = useCallback((value: DiscussionCategory) => {
    setCategory(value);
    setPage(1);
  }, []);

  const handleSetTopic = useCallback((value: TopicFilter | null) => {
    setTopic(value);
    setPage(1);
  }, []);

  const handleSetTag = useCallback((value: string | null) => {
    setTag(value);
    setPage(1);
  }, []);

  const handleSetSort = useCallback((value: DiscussionSort) => {
    setSort(value);
    setPage(1);
  }, []);

  const handleSetSearch = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  }, []);

  const handleSetLimit = useCallback((value: number) => {
    setLimit(value);
    setPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setCategory("All");
    setTopic(null);
    setTag(null);
    setSearchInput("");
    setSearchQuery("");
    setSort(DEFAULT_SORT);
    setPage(1);
  }, []);

  // RTK Query hooks
  const discussionsResult = useGetDiscussionsQuery({
    category,
    topic,
    tag,
    searchQuery,
    sort,
    page,
    limit,
  });

  const topicsResult = useGetDiscussionTopicsQuery();
  const tagsResult = useGetTrendingTagsQuery();
  const statsResult = useGetDiscussionStatsQuery();

  const hasActiveFilters =
    category !== "All" || topic !== null || tag !== null || searchQuery !== "";

  return {
    // Filter state
    category,
    topic,
    tag,
    sort,
    searchInput,
    searchQuery,
    page,
    limit,
    hasActiveFilters,
    // Filter handlers
    setCategory: handleSetCategory,
    setTopic: handleSetTopic,
    setTag: handleSetTag,
    setSort: handleSetSort,
    setSearchQuery: handleSetSearch,
    clearSearch: handleClearSearch,
    setPage,
    setLimit: handleSetLimit,
    resetFilters: handleResetFilters,
    // Query results
    discussionsResult,
    topicsResult,
    tagsResult,
    statsResult,
  };
}
