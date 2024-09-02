-- CreateTable
CREATE TABLE "address_types" (
    "id" SERIAL NOT NULL,
    "address_name" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_addresses" (
    "id" SERIAL NOT NULL,
    "address_name" VARCHAR(25) NOT NULL,
    "country" VARCHAR(50),
    "full_name" VARCHAR(256),
    "mobile_number" VARCHAR(15),
    "pincode" VARCHAR(7),
    "address1" VARCHAR(256),
    "address2" VARCHAR(256),
    "landmark" VARCHAR(150),
    "city" VARCHAR(50),
    "state" VARCHAR(50),
    "delivery_days" JSONB[],
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" INTEGER,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,
    "deleted_at" TIMESTAMP(3),
    "deleted_by" INTEGER,

    CONSTRAINT "user_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_types_address_name_key" ON "address_types"("address_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_addresses_address_name_key" ON "user_addresses"("address_name");

-- AddForeignKey
ALTER TABLE "user_addresses" ADD CONSTRAINT "user_addresses_address_name_fkey" FOREIGN KEY ("address_name") REFERENCES "address_types"("address_name") ON DELETE CASCADE ON UPDATE CASCADE;
