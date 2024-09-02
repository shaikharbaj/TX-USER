/**
 * @fileoverview
 * User Address controller file to handle all address related message pattern.
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
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Auth, Data, Id, Page, QueryString, Uuid } from 'src/common/decorators';
import { MS_CONFIG } from 'ms.config';
import { USER_ADDRESS_PATTERN } from './pattern';
import { UserAddressService } from './user-address.service';
import { CreateAddressDto, ToggleAddressDefaultDto, UpdateAddressDto } from './dto';

@Controller()
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) { }

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
        message: 'Internal server error',
      });
    }
  }

  /**
* @description
* Message pattern handler to fetch all address
*/
  @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].fetchAllAddress)
  async fetchAllAddress(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.userAddressService.fetchAllAddress(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
 * @description
 * Message pattern handler to fetch particular address with given id
 */
  @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].findAddressById)
  async findAddressById(@Uuid() uuid: string) {    
    try {
      return await this.userAddressService.findAddressById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create address
   */
  @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].createAddress)
  async createAddress(@Auth() auth: any, @Data() data: CreateAddressDto) {
    try {
      return await this.userAddressService.createAddress(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
 * @description
 * Message pattern handler to toggle address default
 */
  @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].toggleAddressDefault)
  async toggleAddressDefault(
    @Auth() auth: any,
    @Uuid() uuid: string,
    @Data() data: ToggleAddressDefaultDto,
  ) {    
    try {
      return await this.userAddressService.toggleAddressDefault(auth, uuid, data);
    } catch (error) {      
      throw this.exceptionHandler(error);
    }
  }

  /**
* @description
* Message pattern handler to update existing address
*/
  @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].updateAddress)
  async updateAddress(
    @Auth() auth: any,
    @Uuid() uuid: string,
    @Data() data: UpdateAddressDto,
  ) {
    try {
      return await this.userAddressService.updateAddress(auth, uuid, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
 * @description
 * Message pattern handler to delete existing address
 */
  @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].deleteAddress)
  async deleteAddress(@Auth() auth: any, @Uuid() uuid: string) {
    try {
      return await this.userAddressService.deleteAddress(auth, uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
* @description
* Message pattern handler to fetch all deleted roles
*/
  @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].fetchAllAddressDeleted)
  async fetchAllAddressDeleted(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.userAddressService.fetchAllAddressDeleted(
        page,
        searchText
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

    /**
   * @description
   * Message pattern handler to restore particular address with given id
   */
    @MessagePattern(USER_ADDRESS_PATTERN[MS_CONFIG.transport].restoreAddressById)
    async restoreAddressById(@Uuid() uuid: string) {
      try {
        return await this.userAddressService.restoreAddressById(uuid);
      } catch (error) {
        throw this.exceptionHandler(error);
      }
    }
}