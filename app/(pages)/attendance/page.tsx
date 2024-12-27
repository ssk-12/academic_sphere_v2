import AttendancePage from "@/components/attendance/attendance"
import { auth } from "@/auth"

export default async function Attendance() {
  const session = await auth();
  const userId = session.user.id;
  return (
    <div className="container mx-auto py-2">
      <AttendancePage userId={userId}/>
    </div>
  )
}

