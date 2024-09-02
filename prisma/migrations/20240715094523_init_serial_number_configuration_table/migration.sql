-- CreateTable
CREATE TABLE "serial_number_configurations" (
    "id" SERIAL NOT NULL,
    "module" TEXT NOT NULL,
    "alias" TEXT NOT NULL,
    "initial_number" INTEGER NOT NULL,
    "current_number" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "serial_number_configurations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "serial_number_configurations_module_key" ON "serial_number_configurations"("module");

-- CreateIndex
CREATE INDEX "serial_number_configurations_module_idx" ON "serial_number_configurations"("module");
