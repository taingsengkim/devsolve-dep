import type { Metadata } from "next";
import { SolutionCreateScreen } from "@/components/discussions/create/SolutionCreateScreen";
import { NO_INDEX } from "@/lib/seo/metadata";

interface PageProps {
  params: Promise<{ id: string }>;
}

/* A composer behind sign-in: an empty form to a crawler, and the answer it
   produces is published on the problem's own page. */
export const metadata: Metadata = {
  title: "Post a solution",
  robots: NO_INDEX,
};

/**
 * Answering one problem. It sits under the problem's own route so the URL says
 * what is being answered, and so the back-links have somewhere obvious to go.
 */
export default async function CreateSolutionPage({ params }: PageProps) {
  const { id } = await params;

  return <SolutionCreateScreen problemId={id} />;
}
