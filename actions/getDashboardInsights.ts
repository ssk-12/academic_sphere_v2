'use server'

import { auth } from "@/auth"
import {prisma} from "@/lib/prisma"

export async function getDashboardInsights() {
  const session = await auth()
  const userId = session?.user.id as string

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      fullName: true,
      email: true,
      image: true,
      role: true,
      createdAt: true,
      classesCreated: {
        select: {
          id: true,
          name: true,
          _count: {
            select: { students: true, events: true }
          }
        }
      },
      classesEnrolled: {
        select: {
          id: true,
          name: true,
          _count: {
            select: { events: true }
          }
        }
      },
      attendances: {
        select: {
          present: true,
          event: {
            select: {
              name: true,
              date: true,
              class: {
                select: { name: true }
              }
            }
          }
        },
        orderBy: { checkedAt: 'desc' },
        take: 5
      }
    }
  })

  if (!user) {
    throw new Error("User not found")
  }

  const classesCreatedCount = user.classesCreated.length
  const classesEnrolledCount = user.classesEnrolled.length
  const totalEventsCreated = user.classesCreated.reduce((sum, cls) => sum + cls._count.events, 0)
  const totalEventsEnrolled = user.classesEnrolled.reduce((sum, cls) => sum + cls._count.events, 0)
  const totalStudentsManaged = user.classesCreated.reduce((sum, cls) => sum + cls._count.students, 0)

  return {
    profile: {
      fullName: user.fullName,
      email: user.email,
      image: user.image,
      role: user.role,
      createdAt: user.createdAt
    },
    stats: {
      classesCreatedCount,
      classesEnrolledCount,
      totalEventsCreated,
      totalEventsEnrolled,
      totalStudentsManaged
    },
    classesCreated: user.classesCreated,
    classesEnrolled: user.classesEnrolled,
    recentAttendances: user.attendances
  }
}

