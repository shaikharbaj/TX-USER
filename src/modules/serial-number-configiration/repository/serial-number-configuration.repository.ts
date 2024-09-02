/**
 * @fileoverview
 * Serial Number Configuration repository file to handle all serail number table operations
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
export class SerialNumberConfigurationRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any, relation: any = {}) {
    return await this.prismaService.serialNumberConfiguration.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any) {
    const queryObj = {
      where: where,
      data: payload,
    };
    return await this.prismaService.serialNumberConfiguration.update(queryObj);
  }
}
