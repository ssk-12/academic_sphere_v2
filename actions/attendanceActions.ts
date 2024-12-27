'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getClassesForUser(userId: string) {
  const classes = await prisma.class.findMany({
    where: { createdById: userId },
    select: { id: true, name: true }
  })
  return classes.map(c => ({ value: c.id, label: c.name }))
}

export async function getEventsForClass(classId: string) {
  const events = await prisma.event.findMany({
    where: { classId },
    select: { id: true, name: true, date: true }
  })
  return events.map(e => ({ 
    value: e.id, 
    label: `${e.name} (${new Date(e.date).toLocaleDateString()})`
  }))
}

export async function getStudentsForClass(classId: string) {
  const students = await prisma.class.findUnique({
    where: { id: classId },
    include: { students: true }
  }).then(cls => cls?.students ?? [])
  
  return students.map(s => ({ id: s.id, name: s.fullName }))
}

export async function updateAttendance(prevState: any, formData: FormData) {
  const eventId = formData.get('eventId') as string
  const studentId = formData.get('studentId') as string
  const present = formData.get('present') === 'true'
  const date = new Date(formData.get('date') as string)

  try {
    await prisma.attendance.upsert({
      where: {
        eventId_studentId_checkedAt: { eventId, studentId, checkedAt: date }
      },
      update: { present, checkedAt: date },
      create: { eventId, studentId, present, checkedAt: date }
    })

    revalidatePath('/attendance')
    return { success: true, message: 'Attendance updated successfully' }
  } catch (error) {
    // console.error('Error updating attendance:', error)
    return { success: false, message: 'Failed to update attendance' }
  }
}

export async function getAttendanceStatus(eventId: string, date: Date) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)
  
  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  const attendances = await prisma.attendance.findMany({
    where: { 
      eventId,
      checkedAt: {
        gte: startOfDay,
        lte: endOfDay
      }
    },
    select: { studentId: true, present: true }
  })
  
  return attendances.reduce((acc, curr) => {
    acc[curr.studentId] = curr.present
    return acc
  }, {})
}
