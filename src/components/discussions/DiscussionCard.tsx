"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Bookmark,
  CheckCircle2,
  ChevronUp,
  CircleDot,
  Eye,
  MessageSquare,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useBookmarkDiscussionMutation,
  useVoteDiscussionMutation,
} from "@/lib/redux/services/discussionsApi";
import type { DiscussionPost } from "@/lib/types/dicussion/types";
import { cn } from "@/lib/utils";

interface DiscussionCardProps {
  post: DiscussionPost;
  index?: number;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export const DiscussionCard: React.FC<DiscussionCardProps> = ({
  post,
  index = 0,
}) => {
  const [voteDiscussion, { isLoading: isVoting }] = useVoteDiscussionMutation();
  const [bookmarkDiscussion, { isLoading: isBookmarking }] =
    useBookmarkDiscussionMutation();

  const [localVotes, setLocalVotes] = useState(post.votes);
  const [localUpvoted, setLocalUpvoted] = useState(post.isUpvoted ?? false);
  const [localBookmarked, setLocalBookmarked] = useState(
    post.isBookmarked ?? false,
  );

  // Optimistic values are held locally, so re-sync whenever the server sends new
  // ones. Adjusting during render avoids a second visual pass after a refetch.
  const [syncedPost, setSyncedPost] = useState(post);
  if (
    syncedPost.votes !== post.votes ||
    syncedPost.isUpvoted !== post.isUpvoted ||
    syncedPost.isBookmarked !== post.isBookmarked
  ) {
    setSyncedPost(post);
    setLocalVotes(post.votes);
    setLocalUpvoted(post.isUpvoted ?? false);
    setLocalBookmarked(post.isBookmarked ?? false);
  }

  /* The mutations take where the card is moving to, not a toggle, so the
     optimistic state and the request can never disagree about direction. */
  const handleVote = async () => {
    if (isVoting) return;

    const upvote = !localUpvoted;
    setLocalVotes((votes) => (upvote ? votes + 1 : votes - 1));
    setLocalUpvoted(upvote);

    const result = await voteDiscussion({
      id: post.id,
      category: post.category,
      upvote,
    });

    // Nothing else holds the true count, so a rejected vote is rolled back here.
    if ("error" in result) {
      setLocalVotes((votes) => (upvote ? votes - 1 : votes + 1));
      setLocalUpvoted(!upvote);
    }
  };

  const handleBookmark = async () => {
    if (isBookmarking) return;

    const bookmarked = !localBookmarked;
    setLocalBookmarked(bookmarked);

    const result = await bookmarkDiscussion({
      id: post.id,
      category: post.category,
      bookmarked,
    });

    if ("error" in result) setLocalBookmarked(!bookmarked);
  };

  const isShowcase = post.category === "Showcase";
  const tags = isShowcase && post.techStack ? post.techStack : post.tags;
  const titleId = `discussion-title-${post.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.06 }}
      whileHover={{ y: -2 }}
    >
      <Card
        role="article"
        aria-labelledby={titleId}
        className="group relative gap-0 overflow-hidden rounded-2xl bg-card py-0 shadow-xs ring-1 ring-foreground/5 transition-shadow duration-200 hover:shadow-sm hover:ring-foreground/10 focus-within:ring-2 focus-within:ring-primary/40"
      >
        {/* A showcase is a real record with its own page; a problem is still
            served by the mock detail route under /community. */}
        <Link
          href={isShowcase ? `/showcases/${post.id}` : `/community/${post.id}`}
          className="absolute inset-0 rounded-2xl outline-none"
        >
          <span className="sr-only">Open discussion: {post.title}</span>
        </Link>

        <CardHeader className="pointer-events-none relative px-5 pt-5 pb-0 sm:px-6 sm:pt-6">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <Badge variant="ghost" className="rounded-lg text-sm">
              {isShowcase ? "Showcase" : "Problem"}
            </Badge>
            <Badge variant="secondary" className="rounded-lg text-sm">
              {post.topic}
            </Badge>
            {post.status && (
              <Badge
                variant={post.status === "Solved" ? "default" : "secondary"}
                className="rounded-lg text-sm"
              >
                {post.status === "Solved" ? (
                  <CheckCircle2 data-icon="inline-start" aria-hidden="true" />
                ) : (
                  <CircleDot data-icon="inline-start" aria-hidden="true" />
                )}
                {post.status}
              </Badge>
            )}
          </div>

          <CardTitle>
            <h3
              id={titleId}
              className="line-clamp-2 text-lg font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary sm:text-xl"
            >
              {post.title}
            </h3>
          </CardTitle>
          <CardDescription className="mt-1.5 line-clamp-2 text-base leading-relaxed text-muted-foreground">
            {post.description}
          </CardDescription>
        </CardHeader>

        <CardContent className="pointer-events-none relative flex flex-col gap-4 px-5 py-4 sm:px-6">
          {isShowcase && post.thumbnailUrl && (
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src={post.thumbnailUrl}
                alt={`${post.title} preview`}
                fill
                quality={90}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-[1.015]"
              />
            </div>
          )}

          <div className="flex flex-wrap gap-2" aria-label="Discussion tags">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="tag"
                className="rounded-lg font-mono text-sm font-medium"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pointer-events-none relative flex flex-col items-stretch gap-3 px-5 pt-0 pb-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:pb-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <Avatar size="sm">
              <AvatarImage
                src={post.author.avatarUrl}
                alt={`${post.author.name}'s avatar`}
              />
              <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 items-baseline gap-2">
              <span className="truncate text-sm font-semibold text-foreground">
                {post.author.name}
              </span>
              <span className="shrink-0 text-sm text-muted-foreground">
                {post.createdAt}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
              <span
                className="flex items-center gap-1.5"
                aria-label={`${post.answersCount} ${isShowcase ? "comments" : "answers"}`}
              >
                <MessageSquare aria-hidden="true" className="size-4" />
                <span>{post.answersCount}</span>
                <span className="hidden md:inline">
                  {isShowcase ? "comments" : "answers"}
                </span>
              </span>
              <span
                className="flex items-center gap-1.5"
                aria-label={`${post.viewsCount.toLocaleString()} views`}
              >
                <Eye aria-hidden="true" className="size-4" />
                <span>{post.viewsCount.toLocaleString()}</span>
                <span className="hidden md:inline">views</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                size="sm"
                variant={localUpvoted ? "default" : "secondary"}
                onClick={handleVote}
                disabled={isVoting}
                aria-pressed={localUpvoted}
                aria-label={localUpvoted ? "Remove upvote" : "Upvote"}
                className="pointer-events-auto min-w-16 rounded-xl"
              >
                <ChevronUp data-icon="inline-start" aria-hidden="true" />
                <span className="tabular-nums">{localVotes}</span>
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                onClick={handleBookmark}
                disabled={isBookmarking}
                aria-pressed={localBookmarked}
                aria-label={localBookmarked ? "Remove bookmark" : "Bookmark"}
                className={cn(
                  "pointer-events-auto rounded-xl",
                  localBookmarked && "text-primary",
                )}
              >
                <Bookmark
                  aria-hidden="true"
                  className={cn(localBookmarked && "fill-current")}
                />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};
