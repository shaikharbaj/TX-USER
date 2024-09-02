/*
  Warnings:

  - A unique constraint covering the columns `[aadhar_card_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "aadhar_card_number" VARCHAR(255);

-- CreateIndex
CREATE UNIQUE INDEX "users_aadhar_card_number_key" ON "users"("aadhar_card_number");
