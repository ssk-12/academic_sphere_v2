'use client'

import { useState, useEffect, startTransition } from 'react'
import { useActionState } from 'react'
import { updateChapter } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Chapter } from '@prisma/client'

interface UpdateChapterFormProps {
  chapter: Chapter
}

export function UpdateChapterForm({ chapter }: UpdateChapterFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(updateChapter, initialState)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.append('chapterId', chapter.id)
    startTransition(() => {
      formAction(formData)
    })
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
          <DialogTitle>Update Chapter</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Chapter Name</Label>
            <Input id="name" name="name" defaultValue={chapter.name} required />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update Chapter'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

