import { ProblemEditScreen } from "@/components/discussions/create/ProblemEditScreen";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Editing one problem. It sits under the problem's own route so the URL says
 * what is being edited, and so the back-links have somewhere obvious to go.
 */
export default async function EditProblemPage({ params }: PageProps) {
  const { id } = await params;

  return <ProblemEditScreen problemId={id} />;
}
