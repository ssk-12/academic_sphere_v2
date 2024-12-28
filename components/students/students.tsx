'use client'

import { useEffect, useState, useTransition } from 'react'
import { useActionState } from 'react'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { getClassesCreatedByUser, getStudentsInClass, addStudentToClass, removeStudentFromClass } from '@/actions/class-actions'

export default function StudentsPage({id}) {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState(null)
  const [students, setStudents] = useState([])
  const [removingStudents, setRemovingStudents] = useState({})

  const initialState = { message: '', success: true }
  const [addState, addFormAction, isAddingStudent] = useActionState(addStudentToClass, initialState)
  const [removeState, removeFormAction, isRemovingStudent] = useActionState(removeStudentFromClass, initialState)

  const [isPending, startTransition] = useTransition()

  const fetchStudents = async () => {
    if (selectedClass) {
      const result = await getStudentsInClass(selectedClass)
      if (result.success) {
        setStudents(result.students)
      } else {
        toast({
          title: 'Error',
          description: result.message,
          variant: 'destructive',
        })
      }
    }
  }

  useEffect(() => {
    const fetchClasses = async () => {
      if (id) {
        const result = await getClassesCreatedByUser(id)
        if (result.success) {
          setClasses(result.classes)
        } else {
          toast({
            title: 'Error',
            description: result.message,
            variant: 'destructive',
          })
        }
      }
    }

    fetchClasses()
  }, [id])

  useEffect(() => {
    fetchStudents()
  }, [selectedClass])

  useEffect(() => {
    if (addState.message) {
      toast({
        title: addState.success ? 'Success' : 'Error',
        description: addState.message,
        variant: addState.success ? 'default' : 'destructive',
      })
      if (addState.success) {
        fetchStudents()
      }
    }
  }, [addState])

  useEffect(() => {
    if (removeState.message) {
      toast({
        title: removeState.success ? 'Success' : 'Error',
        description: removeState.message,
        variant: removeState.success ? 'default' : 'destructive',
      })
      if (removeState.success) {
        fetchStudents()
      }
    }
  }, [removeState])

  const handleRemoveStudent = (event, studentId) => {
    event.preventDefault();
  
    // Create a new FormData object
    const formData = new FormData();
    formData.append('studentId', studentId);
    formData.append('classId', selectedClass);
  
    setRemovingStudents((prev) => ({ ...prev, [studentId]: true }));
  
    startTransition(async () => {
      try {
        // Call the remove function with the newly created FormData
        const result = await removeFormAction( formData);
  
        
      } catch (error) {
        console.error('An error occurred while removing the student:', error);
      } finally {
        setRemovingStudents((prev) => ({ ...prev, [studentId]: false }));
      }
    });
  };
  

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Class Students</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedClass}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              {classes.map((cls) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedClass && (
            <>
              <form action={addFormAction} className="mt-6 mb-6">
                <input type="hidden" name="classId" value={selectedClass} />
                <div className="flex items-center space-x-2">
                  <Input
                    type="email"
                    name="email"
                    placeholder="student@example.com"
                    required
                    className="flex-grow"
                  />
                  <Button type="submit" disabled={isAddingStudent}>
                    {isAddingStudent ? 'Adding...' : 'Add Student'}
                  </Button>
                </div>
              </form>

              {students.length === 0 ? (
                <p>No students enrolled in this class yet.</p>
              ) : (
                <ul className="space-y-2">
                  {students.map((student) => (
                    <li key={student.id} className="flex items-center justify-between border-b pb-2">
                      <span>{student.fullName} ({student.email})</span>
                      <form onSubmit={(e) => handleRemoveStudent(e, student.id)}>
                        <input type="hidden" name="classId" value={selectedClass} />
                        <input type="hidden" name="studentId" value={student.id} />
                        <Button 
                          type="submit" 
                          variant="destructive" 
                          size="sm"
                          disabled={removingStudents[student.id] || isPending}
                        >
                          {removingStudents[student.id] ? 'Removing...' : 'Remove'}
                        </Button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

