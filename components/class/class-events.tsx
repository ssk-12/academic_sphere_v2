'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Clock, MoreVertical } from 'lucide-react'
import { CreateEventForm } from './create-event-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteEvent } from '@/actions/class'
import { toast } from '@/hooks/use-toast'

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

export function ClassEvents({ events, id, creatorId }: { events: Event[], id: string, creatorId: string }) {
  const [formattedEvents, setFormattedEvents] = useState<Event[]>([])
  const router = useRouter()

  useEffect(() => {
    const formatted = events.map(event => ({
      ...event,
      formattedDate: new Date(event.date).toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }),
    }))
    setFormattedEvents(formatted)
  }, [events])

  const handleEdit = async(eventId: string) => {
    alert(`Edit event ${eventId}`)
  }

  const handleDelete = async(eventId: string) => {
    try {
      const res = await deleteEvent(eventId, creatorId)
      if(res.success) {
        toast({title:'Event deleted successfully', description:res.message, variant: 'default'})
      } else {
        toast({title:'Error deleting event', description:res.message, variant: 'destructive'})
      }
    } catch(e) {
      console.error(e)
      toast({title:'Error deleting event', description:e.message, variant: 'destructive'})
    }
  }

  const handleEventClick = (eventId: string) => {
    router.push(`/classes/class/${id}/event/${eventId}`)
  }

  return (
    <div className="mx-[3px] my-4">
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">Class Events</CardTitle>
          <CreateEventForm id={id} />
        </CardHeader>
        <CardContent>
          {formattedEvents.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No events scheduled yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {formattedEvents.map((event) => (
                <Card
                  key={event.id}
                  className="cursor-pointer hover:shadow-lg transition flex flex-col h-full"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-semibold truncate">{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{event.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="truncate">{event.formattedDate}</span>
                    </div>
                    {event.isLocationBased && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4" />
                        <span>Location-based</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between items-center pt-2">
                    <Button variant="outline" size="sm" onClick={() => handleEventClick(event.id)}>
                      View Details
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(event.id);
                        }}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(event.id);
                          }}
                          className="text-destructive"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
