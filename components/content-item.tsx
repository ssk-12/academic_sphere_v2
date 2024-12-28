'use client'

import { useState } from 'react'
import { Content } from '@prisma/client'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UpdateContentForm } from './update-content-form'
import { DeleteContentButton } from './delete-content-button'
import ReactMarkdown from 'react-markdown'

interface ContentItemProps {
  content: Content
  isCreator: boolean
}

export function ContentItem({ content, isCreator }: ContentItemProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{content.title}</span>
          {isCreator && (
            <div className="flex space-x-2">
              <UpdateContentForm content={content} />
              <DeleteContentButton contentId={content.id} />
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isExpanded ? (
          <ReactMarkdown>{content.body}</ReactMarkdown>
        ) : (
          <p>{content.body.slice(0, 100)}...</p>
        )}
        <Button onClick={() => setIsExpanded(!isExpanded)} variant="link" className="mt-2">
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
      </CardContent>
    </Card>
  )
}

