import { Suspense } from 'react'
import { CreateClassForm } from './create-class-form'
import { EnrollClassForm } from './enroll-class-form'
import { ClassCard } from './class-card'
import { getClasses } from '@/actions/class'
import { Skeleton } from "@/components/ui/skeleton"

function ClassesSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-[200px] w-full" />
      ))}
    </div>
  )
}

async function ClassesList() {
  const classes = await getClasses()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {classes.map((cls) => (
        <ClassCard key={cls.id} id={cls.id} name={cls.name} description={cls.description as string} students={cls.students.length} />
      ))}
    </div>
  )
}

export default function ClassesPage() {
  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold">Classes</h1>
        <div className="flex gap-4">
          <CreateClassForm />
          <EnrollClassForm />
        </div>
      </div>
      <Suspense fallback={<ClassesSkeleton />}>
        <ClassesList />
      </Suspense>
    </div>
  )
}

