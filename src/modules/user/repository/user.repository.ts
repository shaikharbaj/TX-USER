/**
 * @fileoverview
 * User repository file to handle all user table operations
 *
 * @version
 * API version 1.0.
 *
 * @author
 * KATALYST TEAM
 *
 * @license
 * Licensing information, if applicable.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  PaginateFunction,
  paginator,
} from 'src/modules/prisma/paginator';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any, relation: any = {}) {
    return await this.prismaService.user.findFirst({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to find first matching record for given condition without delete
   */
  async findOneWithoutDelete(select: any, where: any, relation: any = {}) {
    return await this.prismaService.user.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition with pagination
   */
  async findManyWithPaginate(
    page: number,
    select: any,
    where: any = {},
    perPage: number = 10,
    orderBy: any = { id: "desc" }
  ) {
    const pageNumber = page ? page : 1;
    return paginate(
      this.prismaService.user,
      {
        select: select,
        where: {
          is_deleted: false,
          ...where,
        },
      },
      { page: pageNumber, perPage: perPage, orderBy: orderBy }
    );
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any) {
    return await this.prismaService.user.findMany({
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
    return await this.prismaService.user.create({ data: payload });
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any, select: any = {}) {
    const queryObj = {
      where: {
        is_deleted: false,
        ...where,
      },
      data: payload,
    };
    if (Object.keys(select).length > 0) {
      queryObj['select'] = select;
    }
    return await this.prismaService.user.update(queryObj);
  }

  /**
   * @description
   * Function to delete existing record
   */
  async deleteOne(where: any) {
    return await this.prismaService.user.delete({
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }
  /**
   * @description
   * Function to count by condition
   */ 
  async count(where: any) {
    return await this.prismaService.user.count({
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }
}
