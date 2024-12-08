
'use server'

import { prisma } from '@/lib/prisma'

import { revalidatePath } from 'next/cache'
import { auth } from '@/auth';


export async function createClass(state: { message: string; success: boolean, user?: string },formData: FormData) {
  try {
    const session = await auth();
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const createdById = session?.user.id as string
    if(!description){
      throw new Error('Description is required')
    }
    await prisma.class.create({
      data: {
        name,
        description,
        createdById,
      },
    })

    revalidatePath('/classes')
    return { message: 'Class created successfully', success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false }
    } else {
      return { message: 'An unknown error occurred', success: false }
    }
  }
}

export async function getClasses() {
  return prisma.class.findMany({
    include: {
      students: true,
    },
  })
}

export async function deleteClass(id: string) {
  try {
    await prisma.class.delete({
      where: {
        id,
      },
    })

    revalidatePath('/classes')
    return { message: 'Class deleted successfully', success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false }
    } else {
      return { message: 'An unknown error occurred', success: false }
    }
  }
}


export async function getClass(id: string) {
  return prisma.class.findUnique({
    where: {
      id,
    },
    include: {
      students: true,
      events: true,
      createdBy: {
        select: {
          fullName: true,
        },
      },
    },
  });
}

export async function createEvent(state: { message: string; success: boolean, id?: string}, formData: FormData){
  const classInfo = await getClass(state?.id as string)
  if(!classInfo){
    throw new Error('Class not found')
  }
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const isLocationBased = formData.get('isLocationBased') === 'true';
  try {

    await prisma.event.create({
      data: {
        classId: state.id as string,
        name: name,
        description: description,
        date: new Date(),
        isLocationBased: isLocationBased,
      },
    })

    return { message: 'Event created successfully', success: true }
    
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false }
    } else {
      return { message: 'An unknown error occurred', success: false }
    }
    
  }
}
