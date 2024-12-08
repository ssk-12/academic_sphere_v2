 "use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarPlus, MapPin } from 'lucide-react'
import { createEvent } from "@/actions/class"
import { useActionState } from "react";

export function ClassEvents({ events, id }: { events: any[], id:string }) {
    const initialState = {
        message: '',
        success: true,
        id: id
    }
    const [actionState, dispatch, isPending] = useActionState(createEvent,initialState);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Class Events</CardTitle>
        <form action={dispatch}>
          <Button type="submit" size="sm">
            <CalendarPlus className="mr-2 h-4 w-4" />{isPending? "Creating": "Create Event"} 
          </Button>
        </form>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {events.map((event) => (
            <li key={event.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <h3 className="font-medium">{event.name}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
              <div className="flex items-center space-x-4 mt-2">
                <p className="text-xs text-muted-foreground">
                  {new Date(event.date).toLocaleString()}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="mr-1 h-3 w-3" />
                  {event.location}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

