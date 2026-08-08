import { ProblemReviewDetail } from "@/components/admin/problems/ProblemReviewDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * One problem under review, opened from the approvals tab on the moderation
 * page. It lives under that route so the review flow stays in the moderation
 * area rather than becoming a separate destination.
 */
export default async function ProblemReviewDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <ProblemReviewDetail id={id} />;
}
