/*
  Warnings:

  - You are about to drop the column `landingPageId` on the `Startup` table. All the data in the column will be lost.
  - Added the required column `description` to the `LandingPage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Startup" DROP CONSTRAINT "Startup_landingPageId_fkey";

-- AlterTable
ALTER TABLE "LandingPage" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Startup" DROP COLUMN "landingPageId";
