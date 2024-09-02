// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { ADDRESS_TYPE_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding address type table...');
  for (const type of ADDRESS_TYPE_ARR) {
    await prisma.addressType.upsert({
      where: { slug: type.slug },
      update: {},
      create: {
        address_name: type.address_name,
        slug: type.slug,
      },
    });
  }
  console.log('Address Type table seeded successfully');
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
