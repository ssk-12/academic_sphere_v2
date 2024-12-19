'use client'

import React, { useState, useEffect } from "react"
import { getAttendanceAnalytics, getClasses, getEvents } from "@/actions/analytics"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Select, Space, Button } from 'antd';
import { CloseOutlined } from '@ant-design/icons';

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

  const handleClearAllcls = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent dropdown from toggling
      setSelectedClassIds([]);
    };

    const handleClearAllev = (e: React.MouseEvent) => {
      e.stopPropagation(); // Prevent dropdown from toggling
      setSelectedEventIds([]);
    };


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
              <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select classes"  
                    value={selectedClassIds}
                    onChange={(values) => setSelectedClassIds(values)}
                    options={classes.map(cls => ({ label: cls.name, value: cls.id }))}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    suffixIcon={
                      selectedClassIds.length > 0 && (
                        <Button
                          type="text"
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={handleClearAllcls}
                          style={{ marginRight: -8 }}
                        />
                      )
                    }
                  />
            )}
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Events</h3>
            {optionsLoading ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select events"  
                    value={selectedEventIds}
                    onChange={(values) => setSelectedEventIds(values)}
                    options={events.map(ev => ({ label: ev.name, value: ev.id }))}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().includes(input.toLowerCase())
                    }
                    suffixIcon={
                      selectedClassIds.length > 0 && (
                        <Button
                          type="text"
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={handleClearAllev}
                          style={{ marginRight: -8 }}
                        />
                      )
                    }
                  />
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

