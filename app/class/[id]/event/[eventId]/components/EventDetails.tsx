"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, MapPinIcon, UsersIcon, UserIcon } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Student {
  id: string;
  name: string;
}

interface Attendance {
  id: string;
  student: Student;
  createdAt: Date;
}

interface EventDetailsProps {
  event: {
    id: string;
    name: string;
    description: string | null;
    date: Date;
    isLocationBased: boolean;
    locationLat: number | null;
    locationLng: number | null;
    proximity: number | null;
    class: {
      id: string;
      name: string;
      students: Student[];
      createdBy: {
        id: string;
        name: string;
      };
    };
    attendances: Attendance[];
  };
}

const attendanceColumns: ColumnDef<Attendance>[] = [
  {
    accessorKey: "student.name",
    header: "Student Name",
  },
  {
    accessorKey: "createdAt",
    header: "Attendance Time",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleString();
    },
  },
];

const studentColumns: ColumnDef<Student>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
  },
];

export function EventDetails({ event }: EventDetailsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAttendances = event.attendances.filter((attendance) =>
    attendance.student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredStudents = event.class.students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
  <div className="max-w-7xl mx-auto space-y-10">
    {/* Event Information Card */}
    <Card className="bg-white/10 bg-gradient-to-b from-black to-gray-900 backdrop-blur-md dark:bg-gray-800/50 border-white/10 shadow-2xl">
      <CardHeader className="space-y-2">
        <CardTitle className="text-4xl font-bold bg-gradient-to-r from-white via-gray-400 to-gray-900 dark:from-white dark:via-gray-600 dark:to-gray-100 bg-clip-text text-transparent shadow-lg">
          {event.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-10">
        <div className="grid gap-6 md:grid-cols-2">
          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">
              Event Details
            </h3>
            <p className="text-lg text-white opacity-90">
              {event.description || "No description provided."}
            </p>
            <div className="flex items-center gap-3 text-sm text-white opacity-80 hover:text-opacity-100 transition-colors">
              <CalendarIcon className="w-5 h-5" />
              <span>
                {new Date(event.date).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </span>
            </div>
          </section>

          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">
              Class Information
            </h3>
            <p className="text-lg font-medium text-white opacity-90">{event.class.name}</p>
            <div className="flex items-center gap-6 text-sm text-white opacity-80">
              <div className="flex items-center gap-2 hover:text-opacity-100 transition-colors">
                <UsersIcon className="w-5 h-5" />
                <span>{event.class.students.length} Students</span>
              </div>
              <div className="flex items-center gap-2 hover:text-opacity-100 transition-colors">
                <UserIcon className="w-5 h-5" />
                <span>Created by {event.class.createdBy.name}</span>
              </div>
            </div>
          </section>
        </div>

        {event.isLocationBased && (
          <section className="space-y-3">
            <h3 className="text-2xl font-semibold text-white bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">
              Location Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-white opacity-80 hover:text-opacity-100 transition-colors">
                <MapPinIcon className="w-5 h-5" />
                <span>Location-based event</span>
              </div>
              {event.locationLat && event.locationLng && (
                <p className="text-sm text-white opacity-70 font-mono">
                  Coordinates: {event.locationLat.toFixed(6)}, {event.locationLng.toFixed(6)}
                </p>
              )}
              {event.proximity && (
                <Badge
                  variant="secondary"
                  className="w-fit text-white hover:bg-white/20 transition-colors"
                >
                  Proximity: {event.proximity} meters
                </Badge>
              )}
            </div>
          </section>
        )}
      </CardContent>
    </Card>

    {/* Students & Attendance Card */}
    <Card className="bg-white/10 bg-gradient-to-b from-black to-gray-900 backdrop-blur-md dark:bg-gray-800/50 border-white/10 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-white bg-gradient-to-r from-gray-500 to-gray-300 bg-clip-text text-transparent">
          Students & Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="relative">
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-white/20 dark:bg-gray-800/20 text-white border-white/30 hover:border-white/50 transition-all focus-visible:ring-gray-500"
          />
        </div>
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 dark:bg-gray-800/40">
            <TabsTrigger
              value="attendance"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 text-white"
            >
              Attendance
            </TabsTrigger>
            <TabsTrigger
              value="students"
              className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-900 text-white"
            >
              Class Students
            </TabsTrigger>
          </TabsList>
          <TabsContent value="attendance" className="mt-6">
            <div className="rounded-lg border bg-white/20 dark:bg-gray-800/30">
              <DataTable
                columns={attendanceColumns}
                data={filteredAttendances}
              />
            </div>
          </TabsContent>
          <TabsContent value="students" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredStudents.map((student) => (
                <Card
                  key={student.id}
                  className="group hover:shadow-md transition-all bg-white/20 dark:bg-gray-800/30"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <Avatar className="h-12 w-12 border-2 border-transparent group-hover:border-white/20 transition-colors">
                      <AvatarFallback className="bg-gray-100 dark:bg-gray-900 text-lg">
                        {student.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-white group-hover:text-white/80 transition-colors">
                      {student.name}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  </div>
</div>


  );
}
