/*
  Warnings:

  - The values [PENDING,APPROVERD] on the enum `BankingStatusType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,APPROVERD] on the enum `BasicInformationStatusType` will be removed. If these variants are still used in the database, this will fail.
  - The values [APPROVERD] on the enum `UniversalOnBoardingStatusType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PENDING,APPROVERD] on the enum `VerificationStatusType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BankingStatusType_new" AS ENUM ('REJECTED', 'APPROVED');
ALTER TABLE "user_bank_details" ALTER COLUMN "banking_status" TYPE "BankingStatusType_new" USING ("banking_status"::text::"BankingStatusType_new");
ALTER TYPE "BankingStatusType" RENAME TO "BankingStatusType_old";
ALTER TYPE "BankingStatusType_new" RENAME TO "BankingStatusType";
DROP TYPE "BankingStatusType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "BasicInformationStatusType_new" AS ENUM ('REJECTED', 'APPROVED');
ALTER TABLE "users" ALTER COLUMN "basic_info_status" TYPE "BasicInformationStatusType_new" USING ("basic_info_status"::text::"BasicInformationStatusType_new");
ALTER TYPE "BasicInformationStatusType" RENAME TO "BasicInformationStatusType_old";
ALTER TYPE "BasicInformationStatusType_new" RENAME TO "BasicInformationStatusType";
DROP TYPE "BasicInformationStatusType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UniversalOnBoardingStatusType_new" AS ENUM ('PENDING', 'APPROVED');
ALTER TABLE "users" ALTER COLUMN "universalOnBoardingStatus" DROP DEFAULT;
ALTER TABLE "users" ALTER COLUMN "universalOnBoardingStatus" TYPE "UniversalOnBoardingStatusType_new" USING ("universalOnBoardingStatus"::text::"UniversalOnBoardingStatusType_new");
ALTER TYPE "UniversalOnBoardingStatusType" RENAME TO "UniversalOnBoardingStatusType_old";
ALTER TYPE "UniversalOnBoardingStatusType_new" RENAME TO "UniversalOnBoardingStatusType";
DROP TYPE "UniversalOnBoardingStatusType_old";
ALTER TABLE "users" ALTER COLUMN "universalOnBoardingStatus" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "VerificationStatusType_new" AS ENUM ('REJECTED', 'APPROVED');
ALTER TABLE "user_verification" ALTER COLUMN "verification_status" TYPE "VerificationStatusType_new" USING ("verification_status"::text::"VerificationStatusType_new");
ALTER TYPE "VerificationStatusType" RENAME TO "VerificationStatusType_old";
ALTER TYPE "VerificationStatusType_new" RENAME TO "VerificationStatusType";
DROP TYPE "VerificationStatusType_old";
COMMIT;
