'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { updateLMS } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { LMS } from '@prisma/client'

interface UpdateLMSFormProps {
  lms: LMS
}

export function UpdateLMSForm({ lms }: UpdateLMSFormProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(updateLMS, initialState)

  const handleSubmit = (formData: FormData) => {
    formData.append('lmsId', lms.id)
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
        <Button variant="outline">Update</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update LMS</DialogTitle>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={lms.name} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={lms.description || ''} />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? 'Updating...' : 'Update LMS'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

