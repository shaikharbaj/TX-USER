// prisma/seed.ts

import { PrismaClient, UserStatus, UserType } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { SecurityHelper } from '../../src/common/helpers/security.helper';
import {
  SERIAL_NUMBER_CONFIGURATION_ARR,
  USER_ARR,
  ROLE_ARR,
  PERMISSION_ARR,
  ADDRESS_TYPE_ARR
} from "./constant";

// initialize Prisma Client
const prisma = new PrismaClient();
// initialize security helper
const securityHelperObj = new SecurityHelper();

async function main() {
  ///////////////////////////// START SERIAL NUMBER TABLE SEEDER ////////////////////////////////
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
  ///////////////////////////// END SERIAL NUMBER TABLE SEEDER ////////////////////////////////

  ///////////////////////////// START USER TABLE SEEDER ////////////////////////////////
  console.log("Seeding user table...");
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
          mobile_number: await securityHelperObj.encrypt(user.mobile_number),
          pan_card_number: await securityHelperObj.encrypt(user.pan_card_number),
          status: user.status === 'ACTIVE' ? UserStatus.ACTIVE : UserStatus.INACTIVE,
          user_type: user.user_type === 'ADMIN' ? UserType.ADMIN :
          user.user_type === 'SELLER' ? UserType.SELLER :
          user.user_type === 'BUYER' ? UserType.BUYER :
          user.user_type === 'FINANCIER' ? UserType.FINANCIER : 
          UserType.SUBADMIN,
        }
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
  console.log("User table seeded successfully");
  ///////////////////////////// END USER TABLE SEEDER ////////////////////////////////

  ///////////////////////////// START ROLE TABLE SEEDER ////////////////////////////////
  console.log("Seeding role table...");
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
  console.log("Role table seeded successfully");
  ///////////////////////////// END ROLE TABLE SEEDER ////////////////////////////////

  ///////////////////////////// START PERMISSION TABLE SEEDER ////////////////////////////////
  console.log("Seeding permission table...");
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
  console.log("Permissions table seeded successfully");
  ///////////////////////////// END PERMISSION TABLE SEEDER ////////////////////////////////

  ///////////////////////////// START ROLE AND PERMISSION TABLE SEEDER ////////////////////////////////
  console.log("Seeding role & permission mapping table...");
  const adminRoleOne = await prisma.role.findFirst({
    where: { slug: "admin" },
  });
  await prisma.rolePermission.deleteMany({
    where: { role_id: adminRoleOne.id },
  });
  const allPermissions = await prisma.permission.findMany({
    where: { is_active: true },
  });
  if (allPermissions.length > 0) {
    const rolePermissions = [];
    allPermissions.forEach((permission: any, permissionIndex: number) => {
      rolePermissions.push({
        role_id: adminRoleOne.id,
        permission_id: permission.id,
      });
    });
    await prisma.rolePermission.createMany({ data: rolePermissions });
  }
  console.log("Role & Permission mapping table seeded successfully");
  ///////////////////////////// END ROLE AND PERMISSION TABLE SEEDER ////////////////////////////////

  ///////////////////////////// START USER ROLE TABLE SEEDER ////////////////////////////////
  console.log("Seeding user role table...");
  const admin = await prisma.user.findFirst({ where: { user_type: 'ADMIN' } });
  const adminRoleTwo = await prisma.role.findFirst({
    where: { slug: "admin" },
  });
  const userRole = await prisma.userRole.findFirst({
    where: { user_id: admin.id },
  });
  if (userRole === null) {
    await prisma.userRole.create({
      data: {
        user_id: admin.id,
        role_id: adminRoleTwo.id,
      },
    });
  }
  console.log("User role table seeded successfully");
  ///////////////////////////// END USER ROLE TABLE SEEDER ////////////////////////////////

  ///////////////////////////// START ADDRESS TYPE TABLE SEEDER ////////////////////////////////
  console.log("Seeding address type table...");
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
  console.log("Address type table seeded successfully");
  ///////////////////////////// END ADDRESS TYPE TABLE SEEDER ////////////////////////////////
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
