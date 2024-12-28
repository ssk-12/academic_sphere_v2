/*
  Warnings:

  - You are about to drop the column `classId` on the `LMS` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[lmsId,orderIndex]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[chapterId,orderIndex]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Chapter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdById` to the `LMS` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `LMS` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_lmsId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_chapterId_fkey";

-- DropForeignKey
ALTER TABLE "LMS" DROP CONSTRAINT "LMS_classId_fkey";

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "orderIndex" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "LMS" DROP COLUMN "classId",
ADD COLUMN     "createdById" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "ClassLMS" (
    "id" TEXT NOT NULL,
    "classId" TEXT NOT NULL,
    "lmsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClassLMS_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClassLMS_classId_lmsId_key" ON "ClassLMS"("classId", "lmsId");

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_lmsId_orderIndex_key" ON "Chapter"("lmsId", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "Content_chapterId_orderIndex_key" ON "Content"("chapterId", "orderIndex");

-- AddForeignKey
ALTER TABLE "LMS" ADD CONSTRAINT "LMS_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLMS" ADD CONSTRAINT "ClassLMS_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassLMS" ADD CONSTRAINT "ClassLMS_lmsId_fkey" FOREIGN KEY ("lmsId") REFERENCES "LMS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_lmsId_fkey" FOREIGN KEY ("lmsId") REFERENCES "LMS"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
