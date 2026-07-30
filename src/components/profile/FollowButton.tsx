"use client";

import { useState } from "react";
import { Check, UserPlus } from "lucide-react";
import { motion } from "motion/react";

interface FollowButtonProps {
  initialFollowing?: boolean;
}

export default function FollowButton({ initialFollowing = false }: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={() => setIsFollowing((prev) => !prev)}
      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition shadow-2xs cursor-pointer ${
        isFollowing
          ? "border border-slate-200/80 bg-slate-100/80 text-slate-700 hover:bg-slate-200/80"
          : "bg-blue-600 text-white hover:bg-blue-700"
      }`}
    >
      {isFollowing ? <Check size={16} /> : <UserPlus size={16} />}
      <span>{isFollowing ? "Following" : "Follow"}</span>
    </motion.button>
  );
}