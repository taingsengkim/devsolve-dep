'use client';

import React, { useState } from "react";
import Image from "next/image";
import {
  HelpCircle,
  CheckCircle2,
  Plus,
  ChevronUp,
  MessageSquare,
  Eye,
  Bookmark,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
  Hash,
  Users,
  Zap,
  Sparkles,
  TrendingUp,
  Flame,
  Award,
} from "lucide-react";

import { Discussion, TabType } from "@/lib/types/community/types";
import {
  MOCK_DISCUSSIONS,
  MOCK_TOPICS,
  MOCK_TAGS,
  MOCK_PLATFORM_STATS,
} from "@/lib/types/community/mock-data";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [discussions, setDiscussions] = useState<Discussion[]>(MOCK_DISCUSSIONS);
  const [selectedTopic, setSelectedTopic] = useState("Authentication");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVote = (id: string) => {
    setDiscussions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  const handleBookmark = (id: string) => {
    setDiscussions((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 font-sans antialiased">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        <aside className="w-full md:w-64 lg:w-72 shrink-0 space-y-5">
          {/* Topics */}
          <div className="bg-white rounded-2xl p-5 border border-[#CBD5E1]/40">
            <h3 className="text-xs font-bold text-[#1E2B45] uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <div className="p-1.5 bg-[#2B68F6]/10 rounded-lg">
                <Hash className="w-4 h-4 text-[#2B68F6]" />
              </div>
              Topics
            </h3>
            <div className="space-y-1">
              {MOCK_TOPICS.map((topic) => {
                const isActive = selectedTopic === topic.name;
                return (
                  <button
                    key={topic.name}
                    onClick={() => setSelectedTopic(topic.name)}
                    className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#2B68F6] text-white"
                        : "text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                    }`}
                  >
                    <span className="truncate mr-2">{topic.name}</span>
                    <span
                      className={`text-[10px] shrink-0 px-2 py-0.5 rounded-full ${
                        isActive 
                          ? "bg-white/20 text-white" 
                          : "bg-[#F1F5F9] text-[#94A3B8]"
                      }`}
                    >
                      {topic.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-[#CBD5E1]/40">
            <h3 className="text-xs font-bold text-[#1E2B45] uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <div className="p-1.5 bg-orange-500/10 rounded-lg">
                <Flame className="w-4 h-4 text-orange-500" />
              </div>
              Trending Tags
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {MOCK_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#F1F5F9] text-[#64748B] rounded-full text-[10px] font-medium hover:bg-[#2B68F6] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2B68F6]/5 via-[#2B68F6]/3 to-[#1E2B45]/5 rounded-2xl p-5 border border-[#CBD5E1]/40">
            <h3 className="text-xs font-bold text-[#1E2B45] uppercase tracking-wider mb-4 flex items-center gap-2.5">
              <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              Platform Stats
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between bg-white/80 rounded-xl px-3.5 py-2.5 border border-[#CBD5E1]/20 hover:border-[#2B68F6]/30 transition-all">
                <span className="flex items-center gap-2.5 text-xs text-[#64748B] font-medium">
                  <div className="p-1.5 bg-[#2B68F6]/10 rounded-lg">
                    <HelpCircle className="w-3.5 h-3.5 text-[#2B68F6]" />
                  </div>
                  Problems
                </span>
                <span className="text-sm font-extrabold text-[#2B68F6]">
                  {MOCK_PLATFORM_STATS.problems.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between bg-white/80 rounded-xl px-3.5 py-2.5 border border-[#CBD5E1]/20 hover:border-[#10B981]/30 transition-all">
                <span className="flex items-center gap-2.5 text-xs text-[#64748B] font-medium">
                  <div className="p-1.5 bg-[#10B981]/10 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                  </div>
                  Solutions
                </span>
                <span className="text-sm font-extrabold text-[#10B981]">
                  {MOCK_PLATFORM_STATS.solutions.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between bg-white/80 rounded-xl px-3.5 py-2.5 border border-[#CBD5E1]/20 hover:border-[#2B68F6]/30 transition-all">
                <span className="flex items-center gap-2.5 text-xs text-[#64748B] font-medium">
                  <div className="p-1.5 bg-[#2B68F6]/10 rounded-lg">
                    <Users className="w-3.5 h-3.5 text-[#2B68F6]" />
                  </div>
                  Researchers
                </span>
                <span className="text-sm font-extrabold text-[#2B68F6]">
                  {MOCK_PLATFORM_STATS.researchers.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 space-y-5">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-3">
                Discussions
                <span className="text-xs font-medium text-[#64748B] bg-[#F1F5F9] px-3 py-1 rounded-full">
                  {discussions.length} posts
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#94A3B8] hidden sm:inline">Active now</span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
            </div>
          </div>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, tags, keywords..."
              className="w-full px-5 py-3.5 text-sm bg-white border border-[#CBD5E1]/60 rounded-xl text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#2B68F6] focus:ring-2 focus:ring-[#2B68F6]/10 transition-all"
            />
          </div>

          {/* Tabs & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center p-1 bg-[#F1F5F9] rounded-xl">
              {(["All", "Problems", "Showcase"] as TabType[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white text-[#2B68F6]"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-white/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-[#2B68F6] text-white rounded-xl hover:bg-[#1E4FD8] transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add Post
            </button>
          </div>

          {/* Results Count */}
          <p className="text-xs text-[#94A3B8] font-medium flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#2B68F6]"></span>
            <span className="text-[#2B68F6] font-bold">{discussions.length}</span>{" "}
            {discussions.length === 1 ? "problem" : "problems"} found
          </p>

          {/* Discussion Cards */}
          <div className="space-y-4">
            {discussions.map((item) => (
              <div
                key={item.id}
                className="group bg-white border border-[#CBD5E1]/50 rounded-2xl p-5 transition-all hover:border-[#2B68F6]/30 hover:-translate-y-0.5 flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleVote(item.id)}
                    className="flex flex-col items-center justify-center w-11 py-3 rounded-xl border border-[#CBD5E1]/50 bg-[#F8FAFC] text-[#64748B] hover:bg-[#2B68F6]/5 hover:border-[#2B68F6]/30 transition-all active:scale-95 group-hover:border-[#2B68F6]/20"
                  >
                    <ChevronUp className="w-4 h-4 text-[#94A3B8] group-hover:text-[#2B68F6]" />
                    <span className="text-sm font-bold text-[#2B68F6] mt-0.5">
                      {item.votes}
                    </span>
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-bold text-[#0F172A] leading-snug group-hover:text-[#2B68F6] transition-colors cursor-pointer">
                      {item.title}
                    </h2>
                    <span className="text-[10px] text-[#94A3B8] font-medium shrink-0 bg-[#F1F5F9] px-3 py-1 rounded-full group-hover:bg-[#2B68F6]/10 transition-colors">
                      {item.category}
                    </span>
                  </div>

                  {item.image ? (
                    <div className="flex gap-3 mt-2.5">
                      <div className="relative w-36 h-20 rounded-xl overflow-hidden shrink-0 border border-[#CBD5E1]/30 group-hover:border-[#2B68F6]/20 transition-colors">
                        <Image
                          src={item.image}
                          alt="Post thumbnail"
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="text-xs text-[#64748B] leading-relaxed line-clamp-3 flex-1">
                        {item.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-[#64748B] leading-relaxed mt-1.5 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 mt-3">
                    {item.techStackLabel && (
                      <span className="text-[10px] font-bold text-[#1E2B45] mr-0.5">
                        Tech Stack :
                      </span>
                    )}
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 bg-[#F1F5F9] text-[#64748B] rounded-full text-[10px] font-medium hover:bg-[#2B68F6] hover:text-white transition-all cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex flex-wrap items-center justify-between mt-3.5 text-[10px] text-[#94A3B8] pt-2 border-t border-[#CBD5E1]/30">
                    <div className="flex flex-wrap items-center gap-3">
                      {item.answersCount !== undefined && (
                        <span className="flex items-center gap-1.5 hover:text-[#2B68F6] transition-colors cursor-pointer">
                          <MessageSquare className="w-3 h-3 text-[#94A3B8] group-hover:text-[#2B68F6]" />
                          {item.answersCount} answers
                        </span>
                      )}
                      {item.commentsCount !== undefined && (
                        <span className="flex items-center gap-1.5 hover:text-[#2B68F6] transition-colors cursor-pointer">
                          <MessageSquare className="w-3 h-3 text-[#94A3B8] group-hover:text-[#2B68F6]" />
                          {item.commentsCount} comments
                        </span>
                      )}

                      <span className="flex items-center gap-1.5">
                        <Eye className="w-3 h-3 text-[#94A3B8]" />
                        {item.views.toLocaleString()}
                      </span>

                      {item.status === "Solved" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] font-medium text-[10px]">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Solved
                        </span>
                      )}
                      {item.status === "Open" && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2B68F6]/10 text-[#2B68F6] font-medium text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2B68F6] inline-block animate-pulse" /> Open
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-1 sm:mt-0">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full overflow-hidden relative border-2 border-[#2B68F6]/20 group-hover:border-[#2B68F6] transition-colors">
                          <Image
                            src={item.author.avatar}
                            alt={item.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-[#2B68F6] text-[10px]">
                          {item.author.name}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#94A3B8]" />
                        {item.date}
                      </span>
                      <button
                        onClick={() => handleBookmark(item.id)}
                        className={`transition-all hover:scale-110 ${
                          item.isBookmarked
                            ? "text-[#2B68F6] fill-[#2B68F6]"
                            : "text-[#94A3B8] hover:text-[#2B68F6]"
                        }`}
                      >
                        <Bookmark className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#64748B] pt-4">
            <div className="flex items-center gap-3">
              <span className="font-medium">Rows per page</span>
              <button className="flex items-center gap-2 border border-[#CBD5E1]/50 rounded-full px-3.5 py-1.5 font-medium text-[#0F172A] bg-white hover:border-[#2B68F6] transition-all">
                10 <ChevronDown className="w-3 h-3 text-[#94A3B8]" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#94A3B8] hover:text-[#0F172A] rounded-lg hover:bg-[#F1F5F9] transition-all">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button className="w-8 h-8 rounded-xl border border-[#2B68F6] bg-[#2B68F6] text-white font-bold flex items-center justify-center text-xs">
                1
              </button>
              <button className="w-8 h-8 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] flex items-center justify-center transition-all text-xs hover:text-[#0F172A]">
                2
              </button>
              <button className="w-8 h-8 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] flex items-center justify-center transition-all text-xs hover:text-[#0F172A]">
                3
              </button>
              <span className="px-1 text-[#94A3B8]">•••</span>
              <button className="flex items-center gap-1.5 px-3 py-1.5 text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-all font-medium">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}