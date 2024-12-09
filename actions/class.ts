
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

    console.dir(formData, {depth: null});
    return { message: 'Event created successfully', success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { message: error.message, success: false };
    } else {
      return { message: 'An unknown error occurred', success: false };
    }
  }
}

