"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

export default function FollowButton() {
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <button
      onClick={() => setIsFollowing((prev) => !prev)}
      className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium shadow-sm transition ${
        isFollowing
          ? "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isFollowing ? <Check size={15} /> : <Plus size={15} />}
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}