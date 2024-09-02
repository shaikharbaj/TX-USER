-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CURRENT', 'SAVING', 'LOAN');

-- CreateTable
CREATE TABLE "user_bank_details" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "account_holder_name" VARCHAR(256) NOT NULL,
    "account_number" VARCHAR(256) NOT NULL,
    "ifsc_code" VARCHAR(256) NOT NULL,
    "branch_name" VARCHAR(256) NOT NULL,
    "account_type" "AccountType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,

    CONSTRAINT "user_bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_bank_details_uuid_key" ON "user_bank_details"("uuid");

-- AddForeignKey
ALTER TABLE "user_bank_details" ADD CONSTRAINT "user_bank_details_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
