import { Suspense } from "react"
import { getEvent } from "@/actions/class"
import { EventDetails } from "./components/EventDetails"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"



export default async function Event({ params }: { params: { eventId: string } }) {
  const { eventId } = await params;
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<EventSkeleton />}>
        <EventContent id={params.eventId} />
      </Suspense>
    </div>
  )
}

async function EventContent({ id }: { id: string }) {
  let event = await getEvent(id)
  if (!event) {
    return <div className="text-center text-xl font-semibold">Event not found</div>
  }

  event = {
    ...event,
    class: {
      ...event.class,
      students: event.class.students.map(student => ({
        ...student,
        name: student.fullName || "Unknown",
        ...student
      }))
    }
  }
  console.log(event)
  

  if (!event) {
    return <div className="text-center text-xl font-semibold">Event not found</div>
  }
  //@ts-expect-error
  return <EventDetails event={event} />
}

function EventSkeleton() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle><Skeleton className="h-8 w-3/4" /></CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
