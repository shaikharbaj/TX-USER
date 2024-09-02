// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import { PERMISSION_ARR } from './constant'

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding permission table...');
  for (const permission of PERMISSION_ARR) {
    await prisma.permission.upsert({
      where: { slug: permission.slug },
      update: {},
      create: {
        permissions_name: permission.permissions_name,
        slug: permission.slug,
        description: permission.description,
        module: permission.module,
        is_active: permission.is_active,
        created_by: permission.created_by,
      },
    });
  }
  console.log('Permissions table seeded successfully');
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
