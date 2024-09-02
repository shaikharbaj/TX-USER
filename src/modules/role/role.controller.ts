/**
 * @fileoverview
 * Role controller file to handle all role related message pattern.
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
import { RoleService } from './role.service';
import { Auth, Data, Id, Uuid, Page, QueryString } from 'src/common/decorators';
import { ROLE_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import {
  AttachPermissionDto,
  CreateRoleDto,
  FetchRolesPermissionsDto,
  ToggleRoleVisibilityDto,
  UpdateRoleDto,
} from './dto';

@Controller()
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

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
   * Message pattern handler to fetch all roles
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].fetchAllRole)
  async fetchAllRole(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.roleService.fetchAllRole(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all deleted roles
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].fetchAllRolesDeleted)
  async fetchAllRolesDeleted(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.roleService.fetchAllRolesDeleted(
        page,
        searchText
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all roles for dropdown
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].fetchAllRoleForDropdown)
  async fetchAllRoleForDropdown() {
    try {
      return await this.roleService.fetchAllRoleForDropdown();
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all active sellers
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].fetchAllRolesMeta)
  async fetchAllRolesMeta() {
    try {
      return await this.roleService.fetchAllRolesMeta();
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch particular role with given id
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].findRoleById)
  async findRoleById(@Uuid() uuid: string) {
    try {
      return await this.roleService.findRoleById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create role
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].createRole)
  async createRole(@Auth() auth: any, @Data() data: CreateRoleDto) {
    try {
      return await this.roleService.createRole(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to toggle role visibility
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].toggleRoleVisibility)
  async toggleRoleVisibility(
    @Auth() auth: any,
    @Uuid() uuid: string,
    @Data() data: ToggleRoleVisibilityDto,
  ) {
    try {
      return await this.roleService.toggleRoleVisibility(auth, uuid, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update existing role
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].updateRole)
  async updateRole(
    @Auth() auth: any,
    @Uuid() uuid: string,
    @Data() data: UpdateRoleDto,
  ) {
    try {
      return await this.roleService.updateRole(auth, uuid, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete existing role
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].deleteRole)
  async deleteRole(@Auth() auth: any, @Uuid() uuid: string) {
    try {
      return await this.roleService.deleteRole(auth, uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore particular role with given id
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].restoreRoleById)
  async restoreRoleById(@Uuid() uuid: string) {
    try {
      return await this.roleService.restoreRoleById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to attach permissions to role
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].attachPermissionsToRole)
  async attachPermissionsToRole(
    @Auth() auth: any,
    @Data() data: AttachPermissionDto,
  ) {
    try {
      return await this.roleService.attachPermissionsToRole(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch permissions of requested roles
   */
  @MessagePattern(ROLE_PATTERN[MS_CONFIG.transport].fetchRolesPermissions)
  async fetchRolesPermissions(@QueryString() { roleIds }: any,) {
    try {
      return await this.roleService.fetchRolesPermissions(roleIds);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
