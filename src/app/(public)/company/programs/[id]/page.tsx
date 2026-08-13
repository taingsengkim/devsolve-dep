import ProgramDetailPage from '@/components/programs/details/ProgramDynamicDetailPage'
import React from 'react'

export default function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className='min-h-screen max-w-[1280px] px-7 mx-auto'>
      <ProgramDetailPage params={params}/>
    </div>
  )
}
