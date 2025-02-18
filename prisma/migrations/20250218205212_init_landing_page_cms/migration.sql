/*
  Warnings:

  - A unique constraint covering the columns `[landingPageId]` on the table `Footer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `landingPageId` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `FAQ` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `FeaturedStartup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `Footer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `HistoryAndValues` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `News` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `Partner` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `Program` table without a default value. This is not possible if the table is not empty.
  - Added the required column `landingPageId` to the `VisionAndMission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FAQ" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FeaturedStartup" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Footer" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "HistoryAndValues" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Partner" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Program" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "VisionAndMission" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "LandingPage" (
    "id" SERIAL NOT NULL,
    "heroId" INTEGER NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hero" (
    "id" SERIAL NOT NULL,
    "landingImage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Hero_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_heroId_key" ON "LandingPage"("heroId");

-- CreateIndex
CREATE UNIQUE INDEX "Footer_landingPageId_key" ON "Footer"("landingPageId");

-- AddForeignKey
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_heroId_fkey" FOREIGN KEY ("heroId") REFERENCES "Hero"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HistoryAndValues" ADD CONSTRAINT "HistoryAndValues_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Partner" ADD CONSTRAINT "Partner_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeaturedStartup" ADD CONSTRAINT "FeaturedStartup_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FAQ" ADD CONSTRAINT "FAQ_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Program" ADD CONSTRAINT "Program_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisionAndMission" ADD CONSTRAINT "VisionAndMission_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Footer" ADD CONSTRAINT "Footer_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
