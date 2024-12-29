'use client'

import { useState } from 'react'
import { Chapter, Content } from '@prisma/client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CreateContentForm } from './create-content-form'
import { UpdateChapterForm } from './update-chapter-form'
import { DeleteChapterButton } from './delete-chapter-button'
import { ContentItem } from './content-item'

interface ChapterListProps {
  chapters: (Chapter & { contents: Content[] })[]
  isCreator: boolean
}

export function ChapterList({ chapters, isCreator }: ChapterListProps) {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null)

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      onValueChange={(value) => setExpandedChapter(value)}
    >
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.id} value={chapter.id}>
          <div className="flex justify-between items-center w-full">
            <AccordionTrigger className="flex-grow text-left">
              {chapter.name}
            </AccordionTrigger>
            {isCreator && (
              <div className="flex space-x-2">
                <UpdateChapterForm chapter={chapter} />
                <DeleteChapterButton chapterId={chapter.id} />
              </div>
            )}
          </div>
          <AccordionContent>
            {chapter.contents.map((content) => (
              <ContentItem key={content.id} content={content} isCreator={isCreator} />
            ))}
            {isCreator && expandedChapter === chapter.id && (
              <CreateContentForm chapterId={chapter.id} />
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
