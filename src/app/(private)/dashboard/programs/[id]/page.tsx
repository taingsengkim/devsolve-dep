import ProgramDetailPage from '@/components/programs/details/ProgramDynamicDetailPage'
import React, { Suspense } from 'react'

export default function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="min-h-screen animate-pulse bg-card rounded-2xl p-8" />}>
      <ProgramDetailPage params={params}/>
    </Suspense>
  )
}
