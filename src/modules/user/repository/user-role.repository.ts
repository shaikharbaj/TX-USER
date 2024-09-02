/**
 * @fileoverview
 * User role repository file to handle all user role table operations
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
import { PaginateFunction, paginator } from 'src/modules/prisma/paginator';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class UserRoleRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any, relation: any = {}) {
    return await this.prismaService.userRole.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition with pagination
   */
  async findManyWithPaginate(select: {}, where: any, page: number = 1) {
    return await paginate(
      this.prismaService.userRole,
      {
        select: select,
        where: where,
      },
      { page },
    );
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any) {
    return await this.prismaService.userRole.findMany({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return await this.prismaService.userRole.create({ data: payload });
  }

  /**
   * @description
   * Function to save record
   */
  async createMany(payload: any) {
    return await this.prismaService.userRole.createMany({ data: payload });
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any, select: any = {}) {
    const queryObj = {
      where: where,
      data: payload,
    };
    if (Object.keys(select).length > 0) {
      queryObj['select'] = select;
    }
    return await this.prismaService.userRole.update(queryObj);
  }

  /**
   * @description
   * Function to delete existing record
   */
  async delete(where: any) {
    return await this.prismaService.userRole.delete({
      where: where,
    });
  }

  /**
   * @description
   * Function to delete existing record
   */
  async deleteMany(where: any) {
    return await this.prismaService.userRole.deleteMany({ where: where });
  }

  /**
   * @description
   * Function to count by condition
   */
  async count(where: any) {
    return await this.prismaService.userRole.count({
      where: where,
    });
  }
}
