import type { Metadata } from "next";
import { SolutionEditScreen } from "@/components/discussions/create/SolutionEditScreen";
import { NO_INDEX } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ solutionId: string }>;
}

/* See the sibling create route: an author-only editor over already-public
   content. */
export const metadata: Metadata = {
  title: "Edit solution",
  robots: NO_INDEX,
};

/**
 * Editing one answer. It sits under the problem it answers, matching the
 * create route a segment above it, so the URL says what is being edited.
 */
export default async function EditSolutionPage({ params }: PageProps) {
  const { solutionId } = await params;

  return <SolutionEditScreen solutionId={solutionId} />;
}
