/*
  Warnings:

  - You are about to drop the column `deleted_at` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `deleted_by` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `user_roles` table. All the data in the column will be lost.
  - You are about to drop the column `updated_by` on the `user_roles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_roles" DROP COLUMN "deleted_at",
DROP COLUMN "deleted_by",
DROP COLUMN "updated_at",
DROP COLUMN "updated_by";
