'use client'

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarPlus, MapPin } from 'lucide-react'
import { createEvent } from "@/actions/class"
import { useActionState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateEventForm } from './create-event-form'

export function ClassEvents({ events, id }: { events: any[], id: string }) {
  const [formattedEvents, setFormattedEvents] = useState<any[]>([]);

  useEffect(() => {
    const formatted = events.map(event => ({
      ...event,
      formattedDate: new Date(event.date).toLocaleString(),
    }));
    setFormattedEvents(formatted);
  }, [events]);


  return (
    <Card>
     <CreateEventForm  id={id}/>
      <CardContent>
        <ul className="space-y-4">
        {formattedEvents.map(event => (
        <li key={event.id} className="border-b pb-4 last:border-b-0 last:pb-0">
          <h3 className="font-medium">{event.name}</h3>
          <p className="text-sm text-muted-foreground">{event.description}</p>
          <div className="flex items-center space-x-4 mt-2">
            <p className="text-xs text-muted-foreground">{event.formattedDate}</p>
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

