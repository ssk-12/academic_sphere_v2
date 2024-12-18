'use client'

import React, { useState, useEffect } from "react"
import { getAttendanceAnalytics, getClasses, getEvents } from "@/actions/analytics"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

type AnalyticsItem = {
  classId: string
  className: string
  eventAttendanceStats: {
    eventId: string
    eventName: string
    attendancePercentage: number
  }[]
}

type ClassOption = { id: string; name: string }
type EventOption = { id: string; name: string; classId: string }

const AttendanceDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsItem[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [events, setEvents] = useState<EventOption[]>([])
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [optionsLoading, setOptionsLoading] = useState<boolean>(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchClasses()
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [selectedClassIds])

  useEffect(() => {
    if (selectedClassIds.length > 0 || selectedEventIds.length > 0) {
      fetchAnalytics()
    } else {
      setAnalytics([])
    }
  }, [selectedClassIds, selectedEventIds])

  const fetchClasses = async () => {
    setOptionsLoading(true)
    try {
      const fetchedClasses = await getClasses()
      setClasses(fetchedClasses)
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch classes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOptionsLoading(false)
    }
  }

  const fetchEvents = async () => {
    setOptionsLoading(true)
    try {
      const fetchedEvents = await getEvents(selectedClassIds.length > 0 ? selectedClassIds : undefined)
      setEvents(fetchedEvents)
      setSelectedEventIds(prev => prev.filter(id => fetchedEvents.some(event => event.id === id)))
    } catch (error) {
      console.error("Error fetching events:", error)
      toast({
        title: "Error",
        description: "Failed to fetch events. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOptionsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getAttendanceAnalytics(
        selectedClassIds.length > 0 ? selectedClassIds : undefined,
        selectedEventIds.length > 0 ? selectedEventIds : undefined
      )
      setAnalytics(data)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "Failed to fetch analytics. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClassSelection = (value: string) => {
    setSelectedClassIds(prev => {
      if (prev.includes(value)) {
        return prev.filter(id => id !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const handleEventSelection = (value: string) => {
    setSelectedEventIds(prev => {
      if (prev.includes(value)) {
        return prev.filter(id => id !== value)
      } else {
        return [...prev, value]
      }
    })
  }

  const chartData = analytics.flatMap((item) =>
    item.eventAttendanceStats.map((event) => ({
      className: item.className,
      eventName: event.eventName,
      attendancePercentage: event.attendancePercentage,
    }))
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Attendance Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Classes</h3>
            {optionsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select onValueChange={handleClassSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Classes</SelectLabel>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            {selectedClassIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedClassIds.map(id => {
                  const cls = classes.find(c => c.id === id)
                  return (
                    <Button
                      key={id}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleClassSelection(id)}
                    >
                      {cls?.name} ✕
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Events</h3>
            {optionsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select onValueChange={handleEventSelection}>
                <SelectTrigger>
                  <SelectValue placeholder="Select events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Events</SelectLabel>
                    {events.map((event) => (
                      <SelectItem key={event.id} value={event.id}>
                        {event.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
            {selectedEventIds.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedEventIds.map(id => {
                  const event = events.find(e => e.id === id)
                  return (
                    <Button
                      key={id}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEventSelection(id)}
                    >
                      {event?.name} ✕
                    </Button>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Attendance %</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.length > 0 ? (
                  analytics.flatMap((item) =>
                    item.eventAttendanceStats.map((event) => (
                      <TableRow key={`${item.classId}-${event.eventId}`}>
                        <TableCell>{item.className}</TableCell>
                        <TableCell>{event.eventName}</TableCell>
                        <TableCell>{event.attendancePercentage.toFixed(2)}%</TableCell>
                      </TableRow>
                    ))
                  )
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      No data available. Please select classes and events to view analytics.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {analytics.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Attendance Chart</h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="eventName" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendancePercentage" fill="#8884d8" name="Attendance %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default AttendanceDashboard

