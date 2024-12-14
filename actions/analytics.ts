'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function getAttendanceAnalytics(classIds?: string[], eventIds?: string[]) {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const baseFilter = {
    OR: [
      { createdById: userId },
      { students: { some: { id: userId } } },
    ],
  }

  let whereClause: any = baseFilter

  if (classIds && classIds.length > 0) {
    whereClause = { ...whereClause, id: { in: classIds } }
  }

  const classes = await prisma.class.findMany({
    where: whereClause,
    include: {
      events: {
        include: { attendances: true },
        ...(eventIds && eventIds.length > 0 ? { where: { id: { in: eventIds } } } : {}),
      },
      students: true,
    },
  })

  return classes.map(cls => ({
    classId: cls.id,
    className: cls.name,
    eventAttendanceStats: cls.events.map(event => ({
      eventId: event.id,
      eventName: event.name,
      attendancePercentage: cls.students.length > 0
        ? (event.attendances.filter(att => att.present).length / cls.students.length) * 100
        : 0,
    })),
  }))
}

export async function getClasses() {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  return prisma.class.findMany({
    where: {
      OR: [
        { createdById: userId },
        { students: { some: { id: userId } } },
      ],
    },
    select: { id: true, name: true },
  })
}

export async function getEvents(classIds?: string[]) {
  const session = await auth()
  const userId = session?.user.id

  if (!userId) {
    throw new Error("User not authenticated")
  }

  const whereClause = classIds && classIds.length > 0
    ? { classId: { in: classIds }, class: { OR: [{ createdById: userId }, { students: { some: { id: userId } } }] } }
    : { class: { OR: [{ createdById: userId }, { students: { some: { id: userId } } }] } }

  return prisma.event.findMany({
    where: whereClause,
    select: { id: true, name: true, classId: true },
  })
}

