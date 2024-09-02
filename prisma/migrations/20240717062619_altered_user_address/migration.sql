/*
  Warnings:

  - Made the column `address1` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_addresses" ALTER COLUMN "address1" SET NOT NULL,
ALTER COLUMN "address2" DROP NOT NULL,
ALTER COLUMN "landmark" DROP NOT NULL,
ALTER COLUMN "is_active" SET DEFAULT true;
