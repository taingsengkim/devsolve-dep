'use client';

import React, { useState } from "react";
import Image from "next/image";
import {
  HelpCircle,
  CheckCircle2,
  ShieldCheck,
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
  Code2,
} from "lucide-react";

interface DiscussionProps {
  id: string;
  votes: number;
  title: string;
  category: string;
  description: string;
  tags: string[];
  status?: "Solved" | "Open";
  techStackLabel?: boolean;
  answersCount?: number;
  commentsCount?: number;
  views: number;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  image?: string;
  isBookmarked?: boolean;
}

const INITIAL_DISCUSSIONS: DiscussionProps[] = [
  {
    id: "1",
    votes: 142,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN assets, etc. Is this a real exploitable vector or low risk in",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    status: "Solved",
    answersCount: 2,
    views: 2841,
    author: { name: "Alex Mercer", avatar: "/AlexMercer.avif" },
    date: "Jun 12, 2025",
    isBookmarked: false,
  },
  {
    id: "2",
    votes: 142,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN assets, etc. Is this a real exploitable vector or low risk in practice?",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    status: "Open",
    answersCount: 2,
    views: 2841,
    author: { name: "John Smat", avatar: "/profile3.jpg" },
    date: "Jun 12, 2025",
    isBookmarked: false,
  },
  {
    id: "3",
    votes: 142,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the Referer header on subsequent requests — analytics scripts, CDN assets, etc. Is this a real exploitable vector or low risk in",
    tags: ["#jwt", "#oauth", "#referer", "#token-leakage"],
    status: "Solved",
    answersCount: 2,
    views: 2841,
    author: { name: "Kun Suki", avatar: "/profile1.jpg" },
    date: "Jun 12, 2025",
    isBookmarked: false,
  },
  {
    id: "4",
    votes: 142,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the...",
    tags: ["#react", "#firebase", "#keycloak"],
    techStackLabel: true,
    commentsCount: 2,
    views: 2841,
    author: { name: "Mary Saly", avatar: "/profile2.jpg" },
    date: "Jun 12, 2025",
    image: "/computer.jpg",
    isBookmarked: false,
  },
  {
    id: "5",
    votes: 142,
    title: "JWT token leaks via Referer header on OAuth redirect",
    category: "Authentication",
    description:
      "When a user authenticates via OAuth and gets redirected back with the JWT as a query param, modern browsers send the full URL in the...",
    tags: ["#react", "#firebase", "#keycloak"],
    techStackLabel: true,
    commentsCount: 2,
    views: 2841,
    author: { name: "Ahly Noko", avatar: "/AlexMercer.avif" },
    date: "Jun 12, 2025",
    image: "/computers.jpg",
    isBookmarked: false,
  },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [discussions, setDiscussions] = useState<DiscussionProps[]>(INITIAL_DISCUSSIONS);
  const [selectedTopic, setSelectedTopic] = useState("Authentication");

  const topics = [
    { name: "All Topics", count: 847 },
    { name: "Authentication", count: 314 },
    { name: "Server-Side", count: 189 },
    { name: "JavaScript", count: 156 },
    { name: "API Security", count: 134 },
    { name: "Cryptography", count: 89 },
    { name: "Program Design", count: 65 },
  ];

  const tags = [
    "#xsrf", "#jwt", "#graphql", "#xss",
    "#rce", "#oauth", "#cors", "#idor",
    "#sql-injection", "#csrf",
  ];

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
    <div className="min-h-screen bg-[#F8FAFC] py-8 text-slate-900 font-sans antialiased">
      <div className="w-full md:w-[90%] mx-auto flex flex-col md:flex-row gap-20 px-4 md:px-0">
        
        <aside className="w-full md:w-65 shrink-0 space-y-6 text-xs">
          <div className="space-y-1">
            {topics.map((topic) => {
              const isActive = selectedTopic === topic.name;
              return (
                <button
                  key={topic.name}
                  onClick={() => setSelectedTopic(topic.name)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span>{topic.name}</span>
                  <span
                    className={`text-[11px] ${
                      isActive ? "text-blue-100" : "text-slate-400"
                    }`}
                  >
                    {topic.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            <h3 className="font-semibold text-slate-800 mb-2.5 text-xs">Trending Tags</h3>
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md text-[11px] font-medium hover:bg-slate-200 cursor-pointer transition"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <h3 className="font-semibold text-slate-800 mb-2.5 text-xs">Platform Stats</h3>
            <div className="space-y-2.5 text-slate-500 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> Problems
                </span>
                <span className="font-bold text-blue-600">857</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" /> Solutions
                </span>
                <span className="font-bold text-blue-600">3,241</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Researchers
                </span>
                <span className="font-bold text-blue-600">12,408</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0 space-y-4">
          <h1 className="text-xl font-bold text-blue-600 tracking-tight">
            Discussions
          </h1>

          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems, tags, keywords..."
              className="w-full px-5 py-3 text-xs bg-white border border-slate-200/80 rounded-full text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-2xs"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center p-1 bg-[#EAF2FF] rounded-full gap-1">
              {["All", "Problems", "Showcase"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-xs font-bold rounded-full transition-all ${
                    activeTab === tab
                      ? "bg-white text-blue-600 shadow-xs"
                      : "text-slate-700 hover:text-slate-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-2xl hover:bg-blue-700 transition shadow-xs">
              <Plus className="w-4 h-4" /> Add Post
            </button>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            <span className="text-blue-600 font-bold">1</span> problem
          </p>

          <div className="space-y-3">
            {discussions.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-4 transition-all hover:border-slate-300 flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleVote(item.id)}
                    className="flex flex-col items-center justify-center w-10 py-2.5 rounded-xl border border-slate-200/80 text-slate-500 hover:bg-slate-50 transition active:scale-95"
                  >
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-blue-600 mt-0.5">
                      {item.votes}
                    </span>
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-sm font-bold text-slate-800 leading-snug hover:text-blue-600 cursor-pointer">
                      {item.title}
                    </h2>
                    <span className="text-[11px] text-slate-400 font-medium shrink-0">
                      {item.category}
                    </span>
                  </div>

                  {item.image ? (
                    <div className="flex gap-4 mt-2">
                      <div className="relative w-40 h-20 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                        <Image
                          src={item.image}
                          alt="Post thumbnail"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                    {item.techStackLabel && (
                      <span className="text-xs font-bold text-slate-800 mr-1">
                        Tech Stack :
                      </span>
                    )}
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-3">
                      {item.answersCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          {item.answersCount} answers
                        </span>
                      )}
                      {item.commentsCount !== undefined && (
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                          {item.commentsCount} comments
                        </span>
                      )}

                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        {item.views.toLocaleString()}
                      </span>

                      {item.status === "Solved" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium text-[11px]">
                          <CheckCircle2 className="w-3 h-3" /> Solved
                        </span>
                      )}
                      {item.status === "Open" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium text-[11px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block mr-0.5" /> Open
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full overflow-hidden relative">
                          <Image
                            src={item.author.avatar}
                            alt={item.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold text-blue-600">
                          {item.author.name}
                        </span>
                      </div>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {item.date}
                      </span>
                      <button
                        onClick={() => handleBookmark(item.id)}
                        className={`transition ${
                          item.isBookmarked
                            ? "text-blue-600 fill-blue-600"
                            : "text-slate-400 hover:text-slate-600"
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* pagination  */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-4">
            <div className="flex items-center gap-2">
              <span>Rows per page</span>
              <button className="flex items-center gap-2 border border-slate-200 rounded-full px-3 py-1 font-medium text-slate-700 bg-white shadow-2xs">
                10 <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button className="flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-slate-600">
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </button>
              <button className="w-6 h-6 rounded-full border border-slate-200 text-slate-700 font-semibold flex items-center justify-center bg-white shadow-2xs">
                1
              </button>
              <button className="w-6 h-6 rounded-full text-slate-600 hover:bg-slate-100 flex items-center justify-center">
                2
              </button>
              <button className="w-6 h-6 rounded-full text-slate-600 hover:bg-slate-100 flex items-center justify-center">
                3
              </button>
              <span className="px-1 text-slate-400">•••</span>
              <button className="flex items-center gap-1 px-2 py-1 text-slate-700 hover:text-slate-900 font-medium">
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="text-center pt-16 pb-12 px-4 max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-20 h-20 flex items-center justify-center mb-1">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M50 10 L82 22 V48 C82 68 68 82 50 88 C32 82 18 68 18 48 V22 L50 10 Z"
                    stroke="#2563EB"
                    strokeWidth="6"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M38 36 L32 42 L38 48 M62 36 L68 42 L62 48 M52 33 L48 51"
                    stroke="#2563EB"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M40 58 L48 66 L78 36"
                    stroke="#10B981"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="text-2xl font-black tracking-tight text-[#0F172A]">
                Dev<span className="text-blue-600">solve</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-extrabold mt-0.5">
                Find Problems. Solve Impact.
              </span>
            </div>

            <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight pt-2">
              Help Build a More Secure Digital World
            </h2>

            <div className="text-xs text-slate-600 leading-relaxed max-w-xl mx-auto space-y-1">
              <p className="flex justify-center items-center gap-8 font-normal">
                Join DevSolve today to connect organizations and ethical hackers       through responsible vulnerability disclosure and bug bounty programs.
              </p>
            </div>

            <div className="pt-3">
              <button className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#3B82F6] hover:bg-blue-600 text-white text-xs font-semibold rounded-full transition shadow-xs">
                Get started <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>



        </main>
      </div>
    </div>
  );
}