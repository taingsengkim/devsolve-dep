import { ShowcaseDetail } from "@/components/showcases/detail/ShowcaseDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicShowcaseDetailPage({ params }: PageProps) {
  const { id } = await params;

  /* The component owns the page shell, the way ProblemDetailPage does under
     /community/[id]. */
  return <ShowcaseDetail id={id} />;
}
