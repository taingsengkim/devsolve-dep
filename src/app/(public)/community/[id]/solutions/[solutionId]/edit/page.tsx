import { SolutionEditScreen } from "@/components/discussions/create/SolutionEditScreen";

interface PageProps {
  params: Promise<{ solutionId: string }>;
}

/**
 * Editing one answer. It sits under the problem it answers, matching the
 * create route a segment above it, so the URL says what is being edited.
 */
export default async function EditSolutionPage({ params }: PageProps) {
  const { solutionId } = await params;

  return <SolutionEditScreen solutionId={solutionId} />;
}
