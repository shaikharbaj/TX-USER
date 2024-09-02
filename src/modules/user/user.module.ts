import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { PrismaModule } from "../prisma/prisma.module";
import { PermissionModule } from "../permission/permission.module";
import { RoleModule } from "../role/role.module";
import { SerialNumberConfigurationModule } from "../serial-number-configiration/serial-number-configuration.module";
import { UserController } from "./user.controller";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { UserService } from "./user.service";
import {
  UserRepository,
  AuthRepository,
  UserRoleRepository,
  UserBankDetailsRepository,
  UserVerificationRepository,
  UserDocumentRepository,
} from "./repository";
import { CommonHelper, S3Helper, SecurityHelper } from "src/common/helpers";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";
import { MODULE_CONFIG } from "./module.config";
import { FinancierController } from "./financier.controller";
import { FinancierService } from "./financier.service";

const PRODUCT_MS_TRANSPORT = MODULE_CONFIG.PRODUCT_MS.transport;
const NOTIFICATION_MS_TRANSPORT = MODULE_CONFIG.NOTIFICATION_MS.transport;
@Module({
  imports: [
    ClientsModule.register([MODULE_CONFIG.PRODUCT_MS[PRODUCT_MS_TRANSPORT]]),
    ClientsModule.register([MODULE_CONFIG.NOTIFICATION_MS[NOTIFICATION_MS_TRANSPORT]]),
    PrismaModule,
    PermissionModule,
    RoleModule,
    SerialNumberConfigurationModule,
  ],
  controllers: [AdminController, UserController, SellerController,FinancierController],
  providers: [
    AdminService,
    UserService,
    SellerService,
    AuthRepository,
    UserRepository,
    UserRoleRepository,
    CommonHelper,
    SecurityHelper,
    UserBankDetailsRepository,
    UserVerificationRepository,
    UserDocumentRepository,
    S3Helper,
    FinancierService
  ],
  exports: [AdminService, UserService, SellerService,FinancierService],
})
export class UserModule { }
