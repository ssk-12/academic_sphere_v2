'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { createLMS } from '@/actions/lms'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Select, Skeleton, Button as ButtonAnt } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { getClassesCreatedByUser } from '@/actions/class-actions'

type ClassOption = { id: string; name: string }

export function CreateLMSForm({userId}: {userId: string}) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const initialState = { message: '', success: true }
  const [state, formAction, isPending] = useActionState(createLMS, initialState)
  const [isPublic, setIsPublic] = useState(true)
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [optionsLoading, setOptionsLoading] = useState(false)

  const handleSubmit = (formData: FormData) => {
    formData.append('isPublic', isPublic.toString())
    formData.append('selectedClassIds', JSON.stringify(selectedClassIds))
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

  const fetchClasses = async () => {
    setOptionsLoading(true)
    try {
      const fetchedClasses = await getClassesCreatedByUser(userId)
      setClasses(fetchedClasses.classes)
    } catch (error) {
      console.error("Error fetching classes:", error)
      toast({
        title: "Error",
        description: "Failed to fetch classes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setOptionsLoading(false)
    }
  }

  useEffect(() => {
    if (!isPublic && classes.length === 0) {
      fetchClasses()
    }
  }, [isPublic, classes.length])

  const handleClearAllClasses = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedClassIds([])
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create LMS</Button>
      </DialogTrigger>
      <DialogContent className="overflow-visible pointer-events-none">
        <div className="pointer-events-auto">
          <DialogHeader>
            <DialogTitle>Create a New LMS</DialogTitle>
          </DialogHeader>
          <form action={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="isPublic">Public LMS</Label>
            </div>
            {!isPublic && (
              <div>
                <Label htmlFor="classes">Select Classes</Label>
                {optionsLoading ? (
                  <Skeleton.Input active={true} size="large" block={true} />
                ) : (
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Select classes"
                    value={selectedClassIds}
                    onChange={(values) => setSelectedClassIds(values)}
                    options={classes.map(cls => ({ label: cls.name, value: cls.id }))}
                    filterOption={(input, option) =>
                      option?.label.toLowerCase().includes(input.toLowerCase())
                    }
                    dropdownStyle={{ zIndex: 2000 }}
                    popupClassName="pointer-events-auto"
                    suffixIcon={
                      selectedClassIds.length > 0 && (
                        <ButtonAnt
                          type="text"
                          size="small"
                          icon={<CloseOutlined />}
                          onClick={handleClearAllClasses}
                          style={{ marginRight: -8 }}
                        />
                      )
                    }
                  />
                )}
              </div>
            )}
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Creating...' : 'Create LMS'}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}