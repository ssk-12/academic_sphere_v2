import { Suspense } from "react"
import { getEvent } from "@/actions/class"
import { EventDetails } from "./components/EventDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"



export default async function Event({
  params,
}: {
  params: Promise<{ eventId: string }>
}) {
  const { eventId } = await params;
  return (
    <div className="container mx-auto py-2">
      <Suspense fallback={<EventSkeleton />}>
        <EventContent id={eventId} />
      </Suspense>
    </div>
  )
}

async function EventContent({ id }: { id: string }) {
  let event = await getEvent(id)
  // console.dir(event, {depth: null});
  if (!event) {
    return <div className="text-center text-xl font-semibold">Event not found</div>
  }

  const mappedEvent = {
    ...event,
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
  return <EventDetails event={mappedEvent} />
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
