/**
 * @fileoverview
 * Permission controller file to handle all permission related message pattern.
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
import { BadGatewayException, BadRequestException, ConflictException, Controller, ForbiddenException, GatewayTimeoutException, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { PermissionService } from './permission.service';
import { Auth, Data, Id, Page } from 'src/common/decorators';
import { PERMISSION_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';

@Controller()
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

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

  @MessagePattern(PERMISSION_PATTERN[MS_CONFIG.transport].fetchAllPermissions)
  fetchAllPermissions() {
    try {
      return this.permissionService.fetchAllPermissions();
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  @MessagePattern(PERMISSION_PATTERN[MS_CONFIG.transport].findPermissionsById)
  findPermissionsById(@Id() id: number) {
    try {
      return this.permissionService.findPermissionsById(id);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  @MessagePattern(PERMISSION_PATTERN[MS_CONFIG.transport].createPermissions)
  createPermissions(@Auth() auth: any, @Data() data: any) {
    try {
      return this.permissionService.createPermissions(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  @MessagePattern(PERMISSION_PATTERN[MS_CONFIG.transport].updatePermissions)
  updatePermissions(@Auth() auth: any, @Id() id: number, @Data() data: any) {
    try {
      return this.permissionService.updatePermissions(auth, id, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  @MessagePattern(PERMISSION_PATTERN[MS_CONFIG.transport].deletePermissions)
  deletePermissions(@Auth() auth: any, @Id() id: number) {
    try {
      return this.permissionService.deletePermissions(auth, id);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
