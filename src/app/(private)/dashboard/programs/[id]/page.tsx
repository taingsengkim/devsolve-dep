import ProgramDetailPage from '@/components/programs/details/ProgramDynamicDetailPage'
import React from 'react'

export default function page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div>
      <ProgramDetailPage params={params}/>
    </div>
  )
}
