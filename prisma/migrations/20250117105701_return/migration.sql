/*
  Warnings:

  - Added the required column `statistics` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "answeredResult" INTEGER NOT NULL DEFAULT -1,
ADD COLUMN     "statistics" JSONB NOT NULL;
