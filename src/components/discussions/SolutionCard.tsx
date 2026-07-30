"use client";

import React, { useState } from "react";
import { SolutionItem } from "@/lib/types/dicussion/types";
import {
  ChevronUp,
  ChevronDown,
  Check,
  FileText,
  ListOrdered,
  Code2,
  Network,
  Bookmark,
  Flag,
  Send,
  CornerDownRight,
} from "lucide-react";

// Local Interface for Nested Comments
interface CommentNode {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
  replies?: CommentNode[];
}

interface SolutionCardProps {
  solution: SolutionItem;
  index: number;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ solution, index }) => {
  const [votes, setVotes] = useState(solution.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [activeTab, setActiveTab] = useState<"explanation" | "step-by-step" | "code" | "diagram">(
    "explanation"
  );
  const [isExpanded, setIsExpanded] = useState(solution.type === "rich");

  // State for threaded comments
  const [comments, setComments] = useState<CommentNode[]>(solution.comments || []);
  const [newTopComment, setNewTopComment] = useState("");
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  const handleVote = () => {
    if (hasVoted) {
      setVotes((v) => v - 1);
      setHasVoted(false);
    } else {
      setVotes((v) => v + 1);
      setHasVoted(true);
    }
  };

  // Add top-level comment
  const handleAddTopComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopComment.trim()) return;

    const newComment: CommentNode = {
      id: `c-${Date.now()}`,
      author: {
        name: "Jame",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Jame",
      },
      content: newTopComment.trim(),
      createdAt: "Just now",
      replies: [],
    };

    setComments([...comments, newComment]);
    setNewTopComment("");
  };

  // Recursive Helper to insert reply deep inside comment tree
  const addReplyToTree = (
    list: CommentNode[],
    parentId: string,
    reply: CommentNode
  ): CommentNode[] => {
    return list.map((item) => {
      if (item.id === parentId) {
        return {
          ...item,
          replies: [...(item.replies || []), reply],
        };
      }
      if (item.replies && item.replies.length > 0) {
        return {
          ...item,
          replies: addReplyToTree(item.replies, parentId, reply),
        };
      }
      return item;
    });
  };

  // Add sub-reply
  const handleSendReply = (parentId: string) => {
    if (!replyContent.trim()) return;

    const newReply: CommentNode = {
      id: `r-${Date.now()}`,
      author: {
        name: "Jame",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Jame",
      },
      content: replyContent.trim(),
      createdAt: "Just now",
      replies: [],
    };

    setComments(addReplyToTree(comments, parentId, newReply));
    setReplyContent("");
    setActiveReplyId(null);
  };

  // Recursive Comment Renderer
  const RenderCommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: CommentNode;
    depth?: number;
  }) => {
    const isReplying = activeReplyId === comment.id;

    return (
      <div className={`space-y-2 ${depth > 0 ? "ml-5 border-l border-slate-200 pl-3" : ""}`}>
        {/* Main Comment Box */}
        <div className="group flex items-start justify-between rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
          <div className="flex items-start space-x-2 flex-1 min-w-0 pr-2">
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.name}
              className="h-4 w-4 rounded-full mt-0.5 shrink-0"
            />
            <div className="leading-snug break-words">
              <span className="font-bold text-slate-800 mr-1.5">{comment.author.name}:</span>
              <span>{comment.content}</span>
              <span className="text-[10px] text-slate-400 ml-2">{comment.createdAt}</span>
            </div>
          </div>

          {/* Reply Action Trigger */}
          <button
            type="button"
            onClick={() => {
              setActiveReplyId(isReplying ? null : comment.id);
              setReplyContent("");
            }}
            className="text-[11px] font-medium text-blue-600 hover:underline shrink-0"
          >
            Reply
          </button>
        </div>

        {/* Inline Sub-reply Form */}
        {isReplying && (
          <div className="flex items-center space-x-2 pt-1 pl-2">
            <CornerDownRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendReply(comment.id)}
              placeholder={`Replying to ${comment.author.name}...`}
              className="flex-1 rounded-lg border border-blue-300 bg-white px-3 py-1 text-xs focus:border-blue-500 focus:outline-none"
              autoFocus
            />
            <button
              type="button"
              onClick={() => handleSendReply(comment.id)}
              className="rounded-lg bg-blue-600 p-1 text-white hover:bg-blue-700 transition-colors"
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Child Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-2 pt-1">
            {comment.replies.map((child) => (
              <RenderCommentItem key={child.id} comment={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all">
      {/* Accepted Header Badge */}
      {solution.isAccepted && (
        <div className="flex items-center space-x-2 bg-emerald-50 border-b border-emerald-100 px-5 py-2 text-xs font-bold text-emerald-700">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Accepted Solution</span>
        </div>
      )}

      {/* Sub-tabs bar for Rich Solutions */}
      {solution.type === "rich" && (
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-5 py-2.5 text-xs font-semibold text-slate-500">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button
              onClick={() => setActiveTab("explanation")}
              className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                activeTab === "explanation"
                  ? "bg-blue-600 text-white font-bold"
                  : "hover:bg-slate-200/60 text-slate-600"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Explanation</span>
            </button>

            {solution.stepByStep && (
              <button
                onClick={() => setActiveTab("step-by-step")}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  activeTab === "step-by-step"
                    ? "bg-blue-600 text-white font-bold"
                    : "hover:bg-slate-200/60 text-slate-600"
                }`}
              >
                <ListOrdered className="h-3.5 w-3.5" />
                <span>Step-by-step</span>
              </button>
            )}

            {solution.codeFix && (
              <button
                onClick={() => setActiveTab("code")}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  activeTab === "code"
                    ? "bg-blue-600 text-white font-bold"
                    : "hover:bg-slate-200/60 text-slate-600"
                }`}
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>Code</span>
              </button>
            )}

            {solution.hasDiagram && (
              <button
                onClick={() => setActiveTab("diagram")}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 transition-colors ${
                  activeTab === "diagram"
                    ? "bg-blue-600 text-white font-bold"
                    : "hover:bg-slate-200/60 text-slate-600"
                }`}
              >
                <Network className="h-3.5 w-3.5" />
                <span>Diagram</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="text-slate-400 hover:text-slate-600">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="text-slate-400 hover:text-slate-600">
              <Flag className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="p-5">
        <div className="flex items-start space-x-4">
          {/* Vote Column */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleVote}
              className={`rounded-lg p-1.5 transition-colors ${
                hasVoted ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-100"
              }`}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 my-0.5">{votes}</span>
            <button
              onClick={() => {
                if (hasVoted) handleVote();
              }}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>

          {/* Solution Body */}
          <div className="flex-1 min-w-0">
            {/* Header label for basic solutions */}
            {solution.type === "basic" && (
              <div
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center justify-between cursor-pointer mb-2"
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Solution #{index + 1} — Explanation</span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 text-xs flex items-center space-x-1">
                  <span>{isExpanded ? "Collapse" : "Expand"}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>
              </div>
            )}

            {/* TAB 1: EXPLANATION */}
            {activeTab === "explanation" && (
              <p className="text-xs text-slate-700 leading-relaxed">{solution.explanation}</p>
            )}

            {/* TAB 2: STEP BY STEP */}
            {activeTab === "step-by-step" && solution.stepByStep && (
              <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-2">
                  Step-By-Step Guide
                </p>
                {solution.stepByStep.map((step, i) => (
                  <div key={i} className="flex items-start space-x-2 text-xs text-slate-700">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 3: CODE FIX */}
            {activeTab === "code" && solution.codeFix && (
              <pre className="rounded-xl bg-slate-900 p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed">
                {solution.codeFix}
              </pre>
            )}

            {/* TAB 4: DIAGRAM */}
            {activeTab === "diagram" && solution.hasDiagram && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                {/* Insecure Box */}
                <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 text-center">
                  <p className="text-xs font-bold text-rose-700 mb-3">❌ Insecure — Token in Query Param</p>
                  <div className="space-y-2 text-[11px] font-semibold text-slate-700">
                    <div className="rounded-md bg-white p-2 border border-rose-100">Browser</div>
                    <div className="text-rose-500 font-mono text-[10px]">/cb?token=eyJ...</div>
                    <div className="rounded-md bg-amber-100 p-2 text-amber-800">Auth Server</div>
                    <div className="text-rose-500 font-mono text-[10px]">Referer leak</div>
                    <div className="rounded-md bg-rose-200 p-2 text-rose-900 font-bold">Analytics.js (Token Leaked!)</div>
                  </div>
                </div>

                {/* Secure Box */}
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 text-center">
                  <p className="text-xs font-bold text-emerald-700 mb-3">✅ Secure — Fragment / httpOnly Cookie</p>
                  <div className="space-y-2 text-[11px] font-semibold text-slate-700">
                    <div className="rounded-md bg-white p-2 border border-emerald-100">Browser</div>
                    <div className="text-emerald-600 font-mono text-[10px]">/cb#token=eyJ...</div>
                    <div className="rounded-md bg-emerald-100 p-2 text-emerald-800">Auth Server</div>
                    <div className="text-emerald-600 font-mono text-[10px]">No Referer sent</div>
                    <div className="rounded-md bg-emerald-200 p-2 text-emerald-900 font-bold">No Token in Referer</div>
                  </div>
                </div>
              </div>
            )}

            {/* Placeholder state for missing elements in basic view */}
            {solution.type === "basic" && !isExpanded && (
              <div className="rounded-xl border border-dashed border-slate-200 p-3 text-center text-xs text-slate-400">
                Diagram / Video not included in this basic solution.
              </div>
            )}

            {/* Author details */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <img
                  src={solution.author.avatarUrl}
                  alt={solution.author.name}
                  className="h-5 w-5 rounded-full bg-slate-100"
                />
                <span className="font-semibold text-slate-700">{solution.author.name}</span>
                <span>•</span>
                <span>{solution.author.reputation.toLocaleString()} rep</span>
                <span>•</span>
                <span>answered {solution.createdAt}</span>
              </div>
            </div>

            {/* Threaded Comments Section */}
            <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
              {/* Nested Comments Render */}
              {comments.map((comment) => (
                <RenderCommentItem key={comment.id} comment={comment} />
              ))}

              {/* Add Top-level Comment Input */}
              <form onSubmit={handleAddTopComment} className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={newTopComment}
                  onChange={(e) => setNewTopComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-slate-100 p-1.5 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};