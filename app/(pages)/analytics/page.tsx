import AttendanceDashboard from "@/components/attendance-dashboard"

export default function AttendancePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Attendance Analytics</h1>
      <AttendanceDashboard />
    </div>
  )
}

