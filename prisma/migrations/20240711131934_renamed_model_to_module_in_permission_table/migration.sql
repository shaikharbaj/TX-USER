/*
  Warnings:

  - You are about to drop the column `model` on the `permissions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "permissions" DROP COLUMN "model",
ADD COLUMN     "module" VARCHAR(256);
