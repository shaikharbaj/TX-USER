import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginatedResult, PaginateFunction, paginator } from 'src/modules/prisma/paginator';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class PermissionRepository {
  constructor(private prismaService: PrismaService) {}

  async findOne(where: any, relation: any = {}) {
    return await this.prismaService.permission.findFirst({
      where: where,
    });
  }

  async findMany(select: any, where: any) {
    return await this.prismaService.permission.findMany({
      select,
      where: {
        deleted_at: null,
        ...where
      },
    });
  }

  async findManyWithPaginate(where: any, page: number = 1) {
    return await paginate(this.prismaService.permission, {where}, {page})
  }

  async findAll() {
    return await this.prismaService.permission.findMany();
  }

  async save(payload: any) {
    return await this.prismaService.permission.create({ data: payload });
  }

  async update(where: any, payload: any) {
    return await this.prismaService.permission.update({
      where: where,
      data: payload,
    });
  }
}
