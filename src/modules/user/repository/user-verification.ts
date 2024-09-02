/**
 * @fileoverview
 * userVerifications repository file to handle all user table operations
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
export class UserVerificationRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any, relation: any = {}) {
    return await this.prismaService.userVerification.findFirst({
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
    return await this.prismaService.userVerification.create({ data: payload });
  }

  async deleteOne(where: any) {
    return await this.prismaService.userVerification.delete({
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
    return await this.prismaService.userVerification.update({
      where: where,
      data: payload,
    });
  }
}
