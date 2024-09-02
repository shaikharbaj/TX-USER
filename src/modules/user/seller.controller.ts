/**
 * @fileoverview
 * Seller controller file to handle all seller user related message pattern.
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
import { MS_CONFIG } from "ms.config";
import {
  Auth,
  Data,
  Id,
  Uuid,
  Page,
  File,
  QueryString,
  PageSize,
  Files,
} from "src/common/decorators";
import { SELLER_PATTERN } from "./pattern";
import { SellerService } from "./seller.service";
import {
  CreateUpdateSellerBankDetailsDto,
  CreateUpdateSellerBasicDetailsDto,
  CreateUpdateSellerDocumentsDto,
  CreateUpdateSellerVerificationDto,
} from "./dto";

@Controller()
export class SellerController {
  constructor(private readonly sellerService: SellerService) { }

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
   * Message pattern handler to fetch all seller
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchAllSeller)
  async fetchAllSeller(
    @PageSize() page_size: number,
    @Page() page: number,
    @QueryString() { searchText, is_active, sortColumn, sortBy }: any
  ) {
    try {
      return await this.sellerService.fetchAllSeller(
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
   * Message pattern handler to fetch particular seller with given condition
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].findSellerForLogin)
  async findSellerForLogin(@Data() data: any) {
    try {
      return await this.sellerService.findSellerForLogin(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular seller with given condition
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].findSellerForRegistration)
  async findSellerForRegistration(@Data() data: any) {
    try {
      return await this.sellerService.findSellerForRegistration(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular seller with given condition
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].createSeller)
  async createSeller(@Data() data: any) {
    try {
      return await this.sellerService.createSeller(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch seller profile
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchSellerProfile)
  async fetchSellerProfile(@Auth() auth: any) {
    try {
      return await this.sellerService.fetchSellerProfile(auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch basic details
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchBasicDetails)
  async fetchBasicDetails(@Auth() auth: any) {
    try {
      return await this.sellerService.fetchBasicDetails(auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create and update seller basic details
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].createUpdateBasicDetails)
  async createUpdateBasicDetails(
    @Auth() auth: any,
    @Data() data: CreateUpdateSellerBasicDetailsDto
  ) {
    try {
      return await this.sellerService.createUpdateBasicDetails(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch bank details
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchBankDetails)
  async fetchBankDetails(@Auth() auth: any) {
    try {
      return await this.sellerService.fetchBankDetails(auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create and update seller bank details
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].createUpdateBankDetails)
  async createUpdateBankDetails(
    @Auth() auth: any,
    @Data() data: CreateUpdateSellerBankDetailsDto
  ) {
    try {
      return await this.sellerService.createUpdateBankDetails(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch verification details
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchVerificationDetails)
  async fetchVerificationDetails(@Auth() auth: any) {
    try {
      return await this.sellerService.fetchVerificationDetails(auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create and update seller verification
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].createUpdateVerification)
  async createUpdateVerification(
    @Auth() auth: any,
    @File() file: any,
    @Data() data: CreateUpdateSellerVerificationDto
  ) {
    try {
      return await this.sellerService.createUpdateVerification(
        auth,
        file,
        data
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch documents details
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchDocumentsDetails)
  async fetchDocumentsDetails(@Auth() auth: any) {
    try {
      return await this.sellerService.fetchDocumentsDetails(auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create and update seller documents
   */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].createUpdateDocuments)
  async createUpdateDocuments(
    @Auth() auth: any,
    @Files() files: any,
    @Data() data: CreateUpdateSellerDocumentsDto
  ) {
    try {
      return await this.sellerService.createUpdateDocuments(auth, files, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler fetch seller basic details by id.
   * */
  @MessagePattern(
    SELLER_PATTERN[MS_CONFIG.transport].fetchSellerBasicDetailsById
  )
  async fetchSellerBasicDetailsById(@Uuid() uuid: string) {
    try {
      return await this.sellerService.fetchSellerBasicDetailsById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler fetch financier basic details by id.
   * */
  @MessagePattern(
    SELLER_PATTERN[MS_CONFIG.transport].fetchSellerBankDetailsById
  )
  async fetchSellerBankDetailsById(@Uuid() uuid: string) {
    try {
      return await this.sellerService.fetchSellerBankDetailsById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler fetch financier verification details by id.
   * */
  @MessagePattern(
    SELLER_PATTERN[MS_CONFIG.transport].fetchSellerVerificationById
  )
  async fetchSellerVerificationById(@Uuid() uuid: string) {
    try {
      return await this.sellerService.fetchSellerVerificationById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler fetch seller documents details by id.
   * */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchSellerDocumentsById)
  async fetchSellerDocumentsById(@Uuid() uuid: string) {
    try {
      return await this.sellerService.fetchSellerDocumentsById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler fetch seller product category.
   * */
  @MessagePattern(SELLER_PATTERN[MS_CONFIG.transport].fetchSellerProductCategories)
  async fetchSellerProductCategories(@Id() id: number) {
    try {
      return await this.sellerService.fetchSellerProductCategories(id);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
