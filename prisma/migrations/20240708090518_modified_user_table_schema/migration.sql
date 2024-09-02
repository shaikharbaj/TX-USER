/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "users" (
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

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_mobile_number_key" ON "users"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_pan_card_number_key" ON "users"("pan_card_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_gst_number_key" ON "users"("gst_number");

-- CreateIndex
CREATE INDEX "users_unique_id_email_mobile_number_pan_card_number_gst_num_idx" ON "users"("unique_id", "email", "mobile_number", "pan_card_number", "gst_number");
