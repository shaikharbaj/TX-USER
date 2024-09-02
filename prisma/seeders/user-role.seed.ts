// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding user role table...');
  const admin = await prisma.user.findFirst({ where: { user_type: 'ADMIN' } });
  const adminRole = await prisma.role.findFirst({ where: { slug: 'admin' } });
  const userRole = await prisma.userRole.findFirst({
    where: { user_id: admin.id },
  });
  if (userRole === null) {
    await prisma.userRole.create({
      data: {
        user_id: admin.id,
        role_id: adminRole.id,
      },
    });
  }
  console.log('User role table seeded successfully');
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
