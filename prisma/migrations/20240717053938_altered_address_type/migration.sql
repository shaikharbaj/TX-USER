/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `address_types` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `address_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "address_types" ADD COLUMN     "slug" VARCHAR(25) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "address_types_slug_key" ON "address_types"("slug");
