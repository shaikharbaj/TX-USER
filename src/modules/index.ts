import { PrismaModule } from './prisma/prisma.module';
import { SerialNumberConfigurationModule } from './serial-number-configiration/serial-number-configuration.module';
import { PermissionModule } from './permission/permission.module';
import { RoleModule } from './role/role.module';
import { UserModule } from './user/user.module';
import { UserAddressModule } from './user-address/user-address.module';

export { 
    PrismaModule, 
    SerialNumberConfigurationModule, 
    UserModule, 
    RoleModule, 
    PermissionModule,
    UserAddressModule
 };
