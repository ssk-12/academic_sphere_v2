import { getDashboardInsights } from "@/actions/getDashboardInsights"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const insights = await getDashboardInsights()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome, {insights.profile.fullName}!</h1>
        <p className="text-muted-foreground">Here's an overview of your educational journey.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Classes Created" value={insights.stats.classesCreatedCount} />
        <StatsCard title="Classes Enrolled" value={insights.stats.classesEnrolledCount} />
        <StatsCard title="Total Events" value={insights.stats.totalEventsCreated + insights.stats.totalEventsEnrolled} />
        <StatsCard title="Students Managed" value={insights.stats.totalStudentsManaged} />
      </div>

      <Tabs defaultValue="created" className="mt-8">
        <TabsList>
          <TabsTrigger value="created">Classes Created</TabsTrigger>
          <TabsTrigger value="enrolled">Classes Enrolled</TabsTrigger>
        </TabsList>
        <TabsContent value="created">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.classesCreated.map((cls) => (
              <ClassCard 
                key={cls.id} 
                name={cls.name} 
                studentsCount={cls._count.students} 
                eventsCount={cls._count.events} 
              />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="enrolled">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {insights.classesEnrolled.map((cls) => (
              <ClassCard 
                key={cls.id} 
                name={cls.name} 
                eventsCount={cls._count.events} 
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Recent Attendances</CardTitle>
          <CardDescription>Your last 5 attendance records</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {insights.recentAttendances.map((attendance, index) => (
              <li key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{attendance.event.class.name}: {attendance.event.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(attendance.event.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  attendance.present ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {attendance.present ? 'Present' : 'Absent'}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

function StatsCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function ClassCard({ name, studentsCount, eventsCount }: { name: string; studentsCount?: number; eventsCount: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          {studentsCount !== undefined && (
            <div>
              <p className="text-muted-foreground">Students</p>
              <p className="font-medium">{studentsCount}</p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground">Events</p>
            <p className="font-medium">{eventsCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

