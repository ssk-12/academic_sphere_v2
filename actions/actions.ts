'use server'

import { revalidatePath } from 'next/cache'
import {prisma} from '@/lib/prisma'

export async function addTodo(formData: FormData) {
  "use server";
  const title = formData.get('title') as string
  await prisma.todo.create({
    data: { title },
  })
  revalidatePath('/todos')
}

export async function toggleTodo(id: string, completed: boolean) {
  await prisma.todo.update({
    where: { id },
    data: { completed },
  })
  revalidatePath('/todos')
}

export async function deleteTodo(id: string) {
  await prisma.todo.delete({
    where: { id },
  })
  revalidatePath('/todos')
}

export async function getTodos() {
  return prisma.todo.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

