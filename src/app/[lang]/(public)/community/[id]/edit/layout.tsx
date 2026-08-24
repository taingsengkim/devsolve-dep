import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo/metadata";

/**
 * Pass-through layout covering /community/[id]/edit.
 *
 * The edit form is a drafting surface, not a document: a crawler reaching it
 * finds an empty editor rather than the problem's content. robots.txt also
 * disallows community/star/edit, but a URL someone links to can still be
 * listed in search results even when crawling is blocked — robots: noindex
 * here is the second line of defence that actually prevents indexing.
 */
export const metadata: Metadata = {
  robots: NO_INDEX,
};

export default function EditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
