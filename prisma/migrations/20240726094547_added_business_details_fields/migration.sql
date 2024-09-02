/*
  Warnings:

  - You are about to drop the column `data_of_birth` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('MANUFACTURER', 'TRADER', 'RETAILER', 'ALL');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "data_of_birth",
ADD COLUMN     "business_type" "BusinessType",
ADD COLUMN     "company_offerings" TEXT,
ADD COLUMN     "date_of_birth" DATE,
ADD COLUMN     "establishment" TEXT,
ADD COLUMN     "operation_locations" TEXT,
ADD COLUMN     "product_category_id" INTEGER,
ADD COLUMN     "product_division_id" INTEGER;
