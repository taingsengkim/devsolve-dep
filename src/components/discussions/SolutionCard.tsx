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
  Heart,
  MessageSquare,
} from "lucide-react";

interface CommentNode {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  content: string;
  createdAt: string;
  replyToAuthor?: string;
  likes?: number;
  isLiked?: boolean;
  replies?: CommentNode[];
}

interface SolutionCardProps {
  solution: SolutionItem;
  index: number;
}

const MAX_INDENT_DEPTH = 3;

export const SolutionCard: React.FC<SolutionCardProps> = ({ solution, index }) => {
  const [votes, setVotes] = useState(solution.votes);
  const [hasVoted, setHasVoted] = useState(false);
  const [activeTab, setActiveTab] = useState<"explanation" | "step-by-step" | "code" | "diagram">(
    "explanation"
  );
  const [isExpanded, setIsExpanded] = useState(solution.type === "rich");

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

  const toggleLikeInTree = (list: CommentNode[], commentId: string): CommentNode[] => {
    return list.map((item) => {
      if (item.id === commentId) {
        const currentlyLiked = !!item.isLiked;
        return {
          ...item,
          isLiked: !currentlyLiked,
          likes: (item.likes || 0) + (currentlyLiked ? -1 : 1),
        };
      }
      if (item.replies && item.replies.length > 0) {
        return {
          ...item,
          replies: toggleLikeInTree(item.replies, commentId),
        };
      }
      return item;
    });
  };

  const handleToggleLike = (commentId: string) => {
    setComments(toggleLikeInTree(comments, commentId));
  };

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
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments([...comments, newComment]);
    setNewTopComment("");
  };

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

  const handleSendReply = (parentComment: CommentNode) => {
    if (!replyContent.trim()) return;

    const newReply: CommentNode = {
      id: `r-${Date.now()}`,
      author: {
        name: "Jame",
        avatarUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=Jame",
      },
      content: replyContent.trim(),
      createdAt: "Just now",
      replyToAuthor: parentComment.author.name,
      likes: 0,
      isLiked: false,
      replies: [],
    };

    setComments(addReplyToTree(comments, parentComment.id, newReply));
    setReplyContent("");
    setActiveReplyId(null);
  };

  // Helper to count total replies recursively in a comment subtree
  const countSubReplies = (comment: CommentNode): number => {
    if (!comment.replies || comment.replies.length === 0) return 0;
    return comment.replies.reduce((acc, child) => acc + 1 + countSubReplies(child), 0);
  };

  // Component for Individual Comment Items with Expand/Collapse State
  const RenderCommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: CommentNode;
    depth?: number;
  }) => {
    const [showReplies, setShowReplies] = useState(false); // Collapsed by default!
    const isReplying = activeReplyId === comment.id;
    const shouldIndent = depth > 0 && depth <= MAX_INDENT_DEPTH;
    const totalReplies = countSubReplies(comment);

    return (
      <div className={`space-y-1.5 ${shouldIndent ? "ml-4 border-l border-slate-200 pl-2.5 sm:ml-5 sm:pl-3" : ""}`}>
        {/* Main Comment Box */}
        <div className="group flex items-start justify-between rounded-lg bg-slate-50 p-2 text-xs text-slate-600">
          <div className="flex items-start space-x-2 flex-1 min-w-0 pr-2">
            <img
              src={comment.author.avatarUrl}
              alt={comment.author.name}
              className="h-4 w-4 rounded-full mt-0.5 shrink-0"
            />
            <div className="leading-snug break-words min-w-0 flex-1">
              <span className="font-bold text-slate-800 mr-1.5">{comment.author.name}:</span>

              {comment.replyToAuthor && (
                <span className="font-semibold text-blue-600 bg-blue-50 px-1 py-0.5 rounded text-[11px] mr-1 inline-block">
                  @{comment.replyToAuthor}
                </span>
              )}

              <span>{comment.content}</span>
              <span className="text-[10px] text-slate-400 ml-2 inline-block">{comment.createdAt}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Love Button */}
            <button
              type="button"
              onClick={() => handleToggleLike(comment.id)}
              className={`flex items-center space-x-1 text-[11px] transition-colors ${
                comment.isLiked ? "text-rose-500 font-bold" : "text-slate-400 hover:text-rose-500"
              }`}
            >
              <Heart className={`h-3 w-3 ${comment.isLiked ? "fill-rose-500 text-rose-500" : ""}`} />
              {Boolean(comment.likes) && <span>{comment.likes}</span>}
            </button>

            {/* Reply Trigger */}
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
        </div>

        {/* Sub-reply Input */}
        {isReplying && (
          <div className="flex items-center space-x-2 pt-1 pl-2">
            <CornerDownRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />

            <div className="flex-1 flex items-center rounded-lg border border-blue-300 bg-white px-2.5 py-1 text-xs focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
              <span className="text-blue-600 font-semibold mr-1.5 shrink-0 text-[11px]">
                @{comment.author.name}
              </span>
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSendReply(comment);
                    setShowReplies(true); // Automatically open thread on new reply!
                  }
                }}
                placeholder="Write a reply..."
                className="w-full bg-transparent focus:outline-none"
                autoFocus
              />
            </div>

            <button
              type="button"
              onClick={() => {
                handleSendReply(comment);
                setShowReplies(true);
              }}
              className="rounded-lg bg-blue-600 p-1 text-white hover:bg-blue-700 transition-colors shrink-0"
            >
              <Send className="h-3 w-3" />
            </button>
          </div>
        )}

        {/* Toggle Button for viewing sub-replies */}
        {totalReplies > 0 && (
          <div className="pl-2 pt-0.5">
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <MessageSquare className="h-3 w-3 text-slate-400" />
              <span>
                {showReplies
                  ? "Hide replies"
                  : `View ${totalReplies} ${totalReplies === 1 ? "reply" : "replies"}`}
              </span>
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${
                  showReplies ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>
        )}

        {/* Hidden / Expandable Child Replies */}
        {showReplies && comment.replies && comment.replies.length > 0 && (
          <div className="space-y-1.5 pt-1">
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
      {solution.isAccepted && (
        <div className="flex items-center space-x-2 bg-emerald-50 border-b border-emerald-100 px-5 py-2 text-xs font-bold text-emerald-700">
          <Check className="h-4 w-4 text-emerald-600" />
          <span>Accepted Solution</span>
        </div>
      )}

      {/* Main Body */}
      <div className="p-5">
        <div className="flex items-start space-x-4">
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

          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-700 leading-relaxed">{solution.explanation}</p>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <img
                  src={solution.author.avatarUrl}
                  alt={solution.author.name}
                  className="h-5 w-5 rounded-full bg-slate-100"
                />
                <span className="font-semibold text-slate-700">{solution.author.name}</span>
                <span>•</span>
                <span>answered {solution.createdAt}</span>
              </div>
            </div>

            {/* Threaded Comments */}
            <div className="mt-4 border-t border-slate-100 pt-3 space-y-2">
              {comments.map((comment) => (
                <RenderCommentItem key={comment.id} comment={comment} />
              ))}

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