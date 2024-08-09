/*
  Warnings:

  - You are about to drop the column `roomId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReceivedMessages` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `receiverId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_user1Id_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_user2Id_fkey";

-- DropForeignKey
ALTER TABLE "_ReceivedMessages" DROP CONSTRAINT "_ReceivedMessages_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReceivedMessages" DROP CONSTRAINT "_ReceivedMessages_B_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "roomId",
ADD COLUMN     "receiverId" UUID NOT NULL;

-- DropTable
DROP TABLE "Room";

-- DropTable
DROP TABLE "_ReceivedMessages";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
