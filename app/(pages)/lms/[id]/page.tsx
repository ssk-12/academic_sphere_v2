import { Suspense } from 'react'
import { fetchLMSDetails } from '@/actions/lms'
import { ChapterList } from '@/components/lms/chapter-list'
import { CreateChapterForm } from '@/components/lms/create-chapter-form'
import { notFound } from 'next/navigation'

export const revalidate = 0

export default async function LMSDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const { lms, isCreator } = await fetchLMSDetails({ lmsId: id })

  if (!lms) {
    notFound()
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{lms.name}</h1>
      {lms.description && <p className="mb-4">{lms.description}</p>}
      
      {isCreator && (
        <div className="mb-6">
          <CreateChapterForm lmsId={lms.id} />
        </div>
      )}
      
      <Suspense fallback={<div>Loading chapters...</div>}>
        <ChapterList chapters={lms.chapters} isCreator={isCreator} />
      </Suspense>
    </div>
  )
}

