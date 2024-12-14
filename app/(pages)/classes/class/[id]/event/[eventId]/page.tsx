import { Suspense } from "react"
import { getEvent, getEventWithAccessCheck } from "@/actions/class"
import { EventDetails } from "./components/EventDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getSession } from "@/lib/getSession"
import { redirect } from "next/navigation"



export default async function Event({
  params,
}: {
  params: Promise<{ eventId: string, id: string }>
}) {
  const { eventId, id } = await params;
  const session = await getSession();
  const userId = session?.user.id as string;
  const accessCheck = await getEventWithAccessCheck(id, eventId, userId);
  if (!accessCheck.hasAccess) {
    redirect(accessCheck.redirectUrl);
  }
  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<EventSkeleton />}>
        <EventContent id={eventId} userId={userId} />
      </Suspense>
    </div>
  )
}

async function EventContent({ id, userId }: { id: string, userId: string }) {
  let event = await getEvent(id)
  console.dir(event, {depth: null});
  if (!event) {
    return <div className="text-center text-xl font-semibold">Event not found</div>
  }

  const mappedEvent = {
    ...event,
    userId,
    class: {
      ...event.class,
      createdBy: {
        ...event.class.createdBy,
        name: event.class.createdBy.fullName,
      },
    },
  };

  

  if (!event) {
    return <div className="text-center text-xl font-semibold">Event not found</div>
  }
  return <EventDetails event={mappedEvent}  />
}

function EventSkeleton() {
  return (
    <div className="space-y-4">
    <Skeleton className=" h-64 w-full" />
    <Skeleton className=" h-10 w-1/2" />
    <div className="flex space-x-2">
      <Skeleton className="h-10 w-20" />
      <Skeleton className="h-10 w-20" />
    </div>
  </div>
  )
}
