import { Suspense } from 'react'
import { getClass } from '@/actions/class'
import { ClassOverview } from './components/class-overview'
import { ClassEvents } from './components/class-events'
import { Skeleton } from '@/components/ui/skeleton'

export default async function ClassPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  return (
    <div className="container mx-auto px-3">
      <Suspense fallback={<ClassOverviewSkeleton />}>
        <ClassOverviewWrapper id={id} />
      </Suspense>
      <Suspense fallback={<ClassEventsSkeleton />}>
        <ClassEventsWrapper id={id} />
      </Suspense>
    </div>
  )
}

async function ClassOverviewWrapper({ id }: { id: string }) {
  const classData = await getClass(id);
  return <ClassOverview classData={classData} />;
}

async function ClassEventsWrapper({ id }: { id: string }) {
  const classData = await getClass(id);
  return <ClassEvents id={id} events={classData?.events || []} />;
}

function ClassEventsSkeleton() {
  return (
    <div className="space-y-4 mt-6">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )


}
function ClassOverviewSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}
