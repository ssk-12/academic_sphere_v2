'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { createContent } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'

interface CreateContentFormProps {
  chapterId: string
}

export function CreateContentForm({ chapterId }: CreateContentFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(createContent, initialState)

  const handleSubmit = (formData: FormData) => {
    formData.append('chapterId', chapterId)
    formAction(formData)
  }

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      })
    }
    if (state.success) {
      setOpen(false)
    }
  }, [state, toast])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="mt-4">Add Content</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Content</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" required />
          </div>
          <div>
            <Label htmlFor="body">Content (Markdown supported)</Label>
            <Textarea id="body" name="body" rows={10} required />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Creating...' : 'Create Content'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

