import { getClass } from '@/actions/class'
import { ClassOverview } from './components/class-overview'
import { ClassEvents } from './components/class-events';


export default async function ClassPage({ params }: { params: { id: string } }) {
  // In a real application, you would fetch the class data here based on the ID
  const { id } = await params;
  const classData = await getClass(id);

  return (
    <div className="container mx-auto px-3 py-2">
      <ClassOverview classData={classData} />
      <ClassEvents id={id} events={classData?.events || []} />
    </div>
  )
}

