/*
  Warnings:

  - You are about to drop the column `landingPageId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `landingPageId` on the `HistoryAndValues` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `HistoryAndValues` table. All the data in the column will be lost.
  - You are about to drop the column `landingPageId` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `News` table. All the data in the column will be lost.
  - You are about to drop the column `landingPageId` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Startup` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_landingPageId_fkey";

-- DropForeignKey
ALTER TABLE "HistoryAndValues" DROP CONSTRAINT "HistoryAndValues_landingPageId_fkey";

-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_landingPageId_fkey";

-- DropForeignKey
ALTER TABLE "Program" DROP CONSTRAINT "Program_landingPageId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "landingPageId",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "HistoryAndValues" DROP COLUMN "landingPageId",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "News" DROP COLUMN "landingPageId",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "landingPageId",
DROP COLUMN "order";

-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "description",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "idea" TEXT,
ADD COLUMN     "imageUrl" TEXT;

-- CreateTable
CREATE TABLE "FeaturedHistoryAndValues" (
    "id" SERIAL NOT NULL,
    "landingPageId" INTEGER NOT NULL,
    "historyAndValuesId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FeaturedHistoryAndValues_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedEvent" (
    "id" SERIAL NOT NULL,
    "landingPageId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FeaturedEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedProgram" (
    "id" SERIAL NOT NULL,
    "landingPageId" INTEGER NOT NULL,
    "programId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FeaturedProgram_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeaturedNews" (
    "id" SERIAL NOT NULL,
    "landingPageId" INTEGER NOT NULL,
    "newsId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "FeaturedNews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupMentor" (
    "id" SERIAL NOT NULL,
    "startupId" INTEGER NOT NULL,
    "mentorId" TEXT NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StartupMentor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupFounder" (
    "id" SERIAL NOT NULL,
    "startupId" INTEGER NOT NULL,
    "founderId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StartupFounder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StartupApplication" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "startupName" TEXT NOT NULL,
    "idea" TEXT NOT NULL,
    "details" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StartupApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FeaturedHistoryAndValues" ADD CONSTRAINT "FeaturedHistoryAndValues_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedHistoryAndValues" ADD CONSTRAINT "FeaturedHistoryAndValues_historyAndValuesId_fkey" FOREIGN KEY ("historyAndValuesId") REFERENCES "HistoryAndValues"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedEvent" ADD CONSTRAINT "FeaturedEvent_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedEvent" ADD CONSTRAINT "FeaturedEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedProgram" ADD CONSTRAINT "FeaturedProgram_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedProgram" ADD CONSTRAINT "FeaturedProgram_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedNews" ADD CONSTRAINT "FeaturedNews_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedNews" ADD CONSTRAINT "FeaturedNews_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupMentor" ADD CONSTRAINT "StartupMentor_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupMentor" ADD CONSTRAINT "StartupMentor_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupFounder" ADD CONSTRAINT "StartupFounder_startupId_fkey" FOREIGN KEY ("startupId") REFERENCES "Startup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StartupFounder" ADD CONSTRAINT "StartupFounder_founderId_fkey" FOREIGN KEY ("founderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
