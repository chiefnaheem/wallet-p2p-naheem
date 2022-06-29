/*
  Warnings:

  - You are about to drop the column `userId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `walletId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `receiverWalletId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderWalletId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "userId",
DROP COLUMN "walletId",
ADD COLUMN     "receiverWalletId" TEXT NOT NULL,
ADD COLUMN     "senderWalletId" TEXT NOT NULL;
