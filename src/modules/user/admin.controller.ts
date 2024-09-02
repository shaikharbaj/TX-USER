/**
 * @fileoverview
 * Admin controller file to handle all admin user related message pattern.
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
import { AdminService } from "./admin.service";
import { MS_CONFIG } from "ms.config";
import { ADMIN_PATTERN } from "./pattern";
import {
  Auth,
  Data,
  Id,
  Uuid,
  Page,
  File,
  QueryString,
  PageSize,
} from "src/common/decorators";
import {
  CreateAdminUserDto,
  ToggleAdminUserVisibilityDto,
  UpdateAdminUserDto,
  UpdateBankingInfoStatusDto,
  UpdateBasicInfoStatusDto,
  UpdateDocumentStatusDto,
  UpdateVerificationStatusDto,
} from "./dto";
import { UpdateAdminUserPasswordDto } from "./dto/update-admin-user-password.dto";

@Controller()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
   * Message pattern handler to fetch particular admin user with given condition
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].findAdminUserForLogin)
  async findAdminUserForLogin(@Data() data: any) {
    try {
      return await this.adminService.findAdminUserForLogin(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all admin user
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].fetchAllAdminUser)
  async fetchAllAdminUser(
    @PageSize() page_size: number,
    @Page() page: number,
    @QueryString() { searchText, is_active, sortColumn, sortBy }: any
  ) {
    try {
      return await this.adminService.fetchAllAdminUser(
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
   * Message pattern handler to fetchAll deleted admin user information
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].fetchAllDeletedAdminUser)
  async fetchAllDeletedAdminUser(
    @PageSize() page_size: number,
    @Page() page: number,
    @QueryString() { searchText }: any
  ) {
    try {
      return await this.adminService.fetchAllDeletedAdminUser(
        page_size,
        page,
        searchText
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll admin user information for dropdown
   */
  @MessagePattern(
    ADMIN_PATTERN[MS_CONFIG.transport].fetchAllAdminUserForDropdown
  )
  async fetchAllAdminUserForDropdown() {
    try {
      return await this.adminService.fetchAllAdminUserForDropdown();
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch admin user by id
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].findAdminUserById)
  async findAdminUserById(@Uuid() uuid: string) {
    try {
      return await this.adminService.findAdminUserById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create admin user
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].createAdminUser)
  async createAdminUser(@Auth() auth: any, @Data() data: CreateAdminUserDto) {
    try {
      return await this.adminService.createAdminUser(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to admin user visibility i.e: active,inactive
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].toggleAdminUserVisibility)
  async toggleAdminUserVisibility(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: ToggleAdminUserVisibilityDto
  ) {
    try {
      return await this.adminService.toggleAdminUserVisibility(
        uuid,
        auth,
        data
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update admin user
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].updateAdminUser)
  async updateAdminUser(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateAdminUserDto
  ) {
    try {
      return await this.adminService.updateAdminUser(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete admin user
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].deleteAdminUser)
  async deleteAdminUser(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.adminService.deleteAdminUser(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted admin user
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].restoreAdminUser)
  async restoreAdminUser(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.adminService.restoreAdminUser(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch admin user profile
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].findAdminUserProfile)
  async findAdminProfile(@Auth() auth: any) {
    try {
      return await this.adminService.fetchAdminUserProfile(auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update admin user password
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].updateAdminUserPassword)
  async updateAdminUserPassword(
    @Auth() auth: any,
    @Data() data: UpdateAdminUserPasswordDto
  ) {
    try {
      return await this.adminService.updateAdminUserPassword(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update onboarding basic information status
   */
  @MessagePattern(
    ADMIN_PATTERN[MS_CONFIG.transport].updateBasicInformationStatus
  )
  async updateBasicInformationStatus(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateBasicInfoStatusDto
  ) {
    try {
      return await this.adminService.updateBasicInformationStatus(
        uuid,
        auth,
        data
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update onboarding bank information status
   */
  @MessagePattern(
    ADMIN_PATTERN[MS_CONFIG.transport].updateBankingInformationStatus
  )
  async updateBankingInformationStatus(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateBankingInfoStatusDto
  ) {
    try {
      return await this.adminService.updateBankingInformationStatus(
        uuid,
        auth,
        data
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update onboarding verification status
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].updateVerificationStatus)
  async updateVerificationStatus(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateVerificationStatusDto
  ) {
    try {
      return await this.adminService.updateVerificationStatus(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update onboarding document status
   */
  @MessagePattern(ADMIN_PATTERN[MS_CONFIG.transport].updateDocumentStatus)
  async updateDocumentStatus(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateDocumentStatusDto
  ) {
    try {
      return await this.adminService.updateVerificationStatus(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler fetch admin user basic details by id.
   * */
  @MessagePattern(
    ADMIN_PATTERN[MS_CONFIG.transport].fetchAdminUserBasicDetailsById
  )
  async fetchAdminUserBasicDetailsById(@Uuid() uuid: string) {
    try {
      return await this.adminService.fetchAdminUserBasicDetailsById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
