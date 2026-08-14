import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo/metadata";

/**
 * Pass-through layout carrying the page's metadata.
 *
 * `about/page.tsx` is a large "use client" component built around scroll and
 * viewport hooks, and a client module cannot export metadata. Describing the
 * route from the layout above it says the same thing to a crawler without
 * splitting the page in two.
 */
export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Who builds DevSolve and why: a platform where developers solve real engineering problems together, publish what they ship, and get paid for the vulnerabilities they find.",
  path: "/about",
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
