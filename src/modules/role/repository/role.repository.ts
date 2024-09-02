import { Injectable } from '@nestjs/common';
import { PaginateFunction, paginator } from 'src/modules/prisma/paginator';
import { PrismaService } from 'src/modules/prisma/prisma.service';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class RoleRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOneWithoutDelete(select: any = {}, where: any, relation: any = {}) {
    return this.prismaService.role.findFirst({
      select: select,
      where: where,
    });
  }

  async findOne(select: any = {}, where: any, relation: any = {}) {
    return await this.prismaService.role.findFirst({
      select: select,
      where: {
        ...where,
        is_deleted: false,
      },
    });
  }

  async findMany(select: any, where: any, relation: any = {}) {
    return this.prismaService.role.findMany({
      select: select,
      where: {
        ...where,
        is_deleted: false,
      },
    });
  }

  async findManyWithPaginate(select: {}, where: any, page: number = 1) {
    return paginate(
      this.prismaService.role,
      {
        select: select,
        where: {
          is_deleted: false,
          ...where,
        },
      },
      { page },
    );
  }

  async findAll() {
    return this.prismaService.role.findMany();
  }

  async create(payload: any) {
    return this.prismaService.role.create({ data: payload });
  }

  /**
   * @description
   * Function to upsert record
   */
  async update(where: any, payload: any) {
    return this.prismaService.role.update({
      where: {
        is_deleted: false,
        ...where,
      },
      data: payload,
    });
  }

  /**
   * @description
   * Function to upsert record
   */
  upsert(create: any, update: any, where: any) {
    return this.prismaService.role.upsert({
      create: create,
      update: update,
      where: where,
    });
  }

  async updateWithOutDeleted(where: any, payload: any) {
    return this.prismaService.role.update({
      where: where,
      data: payload,
    });
  }

  async findManyDeletedWithPaginate(select: {}, where: any, page: number = 1) {
    return paginate(
      this.prismaService.role,
      {
        select: select,
        where: {
          is_deleted: true,
          ...where,
        },
      },
      { page },
    );
  }
}
