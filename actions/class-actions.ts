'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getClassesCreatedByUser(userId: string) {
  try {
    const classes = await prisma.class.findMany({
      where: { createdById: userId },
      select: { id: true, name: true },
    })
    return { success: true, classes }
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    return { success: false, message: 'Failed to fetch classes' }
  }
}

export async function getStudentsInClass(classId: string) {
  try {
    const classWithStudents = await prisma.class.findUnique({
      where: { id: classId },
      include: { students: true },
    })

    if (!classWithStudents) {
      return { success: false, message: 'Class not found' }
    }

    return { success: true, students: classWithStudents.students }
  } catch (error) {
    console.error('Failed to fetch students:', error)
    return { success: false, message: 'Failed to fetch students' }
  }
}

export async function addStudentToClass(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const classId = formData.get('classId') as string

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, message: 'User not found' }
    }

    await prisma.class.update({
      where: { id: classId },
      data: { students: { connect: { id: user.id } } },
    })

    revalidatePath('/students')
    return { success: true, message: 'Student added successfully' }
  } catch (error) {
    console.error('Failed to add student:', error)
    return { success: false, message: 'Failed to add student' }
  }
}

export async function removeStudentFromClass(prevState: any, formData: FormData) {
  const studentId = formData.get('studentId') as string
  const classId = formData.get('classId') as string

  try {
    await prisma.class.update({
      where: { id: classId },
      data: { students: { disconnect: { id: studentId } } },
    })

    revalidatePath('/students')
    return { success: true, message: 'Student removed successfully' }
  } catch (error) {
    console.error('Failed to remove student:', error)
    return { success: false, message: 'Failed to remove student' }
  }
}

