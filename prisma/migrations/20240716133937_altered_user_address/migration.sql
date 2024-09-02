/*
  Warnings:

  - Made the column `country` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `full_name` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mobile_number` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `pincode` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address2` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `landmark` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `user_addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_addresses" ALTER COLUMN "country" SET NOT NULL,
ALTER COLUMN "full_name" SET NOT NULL,
ALTER COLUMN "mobile_number" SET NOT NULL,
ALTER COLUMN "pincode" SET NOT NULL,
ALTER COLUMN "address2" SET NOT NULL,
ALTER COLUMN "landmark" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;
