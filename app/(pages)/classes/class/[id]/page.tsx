import { Suspense } from 'react'
import { getClassWithAccessCheck } from '@/actions/class'
import { ClassOverview } from '@/components/class/class-overview'
import { ClassEvents } from '@/components/class/class-events'
import { Skeleton } from '@/components/ui/skeleton'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/getSession'

export default async function ClassPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const session = await getSession();
  const userId = session?.user.id as string;
  const accessCheck = await getClassWithAccessCheck(id, userId);
if (!accessCheck.hasAccess) {
  redirect(accessCheck.redirectUrl);
}

  return (
    <div className="container mx-auto px-3">
      <Suspense fallback={<ClassOverviewSkeleton />}>
        <ClassOverviewWrapper id={id} classData={accessCheck.classData} />
      </Suspense>
      <Suspense fallback={<ClassEventsSkeleton />}>
        <ClassEventsWrapper id={id} events={accessCheck?.classData?.events || []} />
      </Suspense>
    </div>
  )
}

async function ClassOverviewWrapper({ id, classData }: { id: string , classData: any}) {
//   const session = await getSession();
//   const userId = session?.user.id as string;
//   const accessCheck = await getClassWithAccessCheck(id, userId);
// if (!accessCheck.hasAccess) {
//   redirect(accessCheck.redirectUrl);
// }
  return <ClassOverview classData={classData} />;
}

async function ClassEventsWrapper({ id, events }: { id: string, events: any }) {
  const session = await getSession();
  const userId = session?.user.id as string;
  const accessCheck = await getClassWithAccessCheck(id, userId);
if (!accessCheck.hasAccess) {
  redirect(accessCheck.redirectUrl);
}
  return <ClassEvents id={id} events={events || []} />;
}

function ClassEventsSkeleton() {
  return (
    <div className="space-y-4 mt-6">
      <Skeleton className="h-6 w-1/4" />
      <div className="space-y-2">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4">
            <Skeleton className="h-12 w-full rounded-full" />
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
      <Skeleton className=" h-52 w-full" />
      <Skeleton className=" h-10 w-1/2" />
      <div className="flex space-x-2">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-20" />
      </div>
    </div>
  )
}
