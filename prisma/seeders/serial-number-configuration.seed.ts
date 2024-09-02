// prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SERIAL_NUMBER_CONFIGURATION_ARR } from "./constant";

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log("Seeding serial number configuration table...");
  for (const serial_number of SERIAL_NUMBER_CONFIGURATION_ARR) {
    await prisma.serialNumberConfiguration.upsert({
      where: { module: serial_number.module },
      update: {},
      create: {
        module: serial_number.module,
        alias: serial_number.alias,
        initial_number: serial_number.initial_number,
        current_number: serial_number.current_number,
      },
    });
  }
  console.log("Serial number configuration table seeded successfully");
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
