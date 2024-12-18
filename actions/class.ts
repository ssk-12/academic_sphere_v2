
'use server'

import { prisma } from '@/lib/prisma'
import { haversineDistance } from '@/lib/utils';
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

export async function enrollClass(state: { message: string; success: boolean, user?: string },formData: FormData) { 
  try {
    const session = await auth();
    const classId = formData.get('id') as string
    const studentId = session?.user.id as string
    await prisma.class.update({
      where: {
        id: classId,
      },
      data: {
        students: {
          connect: {
            id: studentId,
          },
        },
      },
    })

    revalidatePath('/classes')
    return { message: 'Class enrolled successfully', success: true }
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false }
    } else {
      return { message: 'An unknown error occurred', success: false }
    }
  }
}

export async function getClassWithAccessCheck(classId: string, userId: string) {
  const classData = await prisma.class.findUnique({
    where: {
      id:classId,
    },
    include: {
      students: true,
      events: true,
      createdBy: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
  });

  if (!classData) {
    return { hasAccess: false, redirectUrl: '/unauthorized' };
  }

  const isStudent = classData.students.some((student) => student.id === userId);
  const isCreator = classData.createdBy.id === userId;

  if (!isStudent && !isCreator) {
    return { hasAccess: false, redirectUrl: '/unauthorized' };
  }

  return { hasAccess: true, classData };
}


export async function getClasses() {
  const session = await auth()
  const createdById = session?.user.id as string
  return prisma.class.findMany({
    include: {
      students: true,
    },
    where:{
      OR: [
        {
          createdById,
        },
        {
          students: {
            some: {
              id: createdById,
            },
          },
        },
      ],
    }
  })
}

export async function deleteClass(id: string) {
  try {

    await prisma.attendance.deleteMany({
      where: {
        event: {
        classId: id,
        }
      },
    })
    await prisma.event.deleteMany({
      where: {
        classId: id,
      }
    })

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

export async function deleteEvent(id: string, createdById: string) {
  const session = await auth()
  const userId = session?.user.id as string
  if (userId !== createdById) {
    return { message: 'Unauthorized access', success: false }
  }
  try {
    await prisma.attendance.deleteMany({
      where: {
        eventId: id,
      },
    })
    await prisma.event.delete({
      where: {
        id,
      },
    })
    revalidatePath('/event')
    return { message: 'Event deleted successfully', success: true }
  }
  catch (error) {
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

export async function createEvent(state: { message: string; success: boolean, locationData?:{locationData: any}}, formData: FormData){
  const classId = formData.get('id') as string
  const classInfo = await getClass(classId);
  if (!classInfo) {
    throw new Error('Class not found');
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const date = new Date(formData.get('date') as string);
  const isLocationBased = formData.get('isLocationBased') === 'true';



  let locationLat: number | null = null;
  let locationLng: number | null = null;

  const location = formData.get('location') as string;
  if (location && isLocationBased) {
    const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
    locationLat = lat || null;
    locationLng = lng || null;
  }

  try {
    await prisma.event.create({
      data: {
        classId: classId,
        name: name,
        description: description,
        date: date, 
        isLocationBased: isLocationBased,
        locationLat: locationLat,
        locationLng: locationLng,
        proximity: isLocationBased ? Number(formData.get('proximity') as unknown as string) : null,
      },
      
    });

    revalidatePath('/class/[id]', 'page');
    return { message: 'Event created successfully', success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: 'An unknown error occurred', success: false };
    }
  }
}

export async function getEvent(id: string) {
  const session = await auth();
  const userId = session?.user.id as string;
  const todayDate = new Date().toISOString().split('T')[0]; // Extracts YYYY-MM-DD

  const createdById = await prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      class: {
        select: {
          createdById: true,
        },
      },
    },
  });

  if (createdById?.class.createdById !== userId) {
    return prisma.event.findUnique({
      where: {
        id,
      },
      include: {
        class: {
          include: {
            students: true,
            createdBy: true,
          },
        },
        attendances: {
          include: {
            student: true,
          },
          where: {
            studentId: userId,
            checkedAt: {
              gte: new Date(todayDate), // Matches from the start of today
              lt: new Date(new Date(todayDate).getTime() + 86400000), // Matches before tomorrow
            },
          },
        },
      },
    });
  }

  return prisma.event.findUnique({
    where: {
      id,
    },
    include: {
      class: {
        include: {
          students: true,
          createdBy: true,
        },
      },
      attendances: {
        include: {
          student: true,
        },
        where: {
          checkedAt: {
            gte: new Date(todayDate), // Matches from the start of today
            lt: new Date(new Date(todayDate).getTime() + 86400000), // Matches before tomorrow
          },
        },
      },
    },
  });
}


export async function markAttendance(
  state: { message: string; success: boolean },
  formData: FormData
) {
  const eventId = formData.get('id') as string;
  const user = await auth();
  const studentId = user?.user.id as string;
  const event = await getEvent(eventId);
  const evlocationLat = parseFloat(formData.get('evlocationLat') as string);
  const evlocationLng = parseFloat(formData.get('evlocationLng') as string);

  let locationLat: number | null = null;
  let locationLng: number | null = null;

  try {
    if (!event) {
      throw new Error('Event not found');
    }

    const location = formData.get('location') as string;
    if (location) {
      const [lat, lng] = location.split(',').map(coord => parseFloat(coord.trim()));
      locationLat = lat || null;
      locationLng = lng || null;
    }

    if (locationLat === null || locationLng === null) {
      throw new Error('User location is invalid or missing');
    }

    const proximityRange = event?.proximity || null;
    if ( !proximityRange) {
      throw new Error('proximity not found');
    }
    const distance = haversineDistance(
      locationLat,
      locationLng,
      evlocationLat,
      evlocationLng
    );

    // console.log('Distance:', distance);

    if (distance > proximityRange) {
      throw new Error('User is outside the allowed proximity range');
    }

    await prisma.attendance.create({
      data: {
        event: {
          connect: {
            id: eventId,
          },
        },
        student: {
          connect: {
            id: studentId,
          },
        },
        checkedAt: new Date(),
        present: true,
      },
    });

    revalidatePath('classes/class/[id]/event/[eventId]', 'page');

    return { message: 'Attendance marked successfully', success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: 'An unknown error occurred', success: false };
    }
  }
}

export async function getEventWithAccessCheck(classId: string, eventId: string, userId: string) {
  // First, check if the user has access to the class
  await getClassWithAccessCheck(classId, userId);

  // Now check if the event belongs to the class
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      class: true, // Including class information to check the relationship
    },
  });

  if (!event) {
    return { hasAccess: false, redirectUrl: '/unauthorized' };
  }

  if (event.classId !== classId) {
    return { hasAccess: false, redirectUrl: '/unauthorized' };
  }

  return { hasAccess: true, redirectUrl: null };; // Return the event if the user has access
}

