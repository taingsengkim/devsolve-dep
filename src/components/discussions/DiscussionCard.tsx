"use client";

import React, { useState } from "react";
import Link from "next/link";
import { DiscussionPost } from "@/lib/types/dicussion/types";
import { ChevronUp, MessageSquare, Eye, Bookmark, CheckCircle2, CircleDot } from "lucide-react";

interface DiscussionCardProps {
  post: DiscussionPost;
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({ post }) => {
  const [votes, setVotes] = useState(post.votes);
  const [isUpvoted, setIsUpvoted] = useState(post.isUpvoted || false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpvoted) {
      setVotes((prev) => prev - 1);
      setIsUpvoted(false);
    } else {
      setVotes((prev) => prev + 1);
      setIsUpvoted(true);
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
  };

  return (
    <div>
    <Link href={`discussions/${post.id}`} className="block group-hover:text-blue-600"> 
    <div className="group flex space-x-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">

      {/* Vote Pillar */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleVote}
          className={`flex flex-col items-center justify-center rounded-xl px-2.5 py-2 transition-colors ${
            isUpvoted
              ? "bg-blue-600 text-white"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100"
          }`}
          aria-label="Upvote"
        >
          <ChevronUp className="h-4 w-4" />
          <span className="text-xs font-bold mt-0.5">{votes}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {/* Title & Category Topic */}
        
        <div className="flex items-start justify-between gap-2">
          {/* <Link href={`dashboard/discussions/${post.id}`} className="block group-hover:text-blue-600"> */}
            <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
              {post.title}
            </h3>
          {/* </Link> */}
          <span className="shrink-0 rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {post.topic}
          </span>
        </div>

        {/* Thumbnail Preview for Showcase */}
        {post.category === "Showcase" && post.thumbnailUrl && (
          <div className="mt-3 flex gap-4 items-center">
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="h-24 w-36 object-cover rounded-xl border border-slate-200"
            />
            <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
              {post.description}
            </p>
          </div>
        )}

        {/* Standard Text Description */}
        {post.category !== "Showcase" && (
          <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2">
            {post.description}
          </p>
        )}

        {/* Tags or Tech Stack */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.techStack
            ? post.techStack.map((tech, i) => (
                <span
                  key={i}
                  className="rounded-md bg-purple-50 px-2 py-0.5 text-[11px] font-mono text-purple-700"
                >
                  {tech}
                </span>
              ))
            : post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono text-slate-600"
                >
                  {tag}
                </span>
              ))}
        </div>

        {/* Card Footer Metadata */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <MessageSquare className="h-3.5 w-3.5" />
              <span>{post.answersCount} {post.category === "Showcase" ? "comments" : "answers"}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{post.viewsCount.toLocaleString()}</span>
            </span>

            {/* Status Badge */}
            {post.status && (
              <span
                className={`inline-flex items-center space-x-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  post.status === "Solved"
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {post.status === "Solved" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <CircleDot className="h-3 w-3" />
                )}
                <span>{post.status}</span>
              </span>
            )}
          </div>

          {/* Author info & Bookmark */}
          <div className="flex items-center space-x-3 mt-2 sm:mt-0">
            <div className="flex items-center space-x-2">
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="h-5 w-5 rounded-full bg-slate-100"
              />
              <span className="text-xs font-semibold text-slate-700">{post.author.name}</span>
            </div>
            <span>•</span>
            <span>{post.createdAt}</span>

            <button
              onClick={handleBookmark}
              className={`p-1 transition-colors ${
                isBookmarked ? "text-blue-600" : "text-slate-300 hover:text-slate-500"
              }`}
            >
              <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
    </Link> 
    </div>
    
  );
};