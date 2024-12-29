'use client'

import { useState } from 'react'
import { LMS, Chapter, Content } from '@prisma/client'
import { Sidebar } from './sidebar'
import { ContentView } from './content-view'
import { Book, Lightbulb } from 'lucide-react'

interface LMSDetailsViewProps {
  lms: LMS & { chapters: (Chapter & { contents: Content[] })[] }
  isCreator: boolean
}

export function LMSDetailsView({ lms, isCreator }: LMSDetailsViewProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
      <Sidebar
        lms={lms}
        isCreator={isCreator}
        selectedChapter={selectedChapter}
        setSelectedChapter={setSelectedChapter}
        selectedContent={selectedContent}
        setSelectedContent={setSelectedContent}
      />
      <main className="flex-1 p-8 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-indigo-800 mb-2 flex items-center justify-center">
              <Book className="mr-2" size={32} />
              {lms.name}
            </h1>
            {lms.description && (
              <p className="text-lg text-indigo-600">{lms.description}</p>
            )}
          </header>
          {selectedContent ? (
            <ContentView content={selectedContent} isCreator={isCreator} />
          ) : (
            <div className="text-center text-gray-500">
              <Lightbulb size={64} className="mx-auto mb-4" />
              <p className="text-xl">Select a content item to view its details</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

