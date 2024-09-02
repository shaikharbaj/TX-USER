/**
 * @fileoverview
 * Auth repository file to handle all auth table operations
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
  PaginatedResult,
  PaginateFunction,
  paginator,
} from 'src/modules/prisma/paginator';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class AuthRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any, relation: any = {}) {
    return await this.prismaService.auth.findFirst({
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
    return await this.prismaService.auth.create({ data: payload });
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
    return await this.prismaService.auth.update(queryObj);
  }
}
