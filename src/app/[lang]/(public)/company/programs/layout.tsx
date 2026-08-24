import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo/metadata";

/**
 * Pass-through layout for the organization-scoped program list, whose page is
 * a client component.
 *
 * The list is driven entirely by a query parameter naming the organization, so
 * the bare URL has no content of its own and each variant duplicates rows
 * already listed under `/programs`. The nested `[id]` route replaces this with
 * its own metadata, which points its canonical at the primary program URL.
 */
/* Robots only, no title. A title set on a layout — in any form, plain or
   `absolute` — replaces the root title template for every segment beneath it,
   and the nested program detail needs that template for its `· DevSolve`
   suffix. The list itself is unindexed, so it keeps the site's default title. */
export const metadata: Metadata = {
  robots: NO_INDEX,
};

export default function CompanyProgramsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
