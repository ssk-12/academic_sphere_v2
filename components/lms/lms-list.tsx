'use client'

import Link from 'next/link'
import { LMS } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { DeleteLMSButton } from './delete-lms-button'
import { UpdateLMSForm } from './update-lms-form'

interface LMSListProps {
  title: string
  lmsList: LMS[]
}

export function LMSList({ title, lmsList }: LMSListProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lmsList.map((lms) => (
          <Card key={lms.id}>
            <CardHeader>
              <CardTitle>{lms.name}</CardTitle>
              <CardDescription>{lms.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {/* <p>Created at: {new Date(lms.createdAt).toLocaleDateString()}</p> */}
            </CardContent>
            <CardFooter className="flex flex-col md:flex-row justify-between space-y-2 md:space-y-0 md:space-x-2">
              <Link href={`/lms/${lms.id}`} passHref>
                <Button variant="outline">View Details</Button>
              </Link>
              <div className="flex space-x-2">
                <UpdateLMSForm lms={lms} />
                <DeleteLMSButton lmsId={lms.id} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

