import React from "react";
import ProblemDetailPage from "@/components/discussions/ProblemDetailPage";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicDiscussionDetailPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC]">
      <ProblemDetailPage />
    </div>
  );
}
