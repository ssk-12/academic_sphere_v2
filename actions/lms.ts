"use server";

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// Fetch LMS list for the authenticated user
export async function fetchLMSList() {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Fetch private LMS that the user has access to through their classes
  const privateLMS = await prisma.lMS.findMany({
    where: {
      OR: [
        { classes: { some: { class: { students: { some: { id: user.id } } } } } },
        { classes: { some: { class: { createdById: user.id } } } },
        { createdById: user.id },
      ],
      isPublic: false,
    },
    include: {
      classes: {
        include: {
          class: true,
        },
      },
    },
  });

  // Fetch public LMS data
  const publicLMS = await prisma.lMS.findMany({
    where: { isPublic: true },
    include: {
      classes: {
        include: {
          class: true,
        },
      },
    },
  });

  return { privateLMS, publicLMS };
}

// Create a new LMS
export async function createLMS(prevState: any, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const isPublic = formData.get('isPublic') === 'true';
  const selectedClassIds = JSON.parse(formData.get('selectedClassIds') as string);

  try {
    const lmsData = {
      name,
      description,
      isPublic,
      createdById: user.id,
      classes: {
        create: selectedClassIds.map((classId: string) => ({
          class: {
            connect: { id: classId }
          }
        }))
      }
    };

    await prisma.lMS.create({
      data: lmsData,
    });

    revalidatePath('/lms');

    return { success: true, message: 'LMS created successfully' };
  } catch (error) {
    console.error('Failed to create LMS:', error);
    return { success: false, message: 'Failed to create LMS' };
  }
}

// Delete LMS
export async function deleteLMS(prevState: any, { lmsId }: { lmsId: string }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  try {
    const lms = await prisma.lMS.findUnique({
      where: { id: lmsId },
      select: { createdById: true }
    });

    if (!lms || lms.createdById !== user.id) {
      return { success: false, message: 'Not authorized to delete this LMS' };
    }

    await prisma.lMS.delete({ where: { id: lmsId } });
    return { success: true, message: 'LMS deleted successfully' };
  } catch (error) {
    console.error('Failed to delete LMS:', error);
    return { success: false, message: 'Failed to delete LMS' };
  }
}

// Update LMS
export async function updateLMS(prevState: any, formData: FormData) {
  const session = await auth();
  const user = session?.user;
  
  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  const lmsId = formData.get('lmsId') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  try {
    const lms = await prisma.lMS.findUnique({
      where: { id: lmsId },
      select: { createdById: true }
    });

    if (!lms || lms.createdById !== user.id) {
      return { success: false, message: 'Not authorized to update this LMS' };
    }

    await prisma.lMS.update({
      where: { id: lmsId },
      data: { 
        name,
        description 
      }
    });
    return { success: true, message: 'LMS updated successfully' };
  } catch (error) {
    console.error('Failed to update LMS:', error);
    return { success: false, message: 'Failed to update LMS' };
  }
}

// Fetch LMS details
export async function fetchLMSDetails({ lmsId }: { lmsId: string }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { lms: null, isCreator: false };
  }

  const lms = await prisma.lMS.findUnique({
    where: { id: lmsId },
    include: {
      classes: {
        include: {
          class: true
        }
      },
      chapters: {
        orderBy: {
          orderIndex: 'asc'
        },
        include: {
          contents: {
            orderBy: {
              orderIndex: 'asc'
            }
          }
        }
      }
    }
  });

  if (!lms) {
    return { lms: null, isCreator: false };
  }

  const isCreator = lms.createdById === user.id;

  return { lms, isCreator };
}

// Create Chapter
export async function createChapter(prevState: any, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  const name = formData.get('name') as string;
  const lmsId = formData.get('lmsId') as string;

  try {
    const lms = await prisma.lMS.findUnique({
      where: { id: lmsId },
      select: { createdById: true }
    });

    if (!lms || lms.createdById !== user.id) {
      return { success: false, message: 'Not authorized to create chapters for this LMS' };
    }

    // Get the highest orderIndex
    const lastChapter = await prisma.chapter.findFirst({
      where: { lmsId },
      orderBy: { orderIndex: 'desc' }
    });

    const newOrderIndex = (lastChapter?.orderIndex ?? -1) + 1;

    await prisma.chapter.create({
      data: {
        name,
        lmsId,
        orderIndex: newOrderIndex
      }
    });

    return { success: true, message: 'Chapter created successfully' };
  } catch (error) {
    console.error('Failed to create chapter:', error);
    return { success: false, message: 'Failed to create chapter' };
  }
}

