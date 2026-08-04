"use client";

import Image from "next/image";
import { tintFor } from "./leaderboard-ui";

type Props = {
  username: string;
  displayName: string;
  avatarUrl?: string;
  initials: string;
  size?: number;
  className?: string;
};

/**
 * Avatar with an initials fallback. The fallback is the default rather than
 * the exception, so the board never renders a broken image well.
 */
export default function ResearcherAvatar({
  username,
  displayName,
  avatarUrl,
  initials,
  size = 40,
  className = "",
}: Props) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={displayName}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ring-1 ring-slate-200 ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tracking-tight ring-1 ${tintFor(
        username,
      )} ${className}`}
    >
      {initials}
    </span>
  );
}
