'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PlusCircle } from 'lucide-react'
import { enrollClass } from '@/actions/class'
import { useToast } from "@/hooks/use-toast"
import { useActionState, useState, useEffect } from "react"


export function EnrollClassForm() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const initialState = {
    message: '',
    success: true,
  }
  // const lastMessage = useRef('') 
  const [state, formAction, isPending] = useActionState(enrollClass, initialState)

  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? 'Success' : 'Error',
        description: state.message,
        variant: state.success ? 'default' : 'destructive',
      });
    }
    if(state.success) {
      setOpen(false)
    }
  }, [state]);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <PlusCircle className="h-5 w-5" />
          Join Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a New Class</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Class Id</Label>
            <Input id="id" name="id" required />
          </div>

          <Button type="submit" className="w-full">{isPending ? 'Creating...' : 'Create Class'}</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
