/*
  Warnings:

  - You are about to drop the column `rejection_detail` on the `user_bank_details` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_bank_details" DROP COLUMN "rejection_detail",
ADD COLUMN     "banking_rejection_detail" TEXT;
