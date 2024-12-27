/*
  Warnings:

  - A unique constraint covering the columns `[eventId,studentId,checkedAt]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendance_eventId_studentId_checkedAt_key" ON "Attendance"("eventId", "studentId", "checkedAt");
