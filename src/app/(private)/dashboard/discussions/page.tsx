"use client";
import Link from "next/link";
import React, { useState, useMemo } from "react";
import { MOCK_DISCUSSIONS , MOCK_TOPICS,
  MOCK_TRENDING_TAGS, } from "@/lib/types/dicussion/discussionMockData";
import { DiscussionCategory, TopicFilter } from "@/lib/types/dicussion/types";
import { DiscussionCard } from "@/components/discussions/DiscussionCard";
import { Search, Plus, Bell, Moon, Sun, ChevronLeft, ChevronRight } from "lucide-react";


export default function DiscussionsPage() {
  const [selectedCategory, setSelectedCategory] = useState<DiscussionCategory>("All");
  const [selectedTopic, setSelectedTopic] = useState<TopicFilter | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Filter Logic
  const filteredPosts = useMemo(() => {
    return MOCK_DISCUSSIONS.filter((post) => {
      // Category filter
      if (selectedCategory !== "All" && post.category !== selectedCategory) {
        return false;
      }
      // Topic filter
      if (selectedTopic && post.topic !== selectedTopic) {
        return false;
      }
      // Tag filter
      if (selectedTag && !post.tags.includes(selectedTag)) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(query);
        const matchDesc = post.description.toLowerCase().includes(query);
        const matchTag = post.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }
      return true;
    });
  }, [selectedCategory, selectedTopic, selectedTag, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans pb-16">
      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* Header Title & Top Controls */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Discussions</h1>

          {/* Quick Header Tools */}
          <div className="flex items-center space-x-3">
            <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors">
              <Bell className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors">
              <Moon className="h-4 w-4" />
            </button>
            <span className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600">
              En
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problems, tags, keywords..."
            className="w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 py-3 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-xs"
          />
        </div>

        {/* Category Pills & Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-2xl">
            {(["All", "Problems", "Showcase"] as DiscussionCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-xl px-5 py-2 text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button className="flex items-center space-x-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <Link href="discussions/create">
             <span>Add Post</span>
            </Link>
           
          </button>
        </div>

        {/* Results Counter */}
        <p className="text-xs text-slate-400 font-medium mb-4">
          <span className="font-bold text-blue-600">{filteredPosts.length}</span>{" "}
          {filteredPosts.length === 1 ? "problem" : "problems"} found
        </p>

        {/* Main Content Layout (Feed + Right Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Feed Column */}


          <div className="lg:col-span-3 space-y-4 ">

            
             {filteredPosts.length > 0 ? (
              filteredPosts.map((post) =>
                
                
                 < DiscussionCard key={post.id} post={post} />

            )
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white= p-12 text-center">
                <p className="text-sm font-semibold text-slate-700">No discussions match your filter.</p>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setSelectedTopic(null);
                    setSelectedTag(null);
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs font-bold text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
           
           


            {/* Pagination Control */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-slate-200 pt-6 gap-4">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <span>Rows per page</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => setRowsPerPage(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>

                <div className="flex space-x-1">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === page
                          ? "bg-slate-900 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="flex items-center space-x-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Analytics Sidebar */}
          <div className="space-y-6">
            {/* All Topics */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-slate-900">All Topics</h3>
                <span className="text-[10px] text-slate-400 font-semibold">847</span>
              </div>
              <div className="space-y-1">
                {MOCK_TOPICS.map((topic) => {
                  const isActive = selectedTopic === topic.name;
                  return (
                    <button
                      key={topic.name}
                      onClick={() =>
                        setSelectedTopic(isActive ? null : topic.name)
                      }
                      className={`w-full flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span>{topic.name}</span>
                      <span
                        className={`text-[10px] font-bold ${
                          isActive ? "text-blue-100" : "text-slate-400"
                        }`}
                      >
                        {topic.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold text-slate-900 mb-3">Trending Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {MOCK_TRENDING_TAGS.map((tag) => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(isActive ? null : tag)}
                      className={`rounded-md px-2.5 py-1 text-[11px] font-mono transition-colors ${
                        isActive
                          ? "bg-blue-600 text-white font-bold"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 border-b border-slate-100 pb-2">
                Platform Stats
              </h3>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Problems</span>
                <span className="font-bold text-blue-600">847</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Solutions</span>
                <span className="font-bold text-blue-600">3,241</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Researchers</span>
                <span className="font-bold text-blue-600">12,480</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}