-- AlterTable
ALTER TABLE "Quiz" ADD COLUMN     "isAssigned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "QuizAssignment" ALTER COLUMN "status" SET DEFAULT 'Not Started';
