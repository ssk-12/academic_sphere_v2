'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'
import { createClass } from '@/actions/class'
import { useToast } from "@/hooks/use-toast"


export function CreateClassForm() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    const result = await createClass(formData)
    setOpen(false)
    toast({
      title: "Success",
      description: "successfully created class",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Create Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Class</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" />
          </div>
          <Button type="submit" className="w-full">Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

