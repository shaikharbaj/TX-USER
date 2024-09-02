/**
 * @fileoverview
 * User controller file to handle all user related message pattern.
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
import { UserService } from "./user.service";
import { MS_CONFIG } from "ms.config";
import { USER_PATTERN } from "./pattern";
import {
  Auth,
  Data,
  Id,
  Page,
  File,
  QueryString,
  PageSize,
  Uuid,
} from "src/common/decorators";
import { BuyerRegistrationDto } from "./dto/buyer-registration.dto";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

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
   * Message pattern handler to fetch particular user with given condition
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].findUserByConditionForLogin)
  async findUserByConditionForLogin(condition: any) {
    try {
      return await this.userService.findUserByConditionForLogin(condition);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular user with given condition
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].findUserByCondition)
  async findUserByCondition(condition: any) {
    try {
      return await this.userService.findUserByCondition(condition);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch seller profile
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].fetchBuyerProfile)
  async fetchBuyerProfile(@Auth() auth: any) {
    try {
      return await this.userService.fetchBuyerProfile(auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
  /**
   * @description
   * Message pattern handler to verify particular user permission
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].verifyUserPermission)
  async verifyUserPermission(@Data() data: any) {
    return await this.userService.verifyUserPermission(data);
  }

  /**
   * @description
   * Message pattern handler to check mobile number already present or not.
   */
  @MessagePattern(
    USER_PATTERN[MS_CONFIG.transport].checkMobileNumberAlreadyExist
  )
  async checkMobileNumberAlreadyExist(@Data() data: any) {
    return await this.userService.checkMobileNumberAlreadyExist(data);
  }

  /**
   * @description
   * Message pattern handler to fetch particular seller with given condition
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].createBuyer)
  async createBuyer(@Data() data: BuyerRegistrationDto) {
    try {
      return await this.userService.createBuyer(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular user with given condition
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].findBuyerForLogin)
  async findBuyerForLogin(@Data() data: any) {
    try {
      return await this.userService.findBuyerForLogin(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular user with given condition
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].findBuyerForRegistration)
  async findBuyerForRegistration(@Data() data: any) {
    try {
      return await this.userService.findBuyerForRegistration(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular user with id
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].findUserById)
  async findUserById(condition: any) {
    try {
      return await this.userService.findUserById(condition);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular buyer/customers with given condition
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].fetchAllBuyers)
  async fetchAllBuyers(
    @PageSize() page_size: number,
    @Page() page: number,
    @QueryString() { searchText, is_active, sortColumn, sortBy }: any
  ) {
    try {
      return await this.userService.fetchAllBuyers(
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
   * Message pattern handler for encryption
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].encryptData)
  async encrypt(data: any) {
    try {
      return await this.userService.encrypt(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler for decryption
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].decryptData)
  async decrypt(data: any) {
    try {
      return await this.userService.decrypt(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler for hashing
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].hashData)
  async hash(data: any) {
    try {
      return await this.userService.hash(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler for forgot password
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].forgotPassword)
  async forgotPassword(@Data() data: any) {
    try {
      return await this.userService.forgotPassword(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular user with reset token
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].fetchUserByResetToken)
  async fetchUserByResetToken(@QueryString() { token }: any) {
    try {
      return await this.userService.fetchUserByResetToken(token);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler for reset password
   */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].resetPassword)
  async resetPassword(@Data() data: any) {
    try {
      return await this.userService.resetPassword(data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
  /**
   * @description
   * Message pattern handler fetch buyer basic details by id.
   * */
  @MessagePattern(USER_PATTERN[MS_CONFIG.transport].fetchUsersBasicDetailsId)
  async fetchBuyerBasicDetailsById(@Uuid() uuid: string) {
    try {
      return await this.userService.fetchBuyerBasicDetailsById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
