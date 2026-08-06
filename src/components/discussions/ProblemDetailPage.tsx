"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getProblemDetailById } from "@/lib/types/dicussion/problemDetailMockdata";
import { SolutionCard } from "@/components/discussions/SolutionCard";
import { ProblemDetail , SolutionItem  } from "@/lib/types/dicussion/types";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Bookmark,
  Share2,
  Flag,
  Plus,
  CheckCircle2,
  CircleDot,

  ExternalLink,
  Terminal,
  LayoutTemplate,
  MessageSquare,
  Send,
  Code2,
  Network,
  Cpu,
} from "lucide-react";

import { motion } from "motion/react";

export default function ProblemDetailPage() {
  const params = useParams();
  const problemId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const problem: ProblemDetail | undefined = getProblemDetailById(problemId || "1");

  const [problemVotes, setProblemVotes] = useState<number>(() => problem?.votes ?? 0);
  const [hasVotedProblem, setHasVotedProblem] = useState(false);
  const [sortOrder, setSortOrder] = useState<"votes" | "newest">("votes");
  const [showcaseTab, setShowcaseTab] = useState<"overview" | "diagram" | "code">("overview");

  // Get primary solution data if available (e.g. for step-by-step or diagram)
  const primarySolution = problem?.solutions?.[0];

  const [showcaseComments, setShowcaseComments] = useState<
    Array<{ id: string; author: { name: string; avatarUrl: string }; content: string; createdAt: string }>
  >(() => {
    if (primarySolution?.comments && primarySolution.comments.length > 0) {
      return primarySolution.comments;
    }
    return [
      {
        id: "c-1",
        author: {
          name: "Alex Dev",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Alex",
        },
        content: "Great breakdown! The architecture layout really helps clarify the data flow.",
        createdAt: "2 hours ago",
      },
    ];
  });
  const [newShowcaseComment, setNewShowcaseComment] = useState("");

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 flex flex-col items-center justify-center text-slate-800 dark:text-slate-100">
        <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-4">
          The requested discussion or post does not exist.
        </p>
        <Link
          href="/community"
          className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Community</span>
        </Link>
      </div>
    );
  }

  const handleVoteProblem = () => {
    if (hasVotedProblem) {
      setProblemVotes((v) => v - 1);
      setHasVotedProblem(false);
    } else {
      setProblemVotes((v) => v + 1);
      setHasVotedProblem(true);
    }
  };

  const handleAddShowcaseComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newShowcaseComment.trim()) return;
    setShowcaseComments([
      ...showcaseComments,
      {
        id: `sc-${Date.now()}`,
        author: {
          name: "Lor Vengroth",
          avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Lor",
        },
        content: newShowcaseComment,
        createdAt: "Just now",
      },
    ]);
    setNewShowcaseComment("");
  };

  const sortedSolutions: SolutionItem[] = [...(problem.solutions || [])].sort((a, b) => {
    if (sortOrder === "votes") {
      return b.votes - a.votes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const isShowcase = problem.category === "Showcase";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-16"
    >
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/community"
          className="inline-flex items-center space-x-2 text-base font-semibold text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Community</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {/* Main Title Header Card */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs">
              <div className="flex items-center space-x-2 mb-3">
                <span
                  className={`inline-flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                    isShowcase
                      ? "bg-blue-100 text-blue-700"
                      : problem.status === "Solved"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {isShowcase ? (
                    <LayoutTemplate className="h-3.5 w-3.5" />
                  ) : problem.status === "Solved" ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : (
                    <CircleDot className="h-3.5 w-3.5" />
                  )}
                  <span>{problem.category}</span>
                </span>

                {problem.sdlcPhase && (
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                    {problem.sdlcPhase}
                  </span>
                )}
              </div>

              <div className="flex items-start justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                  {problem.title}
                </h1>

                <div className="flex items-center space-x-1 rounded-xl border border-slate-200 bg-slate-50 p-1 shrink-0">
                  <button
                    onClick={handleVoteProblem}
                    className={`rounded-lg p-1.5 transition-colors ${
                      hasVotedProblem
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-800 px-1.5 tabular-nums">
                    {problemVotes}
                  </span>
                  <button className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {problem.tags.map((tag, i) => (
                  <span
                    key={i}
                    className={`rounded-lg px-2.5 py-1 text-xs font-mono font-medium ${
                      isShowcase
                        ? "bg-blue-50 border border-blue-200/60 text-blue-800"
                        : "bg-slate-100 border border-slate-200/60 text-slate-700"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  {isShowcase ? "Project Overview" : "Description"}
                </h3>
                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center space-x-3">
                  <button className="flex items-center space-x-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-slate-600 hover:bg-slate-50 font-medium">
                    <Bookmark className="h-4 w-4" />
                    <span>Bookmark</span>
                  </button>
                  <button className="flex items-center space-x-1.5 rounded-xl border border-slate-200 px-3.5 py-1.5 text-slate-600 hover:bg-slate-50 font-medium">
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                  <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg">
                    <Flag className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* SHOWCASE VIEW vs REGULAR PROBLEM VIEW */}
            {isShowcase ? (
              <div className="space-y-6">
                {/* Navigation Tabs for Showcase Features */}
                <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
                  <button
                    onClick={() => setShowcaseTab("overview")}
                    className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      showcaseTab === "overview"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Terminal className="h-4 w-4" />
                    <span>Steps & Implementation</span>
                  </button>
                  <button
                    onClick={() => setShowcaseTab("diagram")}
                    className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      showcaseTab === "diagram"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Network className="h-4 w-4" />
                    <span>Architecture Diagram</span>
                  </button>
                  <button
                    onClick={() => setShowcaseTab("code")}
                    className={`flex items-center space-x-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                      showcaseTab === "code"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <Code2 className="h-4 w-4" />
                    <span>Key Code Snippet</span>
                  </button>
                </div>

                {/* Tab 1: Steps & Implementation */}
                {showcaseTab === "overview" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                    <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                      <Terminal className="h-4 w-4 text-blue-600" />
                      <span>Implementation Flow</span>
                    </h3>
                    <div className="space-y-3">
                      {(primarySolution?.stepByStep || [
                        "Initialize project repository and configure Next.js App Router setup with Tailwind CSS.",
                        "Set up OAuth 2.0 Client credentials and configure PKCE code verifier and challenge generators.",
                        "Build interactive UI state machine to visualize authorization code swaps in real-time.",
                        "Add defense-in-depth security policies: HttpOnly cookies and strict Referrer-Policy headers.",
                      ]).map((step, idx) => (
                        <div
                          key={idx}
                          className="flex gap-3 items-start bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white shadow-xs">
                            {idx + 1}
                          </span>
                          <p className="text-slate-700 leading-relaxed">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tab 2: Architecture Diagram */}
                {showcaseTab === "diagram" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <Network className="h-4 w-4 text-blue-600" />
                      <span>Security Architecture Sequence Flow</span>
                    </h3>
                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 font-mono text-sm text-slate-800 leading-relaxed overflow-x-auto">
                      <pre className="text-slate-700">
{` +------------------+           +--------------------+           +----------------------+
 | Client Browser   |           |  Auth Server       |           |  Resource API        |
 +------------------+           +--------------------+           +----------------------+
          |                               |                                |
          | 1. Generate code_verifier     |                                |
          |    and code_challenge (S256)  |                                |
          |------------------------------>|                                |
          |    Get Authorization Code     |                                |
          |                               |                                |
          | 2. Exchange Code + Verifier   |                                |
          |------------------------------>|                                |
          |    Validate SHA256 match      |                                |
          |<------------------------------|                                |
          |    Return Access Token        |                                |
          |                               |                                |
          | 3. Authenticated API Call (Bearer Token)                       |
          |--------------------------------------------------------------->|
          |                                                                |`}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Tab 3: Code Snippet */}
                {showcaseTab === "code" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                      <Code2 className="h-4 w-4 text-blue-600" />
                      <span>Core Logic / Implementation Code</span>
                    </h3>
                    <pre className="rounded-xl bg-slate-900 p-4 text-sm font-mono text-blue-300 overflow-x-auto leading-relaxed">
                      {problem.codeSnippet || primarySolution?.codeFix || `// Core PKCE Challenge logic`}
                    </pre>
                  </div>
                )}

                {/* Comments Thread for Showcase */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center space-x-2">
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                    <span>Comments ({showcaseComments.length})</span>
                  </h3>

                  <div className="space-y-3 mb-4">
                    {showcaseComments.map((comment) => (
                      <div
                        key={comment.id}
                        className="text-sm text-slate-600 flex items-start space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100"
                      >
                        <img
                          src={comment.author.avatarUrl}
                          alt={comment.author.name}
                          className="h-8 w-8 rounded-full bg-slate-200"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800">
                              {comment.author.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              {comment.createdAt}
                            </span>
                          </div>
                          <p className="text-slate-700 leading-relaxed">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddShowcaseComment} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={newShowcaseComment}
                      onChange={(e) => setNewShowcaseComment(e.target.value)}
                      placeholder="Share feedback on this showcase..."
                      className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-xs"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              /* REGULAR PROBLEM VIEW */
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-base font-bold text-slate-800">
                      {problem.solutions.length} Solutions
                    </span>
                    <div className="flex items-center bg-slate-200/60 p-0.5 rounded-lg text-xs font-bold">
                      <button
                        onClick={() => setSortOrder("votes")}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          sortOrder === "votes"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500"
                        }`}
                      >
                        votes
                      </button>
                      <button
                        onClick={() => setSortOrder("newest")}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          sortOrder === "newest"
                            ? "bg-white text-slate-900 shadow-xs"
                            : "text-slate-500"
                        }`}
                      >
                        newest
                      </button>
                    </div>
                  </div>

                  <button className="flex items-center space-x-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 transition-colors">
                    <Plus className="h-4 w-4" />
                    <span>Your Solution</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {sortedSolutions.map((sol, index) => (
                    <SolutionCard key={sol.id} solution={sol} index={index} />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3.5 text-sm">
              <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wider text-xs text-slate-400">
                {isShowcase ? "Showcase Metadata" : "Problem Details"}
              </h3>
              {problem.sdlcPhase && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">SDLC Phase</span>
                  <span className="font-semibold text-slate-800 text-sm">
                    {problem.sdlcPhase}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Category</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {problem.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Views</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {problem.viewsCount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-xs">Posted</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {problem.postedDate}
                </span>
              </div>
            </div>

            {isShowcase && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-sm space-y-3">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs text-slate-400">
                  Project Links
                </h3>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  <div className="flex items-center space-x-2 font-semibold text-slate-700 text-sm">
                    <span>GitHub Repository</span>
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400" />
                </a>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs text-sm">
              <h3 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-xs text-slate-400">
                Posted By
              </h3>
              <div className="flex items-center space-x-3">
                <img
                  src={problem.postedBy.avatarUrl}
                  alt={problem.postedBy.name}
                  className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200"
                />
                <div>
                  <p className="font-bold text-slate-900 text-base">
                    {problem.postedBy.name}
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    {problem.postedBy.reputation.toLocaleString()} reputation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </motion.div>
  );
}
