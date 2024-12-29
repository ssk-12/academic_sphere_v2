'use client'

import { Content } from '@prisma/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { UpdateContentForm } from './update-content-form'
import { DeleteContentButton } from './delete-content-button'
import ReactMarkdown from 'react-markdown'
import { FileText, Edit, Trash2 } from 'lucide-react'

interface ContentViewProps {
  content: Content
  isCreator: boolean
}

export function ContentView({ content, isCreator }: ContentViewProps) {
  return (
    <Card className="bg-white shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FileText className="mr-2" size={24} />
            <span className="text-2xl">{content.title}</span>
          </div>
          {isCreator && (
            <div className="flex space-x-2">
              <UpdateContentForm content={content} />
              <DeleteContentButton contentId={content.id} />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none mt-6">
        <ReactMarkdown>{content.body}</ReactMarkdown>
      </CardContent>
    </Card>
  )
}

