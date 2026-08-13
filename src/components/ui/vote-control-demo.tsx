"use client";

import { VoteControl } from "@/components/ui/vote-control";

export function VoteControlDemo() {
  return (
    <VoteControl
      voteCount={235}
      currentVote={0}
      onVote={() => undefined}
      upvoteLabel="Upvote"
      downvoteLabel="Downvote"
    />
  );
}
