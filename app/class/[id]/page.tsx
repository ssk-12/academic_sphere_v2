import { getClass } from '@/actions/class'
import { ClassOverview } from './components/class-overview'


export default async function ClassPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the class data here based on the ID
  const classData = await getClass(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <ClassOverview classData={classData} />
    </div>
  )
}

