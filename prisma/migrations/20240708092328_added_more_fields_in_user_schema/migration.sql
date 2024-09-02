-- CreateEnum
CREATE TYPE "UserEntity" AS ENUM ('INDIVIDUAL', 'COMPANY');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bidding_access" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "company_name" VARCHAR(191),
ADD COLUMN     "data_of_birth" DATE,
ADD COLUMN     "employee_id" VARCHAR(50),
ADD COLUMN     "entity" "UserEntity" NOT NULL DEFAULT 'INDIVIDUAL',
ADD COLUMN     "full_name_as_per_pan_card" VARCHAR(191),
ADD COLUMN     "pan_card_image" VARCHAR(255),
ADD COLUMN     "profile_url" VARCHAR(100),
ADD COLUMN     "rm_name" VARCHAR(191),
ADD COLUMN     "step_completed" INTEGER DEFAULT 0,
ADD COLUMN     "year_of_registration" DATE;