export async function getAttendanceAnalytics(classId?: string, eventId?: string) {
  const session = await auth();
  const userId = session?.user.id as string;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Base query filter to ensure access is limited to relevant classes/events
  const baseFilter = {
    OR: [
      {
        createdById: userId, // Classes/events created by the user
      },
      {
        students: {
          some: {
            id: userId, // Classes the user is enrolled in
          },
        },
      },
    ],
  };

  // If classId is provided, focus analytics on that specific class
  if (classId) {
    const classAnalytics = await prisma.class.findUnique({
      where: { id: classId },
      include: {
        events: {
          include: {
            attendances: true,
          },
        },
        students: true,
      },
    });

    if (!classAnalytics || (classAnalytics.createdById !== userId && !classAnalytics.students.some(student => student.id === userId))) {
      throw new Error("Unauthorized access or class not found.");
    }

    const eventAttendanceStats = classAnalytics.events.map(event => {
      const totalStudents = classAnalytics.students.length;
      const attended = event.attendances.filter(att => att.present).length;
      const attendancePercentage = totalStudents > 0 ? (attended / totalStudents) * 100 : 0;
      return {
        eventId: event.id,
        eventName: event.name,
        attendancePercentage,
      };
    });

    return { classId, className: classAnalytics.name, eventAttendanceStats };
  }

  // If eventId is provided, focus analytics on that specific event
  if (eventId) {
    const eventAnalytics = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        class: {
          include: {
            students: true,
          },
        },
        attendances: true,
      },
    });

    if (!eventAnalytics || (eventAnalytics.class.createdById !== userId && !eventAnalytics.class.students.some(student => student.id === userId))) {
      throw new Error("Unauthorized access or event not found.");
    }

    const totalStudents = eventAnalytics.class.students.length;
    const attended = eventAnalytics.attendances.filter(att => att.present).length;
    const attendancePercentage = totalStudents > 0 ? (attended / totalStudents) * 100 : 0;

    return {
      eventId,
      eventName: eventAnalytics.name,
      attendancePercentage,
    };
  }

  // General analytics for all classes the user is related to
  const classes = await prisma.class.findMany({
    where: baseFilter,
    include: {
      events: {
        include: {
          attendances: true,
        },
      },
      students: true,
    },
  });

  const classAnalytics = classes.map(cls => {
    const eventAttendanceStats = cls.events.map(event => {
      const totalStudents = cls.students.length;
      const attended = event.attendances.filter(att => att.present).length;
      const attendancePercentage = totalStudents > 0 ? (attended / totalStudents) * 100 : 0;
      return {
        eventId: event.id,
        eventName: event.name,
        attendancePercentage,
      };
    });

    return {
      classId: cls.id,
      className: cls.name,
      eventAttendanceStats,
    };
  });

  return classAnalytics;
}
