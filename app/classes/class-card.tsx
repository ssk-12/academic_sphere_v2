'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users } from 'lucide-react'
// import { deleteClass, duplicateClass } from '../actions/class-actions'
import { useToast } from "@/hooks/use-toast"


interface ClassCardProps {
  id: string
  name: string
  description: string
  students: number
}

export function ClassCard({ id, name, description, students }: ClassCardProps) {
  const { toast } = useToast()

  // async function handleDelete() {
  //   const result = await deleteClass(id)
  //   toast({
  //     title: "Success",
  //     description: result.message,
  //   })
  // }

  // async function handleDuplicate() {
  //   const result = await duplicateClass(id)
  //   toast({
  //     title: "Success",
  //     description: result.message,
  //   })
  // }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => alert('Edit functionality to be implemented')}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem>
              Duplicate
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-500 mb-4">{description}</CardDescription>
        <div className="flex items-center text-sm text-gray-500">
          <Users className="h-4 w-4 mr-1" />
          {students} students
        </div>
      </CardContent>
    </Card>
  )
}

