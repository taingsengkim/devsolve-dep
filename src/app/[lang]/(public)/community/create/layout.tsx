import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/seo/metadata";

/**
 * Pass-through layout covering the three composers under `/community/create`.
 *
 * Each of those pages is marked "use client", and a client module cannot
 * export metadata — so the noindex they need is declared here instead. They
 * are drafting forms: a crawler reaching one finds an empty editor, and the
 * content it would eventually produce lives at its own URL anyway.
 */
export const metadata: Metadata = {
  robots: NO_INDEX,
};

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
