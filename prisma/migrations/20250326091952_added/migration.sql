/*
  Warnings:

  - Added the required column `lastReportedTime` to the `Bin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bin" ADD COLUMN     "lastReportedTime" TEXT NOT NULL;
