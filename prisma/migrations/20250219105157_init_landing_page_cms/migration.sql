/*
  Warnings:

  - You are about to drop the column `heroId` on the `LandingPage` table. All the data in the column will be lost.
  - Added the required column `landingPageId` to the `Hero` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LandingPage" DROP CONSTRAINT "LandingPage_heroId_fkey";

-- DropIndex
DROP INDEX "LandingPage_heroId_key";

-- AlterTable
ALTER TABLE "Hero" ADD COLUMN     "landingPageId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "LandingPage" DROP COLUMN "heroId";

-- AddForeignKey
ALTER TABLE "Hero" ADD CONSTRAINT "Hero_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