// Update Chapter
export async function updateChapter(prevState: any, formData: FormData) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  const chapterId = formData.get('chapterId') as string;
  const name = formData.get('name') as string;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { lms: true }
    });

    if (!chapter || chapter.lms.createdById !== user.id) {
      return { success: false, message: 'Not authorized to update this chapter' };
    }

    await prisma.chapter.update({
      where: { id: chapterId },
      data: { name }
    });

    return { success: true, message: 'Chapter updated successfully' };
  } catch (error) {
    console.error('Failed to update chapter:', error);
    return { success: false, message: 'Failed to update chapter' };
  }
}

// Create Content
export async function createContent(prevState: any, formData: FormData) {
  const session = await auth();
  const user = session?.user;
  
  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  const title = formData.get('title') as string;
  const body = formData.get('body') as string;
  const chapterId = formData.get('chapterId') as string;

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { lms: true }
    });

    if (!chapter || chapter.lms.createdById !== user.id) {
      return { success: false, message: 'Not authorized to create content for this chapter' };
    }

    // Get the highest orderIndex
    const lastContent = await prisma.content.findFirst({
      where: { chapterId },
      orderBy: { orderIndex: 'desc' }
    });

    const newOrderIndex = (lastContent?.orderIndex ?? -1) + 1;

    await prisma.content.create({
      data: {
        title,
        body,
        chapterId,
        orderIndex: newOrderIndex
      }
    });

    return { success: true, message: 'Content created successfully' };
  } catch (error) {
    console.error('Failed to create content:', error);
    return { success: false, message: 'Failed to create content' };
  }
}

// Update Content
export async function updateContent(prevState: any, formData: FormData) {
  const session = await auth();
  const user = session?.user;
  
  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  const contentId = formData.get('contentId') as string;
  const title = formData.get('title') as string;
  const body = formData.get('body') as string;

  try {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { chapter: { include: { lms: true } } }
    });

    if (!content || content.chapter.lms.createdById !== user.id) {
      return { success: false, message: 'Not authorized to update this content' };
    }

    await prisma.content.update({
      where: { id: contentId },
      data: { title, body }
    });

    return { success: true, message: 'Content updated successfully' };
  } catch (error) {
    console.error('Failed to update content:', error);
    return { success: false, message: 'Failed to update content' };
  }
}

export async function deleteChapter(prevState: any, { chapterId }: { chapterId: string }) {
  const session = await auth();
  const user = session?.user;

  if (!user) {
    return { success: false, message: 'User not authenticated' };
  }

  try {
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: { lms: true }
    });

    if (!chapter || chapter.lms.createdById !== user.id) {
      return { success: false, message: 'Not authorized to delete this chapter' };
    }

    // Reorder remaining chapters
    const chaptersToUpdate = await prisma.chapter.findMany({
      where: {
        lmsId: chapter.lmsId,
        orderIndex: {
          gt: chapter.orderIndex
        }
      }
    });

    // Use transaction to ensure both deletion and reordering succeed
    await prisma.$transaction([
      // Delete the chapter (cascade will handle contents)
      prisma.chapter.delete({ 
        where: { id: chapterId } 
      }),
      
      // Update orderIndex for remaining chapters
      ...chaptersToUpdate.map(ch => 
        prisma.chapter.update({
          where: { id: ch.id },
          data: { orderIndex: ch.orderIndex - 1 }
        })
      )
    ]);

    return { success: true, message: 'Chapter deleted successfully' };
  } catch (error) {
    console.error('Failed to delete chapter:', error);
    return { success: false, message: 'Failed to delete chapter' };
  }
}