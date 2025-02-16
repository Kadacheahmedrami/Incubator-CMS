/*
  Warnings:

  - The primary key for the `Startup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Startup` table. All the data in the column will be lost.
  - You are about to drop the column `visible` on the `Startup` table. All the data in the column will be lost.
  - The `id` column on the `Startup` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `SiteConfig` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `landingPageId` to the `Startup` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'MENTOR');

-- AlterTable
ALTER TABLE "Startup" DROP CONSTRAINT "Startup_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
DROP COLUMN "visible",
ADD COLUMN     "landingPageId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "description" DROP NOT NULL,
ADD CONSTRAINT "Startup_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "SiteConfig";

-- CreateTable
CREATE TABLE "LandingPage" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "landingImage" TEXT NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Startup" ADD CONSTRAINT "Startup_landingPageId_fkey" FOREIGN KEY ("landingPageId") REFERENCES "LandingPage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
