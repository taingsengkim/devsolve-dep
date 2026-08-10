import { SolutionCreateScreen } from "@/components/discussions/create/SolutionCreateScreen";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Answering one problem. It sits under the problem's own route so the URL says
 * what is being answered, and so the back-links have somewhere obvious to go.
 */
export default async function CreateSolutionPage({ params }: PageProps) {
  const { id } = await params;

  return <SolutionCreateScreen problemId={id} />;
}
