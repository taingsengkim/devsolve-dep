"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoteValue = 1 | -1;

interface VoteControlProps {
  voteCount: number;
  currentVote?: number | null;
  onVote: (value: VoteValue) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
  upvoteLabel?: string;
  downvoteLabel?: string;
}

export function VoteControl({
  voteCount,
  currentVote = 0,
  onVote,
  isLoading = false,
  className,
  upvoteLabel = "Upvote",
  downvoteLabel = "Downvote",
}: VoteControlProps) {
  return (
    <div
      className={cn(
        "inline-flex items-stretch rounded-lg shadow-sm shadow-black/5",
        className,
      )}
    >
      <Button
        type="button"
        variant={currentVote === 1 ? "default" : "outline"}
        size="icon"
        onClick={() => void onVote(1)}
        disabled={isLoading}
        aria-pressed={currentVote === 1}
        aria-label={
          currentVote === 1
            ? `Remove ${upvoteLabel.toLowerCase()}`
            : upvoteLabel
        }
        className="rounded-e-none shadow-none focus-visible:z-10"
      >
        <ChevronUp data-icon aria-hidden="true" />
      </Button>

      <span className="-mx-px flex min-w-12 items-center justify-center border border-input bg-background px-3 text-sm font-medium tabular-nums text-foreground">
        {voteCount}
      </span>

      <Button
        type="button"
        variant={currentVote === -1 ? "destructive" : "outline"}
        size="icon"
        onClick={() => void onVote(-1)}
        disabled={isLoading}
        aria-pressed={currentVote === -1}
        aria-label={
          currentVote === -1
            ? `Remove ${downvoteLabel.toLowerCase()}`
            : downvoteLabel
        }
        className="rounded-s-none shadow-none focus-visible:z-10"
      >
        <ChevronDown data-icon aria-hidden="true" />
      </Button>
    </div>
  );
}
