'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {  MapPin, Clock, MoreVertical } from 'lucide-react'
import { CreateEventForm } from './create-event-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Event = {
  name: string
  description: string | null
  id: string
  date: Date
  isLocationBased: boolean
  locationLat: number | null
  locationLng: number | null
  proximity: number | null
  classId: string
  formattedDate?: string
}

export function ClassEvents({ events, id }: { events: Event[], id: string }) {
  const [formattedEvents, setFormattedEvents] = useState<Event[]>([])
  const router = useRouter()

  useEffect(() => {
    const formatted = events.map(event => ({
      ...event,
      formattedDate: new Date(event.date).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
    }))
    setFormattedEvents(formatted)
  }, [events])

  const handleEdit = (eventId: string) => {
    alert(`Edit event ${eventId}`)
  }

  const handleDelete = (eventId: string) => {
    alert(`Delete event ${eventId}`)
  }

  const handleEventClick = (eventId: string) => {
    router.push(`/classes/class/${id}/event/${eventId}`)
  }

  return (
    <div className="mx-1 ">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Class Events</CardTitle>
          <CreateEventForm id={id} />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {formattedEvents.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No events scheduled yet.</p>
            ) : (
              formattedEvents.map((event) => (
                <Card
                  key={event.id}
                  onClick={() => handleEventClick(event.id)}
                  className="cursor-pointer hover:shadow-lg transition"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="font-semibold text-lg">{event.name}</h3>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Clock className="mr-1 h-4 w-4" />
                            {event.formattedDate}
                          </div>
                          {event.isLocationBased && (
                            <div className="flex items-center">
                              <MapPin className="mr-1 h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(event.id)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(event.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
