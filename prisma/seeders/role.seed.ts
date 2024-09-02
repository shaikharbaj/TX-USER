// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { ROLE_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding role table...');
  for (const role of ROLE_ARR) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: {
        role_name: role.role_name,
        slug: role.slug,
        description: role.description,
        is_active: role.is_active,
      },
      create: {
        role_name: role.role_name,
        slug: role.slug,
        description: role.description,
        is_active: role.is_active,
      },
    });
  }
  console.log('Role table seeded successfully');
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
