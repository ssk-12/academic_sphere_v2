// app/api/classes/create/route.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from "@/lib/getSession";
import { revalidatePath } from 'next/cache'
import { error } from 'console';

const session = await getSession();
const user = session?.user;

export async function createClass(state: { message: string; success: boolean },formData: FormData) {
  try {
    const name = formData.get('name') as string
    const description = formData.get('description') as string
    const createdById = user?.id as string

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
