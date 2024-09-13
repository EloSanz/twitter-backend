/*
  Warnings:

  - You are about to drop the column `publicPosts` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "publicPosts",
ADD COLUMN     "private" BOOLEAN NOT NULL DEFAULT true;
