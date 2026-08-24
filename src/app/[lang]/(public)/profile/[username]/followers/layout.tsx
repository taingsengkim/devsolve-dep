import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo/metadata";

/**
 * Pass-through layout for the followers list, whose page is a client
 * component. The list is a social graph view — names and avatars already
 * indexed on their own profiles — so it is kept out of results rather than
 * competing with them.
 */
export const metadata: Metadata = {
  title: "Followers",
  robots: NO_INDEX,
};

export default function FollowersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
