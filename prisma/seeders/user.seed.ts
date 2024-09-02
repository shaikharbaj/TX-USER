// prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SecurityHelper } from '../../src/common/helpers/security.helper';
import { USER_ARR } from './constant';

// initialize Prisma Client
const prisma = new PrismaClient();
const securityHelperObj = new SecurityHelper();

async function main() {
  //Creating admin user

  console.log('Seeding user table...');
  for (const user of USER_ARR) {
    const emailHash = await securityHelperObj.hash(user.email);
    //Checking email exists or not
    const admin = await prisma.user.findFirst({
      select: {
        id: true,
      },
      where: { email: { startsWith: `${emailHash}|` } },
    });
    if (!admin) {
      const createdUser = await prisma.user.create({
        data: {
          unique_id: user.unique_id,
          email: await securityHelperObj.encrypt(user.email),
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          mobile_number: user.mobile_number,
          pan_card_number: user.pan_card_number,
          status: 'ACTIVE',
          user_type: 'ADMIN',
        },
      });
      if (createdUser) {
        //Creating password
        await prisma.auth.upsert({
          where: { user_id: createdUser.id },
          update: {
            user_id: createdUser.id,
            password: await bcrypt.hash('123456789', 10),
          },
          create: {
            user_id: createdUser.id,
            password: await bcrypt.hash('123456789', 10),
          },
        });
      }
    }
  }
  console.log('User table seeded successfully');
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
