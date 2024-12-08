'use client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Users } from 'lucide-react'
// import { deleteClass, duplicateClass } from '../actions/class-actions'
import { useToast } from "@/hooks/use-toast"
import { deleteClass } from "@/actions/class"


interface ClassCardProps {
  id: string
  name: string
  description: string
  students: number
}

export function ClassCard({ id, name, description, students }: ClassCardProps) {
  const { toast } = useToast()


  const router = useRouter()

  const handleCardClick = () => {
    router.push(`/class/${id}`)
  }
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
    <Card 
      onClick={handleCardClick} 
      className="cursor-pointer transition-shadow hover:shadow-md"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={(e) => e.stopPropagation()} // Prevent card click when opening dropdown
            >
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={(e) => {
                e.stopPropagation()
                alert('Edit functionality to be implemented')
              }}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={async (e) => {
                e.stopPropagation()
                const res = await deleteClass(id)
                if (res.success) {
                  toast({
                    title: 'Success',
                    description: res.message
                  })
                } else {
                  toast({
                    title: 'Error',
                    description: res.message,
                    variant: 'destructive'
                  })
                }
              }}
            >
              Delete
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
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

