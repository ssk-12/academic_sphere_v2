// app/api/classes/create/route.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from "@/lib/getSession";
import { revalidatePath } from 'next/cache'

const session = await getSession();
const user = session?.user;

export async function createClass(formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const createdById = user?.id as string

  
  await prisma.class.create({
    data: {
      name,
      description,
      createdById,
    },
  })

  
  revalidatePath('/classes')
}

export async function getClasses() {
  return prisma.class.findMany({
    include: {
      students: true,
    },
  })
}
