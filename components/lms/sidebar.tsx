'use client'

import { LMS, Chapter, Content } from '@prisma/client'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateChapterForm } from './create-chapter-form'
import { CreateContentForm } from './create-content-form'
import { ChevronRight, FileText, FolderOpen, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'

interface SidebarProps {
  lms: LMS & { chapters: (Chapter & { contents: Content[] })[] }
  isCreator: boolean
  selectedChapter: Chapter | null
  setSelectedChapter: (chapter: Chapter | null) => void
  selectedContent: Content | null
  setSelectedContent: (content: Content | null) => void
  className?: string
}

export function Sidebar({
  lms,
  isCreator,
  selectedChapter,
  setSelectedChapter,
  selectedContent,
  setSelectedContent,
  className,
}: SidebarProps) {
  return (
    <aside
      className={clsx(
        'bg-white shadow-lg overflow-hidden flex flex-col max-h-screen',
        className
      )}
    >
      <div className="px-4 py-[13px] bg-indigo-600 text-white flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chapters</h2>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-white hover:text-indigo-200"
          onClick={() => setSelectedContent(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-auto">
        <Accordion type="single" collapsible className="w-full">
          {lms.chapters.map((chapter) => (
            <AccordionItem key={chapter.id} value={chapter.id}>
              <AccordionTrigger className="px-4 py-2 hover:bg-indigo-50 transition-colors">
                <div className="flex items-center">
                  <FolderOpen className="mr-2" size={18} />
                  <span>{chapter.name}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-6">
                  {chapter.contents.map((content) => (
                    <button
                      key={content.id}
                      onClick={() => setSelectedContent(content)}
                      className={`w-full text-left px-4 py-2 flex items-center hover:bg-indigo-50 transition-colors ${
                        selectedContent?.id === content.id ? 'bg-indigo-100' : ''
                      }`}
                    >
                      <FileText className="mr-2" size={16} />
                      <span>{content.title}</span>
                      {selectedContent?.id === content.id && (
                        <ChevronRight className="ml-auto" size={16} />
                      )}
                    </button>
                  ))}
                  {isCreator && (
                    <div className="px-4 py-2">
                      <CreateContentForm chapterId={chapter.id} />
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
      {isCreator && (
        <div className="p-4 border-t">
          <CreateChapterForm lmsId={lms.id} />
        </div>
      )}
    </aside>
  )
}

