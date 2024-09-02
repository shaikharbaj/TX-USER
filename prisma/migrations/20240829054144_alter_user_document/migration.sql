/*
  Warnings:

  - You are about to drop the column `document_file` on the `user_document` table. All the data in the column will be lost.
  - Added the required column `document` to the `user_document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_document" DROP COLUMN "document_file",
ADD COLUMN     "document" VARCHAR(256) NOT NULL;
