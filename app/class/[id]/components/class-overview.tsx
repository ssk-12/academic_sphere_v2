import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarDays, Users } from 'lucide-react'

export function ClassOverview({ classData }: { classData: any }) {
  console.log(classData)
  return (
    <Card>
      <CardHeader>
        <CardTitle>{classData.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{classData.description}</p>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={`https://avatar.vercel.sh/${classData.createdBy.fullName}`} />
            <AvatarFallback>{classData.createdBy.fullName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{classData.createdBy.fullName}</p>
            <p className="text-xs text-muted-foreground">Creator</p>
          </div>
        </div>
        <div className="flex items-center space-x-4 mt-4">
          <CalendarDays className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Created on {new Date(classData.createdAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-2">
          <Users className="text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            {classData.students.length} students enrolled
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

