/*
  Warnings:

  - You are about to drop the column `senderWalletId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `walletId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_walletId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "senderWalletId",
DROP COLUMN "walletId";
