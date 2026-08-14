import type { Metadata } from "next";
import { ProblemEditScreen } from "@/components/discussions/create/ProblemEditScreen";
import { NO_INDEX } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

/* An editor only its author can open, over content that already has a public
   URL of its own — nothing here belongs in a search result. */
export const metadata: Metadata = {
  title: "Edit problem",
  robots: NO_INDEX,
};

/**
 * Editing one problem. It sits under the problem's own route so the URL says
 * what is being edited, and so the back-links have somewhere obvious to go.
 */
export default async function EditProblemPage({ params }: PageProps) {
  const { id } = await params;

  return <ProblemEditScreen problemId={id} />;
}
