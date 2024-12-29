'use client'

import { useState, useEffect } from 'react'
import { LMS, Chapter, Content } from '@prisma/client'
import { Sidebar } from './sidebar'
import { ContentView } from './content-view'
import { Book, Lightbulb, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useMediaQuery } from '@/hooks/use-media-query'

interface LMSDetailsViewProps {
  lms: LMS & { chapters: (Chapter & { contents: Content[] })[] }
  isCreator: boolean
}

export function LMSDetailsView({ lms, isCreator }: LMSDetailsViewProps) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [selectedContent, setSelectedContent] = useState<Content | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isLargeScreen = useMediaQuery("(min-width: 1024px)")

  useEffect(() => {
    if (isLargeScreen) {
      setIsSidebarOpen(true)
    } else {
      setIsSidebarOpen(false)
    }
  }, [isLargeScreen])

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const handleContentSelect = (content: Content) => {
    setSelectedContent(content)
    if (!isLargeScreen) {
      setIsSidebarOpen(false)
    }
  }

  return (
    <div className="grid h-screen overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 lg:grid-cols-[20rem,1fr]">
      {/* Sidebar */}
      <Sidebar
        lms={lms}
        isCreator={isCreator}
        selectedChapter={selectedChapter}
        setSelectedChapter={setSelectedChapter}
        selectedContent={selectedContent}
        setSelectedContent={handleContentSelect}
        className={`transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isLargeScreen ? 'lg:col-start-1 lg:translate-x-0' : 'fixed inset-y-0 left-0 z-50 w-64'}`}
      />
      {/* Main Content */}
      <ScrollArea className="lg:col-start-2">
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <header className="mb-8 text-center relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-0 lg:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl lg:text-4xl font-bold text-indigo-800 mb-2 flex items-center justify-center">
              <Book className="mr-2" size={32} />
              {lms.name}
            </h1>
            {lms.description && (
              <p className="text-sm lg:text-lg text-indigo-600">{lms.description}</p>
            )}
          </header>
          {/* Content View */}
          {selectedContent ? (
            <ContentView content={selectedContent} isCreator={isCreator} />
          ) : (
            <div className="text-center text-gray-500">
              <Lightbulb size={64} className="mx-auto mb-4" />
              <p className="text-lg lg:text-xl">Select a content item to view its details</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

