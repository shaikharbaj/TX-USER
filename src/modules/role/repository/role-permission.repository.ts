import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/modules/prisma/paginator';
import { PrismaService } from 'src/modules/prisma/prisma.service';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class RolePermissionRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to remove permission from role
   */
  async deattachPermissions(where: any) {
    return await this.prismaService.rolePermission.deleteMany({ where: where });
  }

  /**
   * @description
   * Function to assign permission from role
   */
  async attachPermissions(payload: any) {
    return await this.prismaService.rolePermission.createMany({
      data: payload,
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findOne(select: any, where: any = {}) {
    return await this.prismaService.rolePermission.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any = {}) {
    return await this.prismaService.rolePermission.findMany({
      select: select,
      where: where,
    });
  }
}
