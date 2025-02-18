/*
  Warnings:

  - Added the required column `order` to the `VisionAndMission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VisionAndMission" ADD COLUMN     "order" INTEGER NOT NULL;
