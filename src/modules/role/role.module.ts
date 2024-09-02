import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RoleRepository, RolePermissionRepository } from './repository';
import { PermissionRepository } from '../permission/repository';
import { CommonHelper } from 'src/common/helpers';

@Module({
  imports: [PrismaModule],
  controllers: [RoleController],
  providers: [
    RoleService,
    RoleRepository,
    RolePermissionRepository,
    PermissionRepository,
    CommonHelper,
  ],
  exports: [RoleService],
})
export class RoleModule {}
