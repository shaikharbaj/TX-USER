/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `address_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uuid]` on the table `user_addresses` will be added. If there are existing duplicate values, this will fail.
  - The required column `uuid` was added to the `address_types` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `uuid` was added to the `user_addresses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "address_types" ADD COLUMN     "uuid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user_addresses" ADD COLUMN     "uuid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "address_types_uuid_key" ON "address_types"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_addresses_uuid_key" ON "user_addresses"("uuid");
