// prisma/seed.ts

import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding role & permission mapping table...');
  const adminRole = await prisma.role.findFirst({ where: { slug: 'admin' } });
  await prisma.rolePermission.deleteMany({ where: { role_id: adminRole.id } });
  const allPermissions = await prisma.permission.findMany({
    where: { is_active: true },
  });
  if (allPermissions.length > 0) {
    const rolePermissions = [];
    allPermissions.forEach((permission: any, permissionIndex: number) => {
      rolePermissions.push({
        role_id: adminRole.id,
        permission_id: permission.id,
      });
    });
    await prisma.rolePermission.createMany({ data: rolePermissions });
  }
  console.log('Role & Permission mapping table seeded successfully');
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
