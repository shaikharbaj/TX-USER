import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  PaginateFunction,
  paginator,
} from 'src/modules/prisma/paginator';

//Defining per page record in pagination
const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class UserAddressRepository {
  constructor(private prismaService: PrismaService) { }

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOneWithoutDelete(select: any, where: any = {}) {
    return this.prismaService.userAddress.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any = {}) {
    return this.prismaService.userAddress.findFirst({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return this.prismaService.userAddress.create({ data: payload });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any = {}) {
    return this.prismaService.userAddress.findMany({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition with pagination
   */
  async findManyWithPaginate(page: number = 1, select: any, where: any = {}) {
    const pageNumber = page ? page : 1;
    return paginate(
      this.prismaService.userAddress,
      {
        select: select,
        where: {
          is_deleted: false,
          ...where,
        },
      },
      { page: pageNumber },
    );
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any) {
    return this.prismaService.userAddress.update({
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
    return this.prismaService.userAddress.upsert({
      create: create,
      update: update,
      where: where,
    });
  }

  async findManyDeletedWithPaginate(select: {}, where: any, page: number = 1) {
    return paginate(
      this.prismaService.userAddress,
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

  async updateWithOutDeleted(where: any, payload: any) {
    return this.prismaService.userAddress.update({
      where: where,
      data: payload,
    });
  }

  async updateMany(where: any, data: any) {
    const updates = await this.prismaService.userAddress.updateMany({
      where,
      data,
    });
    return updates;
  }
}
