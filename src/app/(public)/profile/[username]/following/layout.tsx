import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo/metadata";

/** See the sibling followers route — the same social graph view, inverted. */
export const metadata: Metadata = {
  title: "Following",
  robots: NO_INDEX,
};

export default function FollowingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
