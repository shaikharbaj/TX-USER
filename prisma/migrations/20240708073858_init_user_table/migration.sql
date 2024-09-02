-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('ADMIN', 'SUBADMIN', 'SELLER', 'BUYER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'INACTIVE', 'ACTIVE', 'SUSPENDED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "UserKycStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "unique_id" VARCHAR(50),
    "first_name" VARCHAR(100),
    "middle_name" VARCHAR(100),
    "last_name" VARCHAR(100),
    "email" VARCHAR(200),
    "mobile_number" VARCHAR(25),
    "pan_card_number" VARCHAR(25),
    "gst_number" VARCHAR(25),
    "designation" VARCHAR(50),
    "user_type" "UserType" NOT NULL DEFAULT 'BUYER',
    "status" "UserStatus" NOT NULL DEFAULT 'INACTIVE',
    "kyc_status" "UserKycStatus" NOT NULL DEFAULT 'PENDING',
    "is_login" BOOLEAN NOT NULL DEFAULT false,
    "last_logged_in_at" TIMESTAMP(3),
    "last_logged_in_ip" VARCHAR(50),
    "token" VARCHAR(100),
    "socket_session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_pan_card_number_key" ON "User"("pan_card_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_gst_number_key" ON "User"("gst_number");
