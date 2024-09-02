/**
 * @fileoverview
 * userDocumentss repository file to handle all user table operations
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
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class UserDocumentRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any, relation: any = {}) {
    return await this.prismaService.userDocuments.findFirst({
      select: select,
      where: {
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return await this.prismaService.userDocuments.create({ data: payload });
  }

  async deleteOne(where: any) {
    return await this.prismaService.userDocuments.delete({
      where: {
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any) {
    return await this.prismaService.userDocuments.update({
      where: where,
      data: payload,
    });
  }

   /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
   async findMany(select: any, where: any) {
    return await this.prismaService.userDocuments.findMany({
      select: select,
      where: {
        ...where,
      },
    });
  }
}
