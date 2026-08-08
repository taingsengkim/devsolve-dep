import { ShowcaseDetail } from "@/components/showcases/detail/ShowcaseDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicShowcaseDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-[100dvh] bg-muted/30">
      <div className="mx-auto w-full max-w-4xl px-4 py-8 pb-16 sm:px-6 sm:py-10 lg:px-8">
        <ShowcaseDetail id={id} />
      </div>
    </div>
  );
}
