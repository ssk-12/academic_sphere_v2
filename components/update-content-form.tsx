'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { updateContent } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Content } from '@prisma/client'

interface UpdateContentFormProps {
  content: Content
}

export function UpdateContentForm({ content }: UpdateContentFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(updateContent, initialState)

  const handleSubmit = (formData: FormData) => {
    formData.append('contentId', content.id)
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
        <Button variant="outline" size="sm">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Content</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={content.title} required />
          </div>
          <div>
            <Label htmlFor="body">Content (Markdown supported)</Label>
            <Textarea id="body" name="body" rows={10} defaultValue={content.body} required />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Content'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

