/*
  Warnings:

  - The `product_category_id` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "product_category_id",
ADD COLUMN     "product_category_id" JSONB;
