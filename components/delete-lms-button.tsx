'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { deleteLMS } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {useEffect, startTransition} from 'react'

interface DeleteLMSButtonProps {
  lmsId: string
}

export function DeleteLMSButton({ lmsId }: DeleteLMSButtonProps) {
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(deleteLMS, initialState)

  const handleDelete = () => {
    startTransition(() => {
      formAction({ lmsId })
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
    <Button onClick={handleDelete} disabled={isPending} variant="destructive">
      {isPending ? 'Deleting...' : 'Delete'}
    </Button>
  )
}

