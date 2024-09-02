-- CreateEnum
CREATE TYPE "UniversalOnBoardingStatusType" AS ENUM ('PENDING', 'APPROVERD');

-- CreateEnum
CREATE TYPE "BasicInformationStatusType" AS ENUM ('PENDING', 'APPROVERD');

-- CreateEnum
CREATE TYPE "BankingStatusType" AS ENUM ('PENDING', 'APPROVERD');

-- CreateEnum
CREATE TYPE "VerificationStatusType" AS ENUM ('PENDING', 'APPROVERD');

-- AlterTable
ALTER TABLE "user_bank_details" ADD COLUMN     "banking_status" "BankingStatusType",
ADD COLUMN     "rejection_detail" TEXT;

-- AlterTable
ALTER TABLE "user_verification" ADD COLUMN     "verification_rejection_detail" TEXT,
ADD COLUMN     "verification_status" "VerificationStatusType";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "basic_info_rejection_detail" TEXT,
ADD COLUMN     "basic_info_status" "BasicInformationStatusType",
ADD COLUMN     "universalOnBoardingStatus" "UniversalOnBoardingStatusType" NOT NULL DEFAULT 'PENDING';
