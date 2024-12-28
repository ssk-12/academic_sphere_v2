'use client'

import { startTransition, useActionState } from 'react'
import { deleteChapter } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {useEffect} from 'react'

interface DeleteChapterButtonProps {
  chapterId: string
}

export function DeleteChapterButton({ chapterId }: DeleteChapterButtonProps) {
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(deleteChapter, initialState)

  const handleDelete = () => {
    startTransition(() => {
      formAction({ chapterId })
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
  }, [state, toast])

  return (
    <Button onClick={handleDelete} disabled={isPending} variant="destructive" size="sm">
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}

