/*
  Warnings:

  - You are about to drop the column `product_division_id` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "product_division_id",
ADD COLUMN     "product_industry_id" INTEGER;
