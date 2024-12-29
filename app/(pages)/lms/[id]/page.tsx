import { Suspense } from 'react'
import { fetchLMSDetails } from '@/actions/lms'
import { LMSDetailsView } from '@/components/lms/lms-details-view'
import { redirect } from 'next/navigation'

export default async function LMSDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const { lms, isCreator } = await fetchLMSDetails({ lmsId: id })

  if (!lms) {
    redirect("/unauthorized")
  }

  return (
    <Suspense fallback={<div>Loading LMS details...</div>}>
      <LMSDetailsView lms={lms} isCreator={isCreator} />
    </Suspense>
  )
}

