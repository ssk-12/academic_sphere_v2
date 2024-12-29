import { Suspense } from 'react'
import { fetchLMSList } from '@/actions/lms'
import { CreateLMSForm } from '@/components/lms/create-lms-form'
import { LMSList } from '@/components/lms/lms-list'
import { auth } from '@/auth'


export default async function LMSPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const { privateLMS, publicLMS } = await fetchLMSList()


  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">LMS</h1>
        <CreateLMSForm userId={userId}/>
      </div>
      
      <div className="space-y-8">
        <Suspense fallback={<div>Loading private LMS...</div>}>
          <LMSList title="Private LMS" lmsList={privateLMS} />
        </Suspense>
        
        <Suspense fallback={<div>Loading public LMS...</div>}>
          <LMSList title="Public LMS" lmsList={publicLMS} />
        </Suspense>
      </div>
    </div>
  )
}

