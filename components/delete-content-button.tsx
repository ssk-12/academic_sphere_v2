'use client'

import { useActionState } from 'react'
import { deleteContent } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {useEffect} from 'react'

interface DeleteContentButtonProps {
  contentId: string
}

export function DeleteContentButton({ contentId }: DeleteContentButtonProps) {
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(deleteContent, initialState)

  const handleDelete = () => {
    formAction({ contentId })
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

