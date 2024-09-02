/**
 * @fileoverview
 * Financier controller file to handle all financier related message pattern.
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
import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  GatewayTimeoutException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";
import { MessagePattern, RpcException } from "@nestjs/microservices";
import { FinancierService } from "./financier.service";
import { MS_CONFIG } from "ms.config";
import { FINANCIER_PATTERN } from "./pattern";
import { Page, QueryString, PageSize, Uuid } from "src/common/decorators";

@Controller()
export class FinancierController {
  constructor(private readonly financierService: FinancierService) {}

  /**
   * @description
   * Message format exception
   */
  exceptionHandler(error: any) {
    if (error instanceof BadRequestException) {
      return new RpcException({
        statusCode: 400,
        message: error.message,
      });
    } else if (error instanceof UnauthorizedException) {
      return new RpcException({
        statusCode: 401,
        message: error.message,
      });
    } else if (error instanceof ForbiddenException) {
      return new RpcException({
        statusCode: 403,
        message: error.message,
      });
    } else if (error instanceof NotFoundException) {
      return new RpcException({
        statusCode: 404,
        message: error.message,
      });
    } else if (error instanceof ConflictException) {
      return new RpcException({
        statusCode: 409,
        message: error.message,
      });
    } else if (error instanceof BadGatewayException) {
      return new RpcException({
        statusCode: 502,
        message: error.message,
      });
    } else if (error instanceof ServiceUnavailableException) {
      return new RpcException({
        statusCode: 503,
        message: error.message,
      });
    } else if (error instanceof GatewayTimeoutException) {
      return new RpcException({
        statusCode: 504,
        message: error.message,
      });
    } else {
      return new RpcException({
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all financier
   */
  @MessagePattern(FINANCIER_PATTERN[MS_CONFIG.transport].fetchAllFinanciers)
  async fetchAllFinancier(
    @PageSize() page_size: number,
    @Page() page: number,
    @QueryString() { searchText, is_active, sortColumn, sortBy }: any
  ) {
    try {
      return await this.financierService.fetchAllFinancier(
        page_size,
        page,
        searchText,
        is_active,
        sortColumn,
        sortBy
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

   /**
   * @description
   * Message pattern handler fetch financier basic details by id.
   * */
   @MessagePattern(
    FINANCIER_PATTERN[MS_CONFIG.transport].fetchFinancierBasicDetailsById
  )
  async fetchFinancierBasicDetailsById(@Uuid() uuid: string) {
    try {
      return await this.financierService.fetchFinancierBasicDetailsById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }


}
