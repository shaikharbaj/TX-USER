/**
 * @fileoverview
 * Role service file to handle all role related functionality.
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
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";
import { RoleRepository, RolePermissionRepository } from "./repository";
import { PermissionRepository } from "../permission/repository";
import { CommonHelper } from "src/common/helpers";

@Injectable()
export class RoleService {
  constructor(
    private readonly i18n: I18nService,
    private roleRepository: RoleRepository,
    private rolePermissionRepository: RolePermissionRepository,
    private permissionRepository: PermissionRepository,
    private commonHelper: CommonHelper
  ) {}

  //Function to get current language
  public getLang(): string {
    const currentLang = I18nContext.current()?.lang;
    return currentLang ? currentLang : "en";
  }
  /**
   * @description
   * Function to find roles by given condition
   */
  async fetchRolesByCondition(select: any, condition: any) {
    return this.roleRepository.findMany(select, condition);
  }

  /**
   * @description
   * Function to find all roles
   */
  async fetchAllRole(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const roleCondition = {
        select: {
          uuid: true,
          role_name: true,
          slug: true,
          description: true,
          is_active: true,
        },
        where: {},
      };
      if (searchText) {
        roleCondition["where"]["OR"] = [
          {
            role_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        ];
      }
      const roles = await this.roleRepository.findManyWithPaginate(
        roleCondition.select,
        roleCondition.where,
        page
      );
      return {
        status: true,
        message: this.i18n.t("role._role_fetch_successfully_", { lang }),
        data: roles,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description
   * Function to find all deleted roles
   */
  async fetchAllRolesDeleted(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const roleCondition = {
        select: {
          uuid: true,
          role_name: true,
          slug: true,
          description: true,
          is_active: true,
        },
        where: {},
      };
      if (searchText) {
        roleCondition["where"]["OR"] = [
          {
            role_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        ];
      }
      const roles = await this.roleRepository.findManyDeletedWithPaginate(
        roleCondition.select,
        roleCondition.where,
        page
      );
      return {
        status: true,
        message: this.i18n.t("role._role_fetch_successfully_", { lang }),
        data: roles,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
   * @description
   * Function to find all roles for dropdown
   */
  async fetchAllRoleForDropdown() {
    try {
      const lang = this.getLang();
      const roles = await this.roleRepository.findMany(
        {
          uuid: true,
          role_name: true,
          slug: true,
        },
        {
          is_active: true,
        }
      );
      return {
        status: true,
        message: this.i18n.t("role._role_fetch_successfully_", { lang }),
        data: roles,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all active roles Obj
   */
  async fetchAllRolesMeta() {
    try {
      const lang = this.getLang();
      const condition = {
        select: {
          uuid: true,
          role_name: true,
          slug: true,
          description: true,
        },
        where: {
          is_active: true,
        },
      };
      const roles: any = await this.roleRepository.findMany(
        condition.select,
        condition.where
      );
      if (roles.length === 0) {
        throw new NotFoundException(
          this.i18n.t("role._no_data_found_", { lang })
        );
      }
      // Creating rolesObj
      const rolesObj = roles.reduce((acc: any[], role: any) => {
        acc[role.uuid] = role;
        return acc;
      }, {});

      return {
        status: true,
        message: this.i18n.t("role._role_fetch_successfully_", { lang }),
        data: { rolesObj },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to find particular role of given id
   */
  async findRoleById(uuid: string) {
    try {
      const lang = this.getLang();
      const query = {
        select: {
          uuid: true,
          role_name: true,
          slug: true,
          description: true,
          is_active: true,
          role_permissions: {
            select: {
              id: true,
              permission_id: true,
              permission: {
                select: {
                  id: true,
                  permissions_name: true,
                  slug: true,
                  description: true,
                  is_active: true,
                },
              },
            },
          },
        },
        where: {
          uuid: uuid,
        },
      };
      const role = await this.roleRepository.findOne(query.select, query.where);
      if (!role) {
        throw new NotFoundException(
          this.i18n.t("role._role_information_not_found_", { lang })
        );
      }
      return {
        status: true,
        message: this.i18n.t("role._role_fetch_successfully_", { lang }),
        data: role,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create role
   */
  async createRole(auth: any, payload: any) {
    try {
      const lang = this.getLang();
      //Checking role already exist
      const roleCondition = {
        select: {
          uuid: true,
          role_name: true,
          slug: true,
          is_deleted: true,
        },
        where: {
          OR: [{ role_name: payload.role_name }, { slug: payload.slug }],
        },
      };
      const role: any = await this.roleRepository.findOneWithoutDelete(
        roleCondition.select,
        roleCondition.where
      );
      if (role && role.is_deleted === false) {
        throw new ConflictException(
          this.i18n.t("role._role_with_same_name_or_slug_already_exist_", {
            lang,
          })
        );
      }
      //Preparing role payload
      const rolePayload = {
        create: {
          role_name: payload.role_name,
          slug: payload.slug,
          description: payload.description,
          is_active: payload?.is_active === true ? true : false,
          created_by: auth?.id,
        },
        update: {
          description: payload.description,
          is_active: payload?.is_active === true ? true : false,
          updated_by: auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          slug: payload.slug,
        },
      };
      const createdRole = await this.roleRepository.upsert(
        rolePayload.create,
        rolePayload.update,
        rolePayload.where
      );
      if (createdRole) {
        //Once role created attaching permission
        if (payload.permissions) {
          const permissionPayload = {
            role_id: createdRole.id,
            permissions: payload.permissions,
          };
          await this.attachPermissionsToRole(auth, permissionPayload);
        }
        return {
          status: true,
          message: this.i18n.t("role._role_created_successfully_", { lang }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("role._error_while_creating_role_", { lang })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle role visibility
   */
  async toggleRoleVisibility(auth: any, uuid: string, payload: any) {
    try {
      const lang = this.getLang();
      //Checking role information exists or not
      const roleCondition = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const role = await this.roleRepository.findOne(
        roleCondition.select,
        roleCondition.where
      );
      if (!role) {
        throw new NotFoundException(
          this.i18n.t("role._role_information_not_found_", { lang })
        );
      }
      const rolePayload = {
        is_active: payload.is_active,
        updated_by: auth.id,
      };
      this.roleRepository.update({ id: role.id }, rolePayload);
      return {
        status: true,
        message: this.i18n.t("role._role_visibility_updated_successfully_", {
          lang,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update existing role
   */
  async updateRole(auth: any, uuid: string, payload: any) {
    try {
      const lang = this.getLang();
      //Checking role information exists or not
      const roleCondition = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const role = await this.roleRepository.findOne(
        roleCondition.select,
        roleCondition.where
      );
      if (!role) {
        throw new NotFoundException(
          this.i18n.t("role._role_information_not_found_", { lang })
        );
      }
      //Checking role already exist
      const anotherRoleWithSameNameAndSlug = await this.roleRepository.findOne(
        { id: true, role_name: true, slug: true },
        {
          OR: [{ role_name: payload.role_name }, { slug: payload.slug }],
          NOT: { id: role.id },
        }
      );
      if (anotherRoleWithSameNameAndSlug) {
        throw new ConflictException(
          this.i18n.t("role._role_with_same_name_or_slug_already_exist_", {
            lang,
          })
        );
      }
      //Preparing role payload
      const rolePayload = {
        role_name: payload.role_name,
        slug: payload.slug,
        description: payload.description,
        is_active: payload?.is_active === true ? true : false,
        updated_by: auth.id,
      };
      const updatedRole = await this.roleRepository.update(
        { id: role.id },
        rolePayload
      );
      if (updatedRole) {
        //Once role created attaching permission
        if (payload.permissions) {
          const permissionPayload = {
            role_id: updatedRole.id,
            permissions: payload.permissions,
          };
          await this.attachPermissionsToRole(auth, permissionPayload);
        }
        return {
          status: true,
          message: this.i18n.t("role._role_updated_successfully_", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("role._error_while_updating_role_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete existing role
   */
  async deleteRole(auth: any, uuid: string) {
    try {
      const lang = this.getLang();
      //Checking role information exists or not
      const roleCondition = {
        select: {
          uuid: true,
          role_name: true,
          slug: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const role = await this.roleRepository.findOne(
        roleCondition.select,
        roleCondition.where
      );
      if (!role) {
        throw new NotFoundException(
          this.i18n.t("role._role_information_not_found_", { lang })
        );
      }
      const rolePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedRole = await this.roleRepository.update(
        { uuid: uuid },
        rolePayload
      );
      if (deletedRole) {
        return {
          status: true,
          message: this.i18n.t("role._role_deleted_successfully_", { lang }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("role._error_while_deleting_role_", { lang })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore particular role of given id
   */
  async restoreRoleById(uuid: string) {
    try {
      const lang = this.getLang();
      //Checking role information exists or not
      const roleExist = await this.roleRepository.findOneWithoutDelete(
        { id: true, role_name: true, slug: true },
        { uuid: uuid, is_deleted: true }
      );
      if (!roleExist) {
        throw new NotFoundException(
          this.i18n.t("role._role_information_not_found_", { lang })
        );
      }
      const rolePayload = {
        is_active: true,
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
      };
      const restoredRole = await this.roleRepository.updateWithOutDeleted(
        { uuid: uuid },
        rolePayload
      );
      if (restoredRole) {
        return {
          status: true,
          message: this.i18n.t("role._role_restored_successfully_", { lang }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("role._error_while_restoring_role_", { lang })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to attach permissions to particular role
   */
  async attachPermissionsToRole(auth: any, payload: any) {
    try {
      const lang = this.getLang();
      const permissionArr = JSON.parse(payload.permissions);
      if (permissionArr.length === 0) {
        return {
          status: false,
          message: this.i18n.t("role._please_provide_valid_permission_", {
            lang,
          }),
        };
      }
      const rolePermissions = [];
      permissionArr.forEach((permission: number, permissionIndex: number) => {
        rolePermissions.push({
          role_id: payload.role_id,
          permission_id: permission,
          created_by: auth.id,
        });
      });
      await this.rolePermissionRepository.deattachPermissions({
        role_id: payload.role_id,
      });
      await this.rolePermissionRepository.attachPermissions(rolePermissions);
      return {
        status: true,
        message: this.i18n.t("role._permission_attach_to_role_successfully_", {
          lang,
        }),
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the permissions of requested roles by role ids
   */
  async fetchRolesPermissions(roleIds: any) {
    try {
      const lang = this.getLang();
      const parsedRoleIds = roleIds
        .split(",")
        .map((id: string) => parseInt(id, 10));
      //Role permission condition
      const rolePermissionCondition = {
        select: {
          role_id: true,
          permission_id: true,
        },
        where: {
          role_id: {
            in: parsedRoleIds,
          },
        },
      };
      const rolePermisisions = await this.rolePermissionRepository.findMany(
        rolePermissionCondition.select,
        rolePermissionCondition.where
      );
      if (rolePermisisions.length === 0) {
        return {
          status: false,
          message: this.i18n.t("role._role_permission_not_found_", { lang }),
        };
      }
      const permisisionIds = this.commonHelper.pluck(
        rolePermisisions,
        "permission_id"
      );
      //Preparing permission condition
      const permissionCondition = {
        select: {
          id: true,
          permissions_name: true,
          slug: true,
          description: true,
          module: true,
          is_active: true,
        },
        where: {
          id: {
            in: permisisionIds,
          },
        },
      };
      const permissions = await this.permissionRepository.findMany(
        permissionCondition.select,
        permissionCondition.where
      );
      const groupedPermission = this.commonHelper.groupArray(
        permissions,
        "module"
      );
      return {
        status: true,
        message: this.i18n.t("role._role_permission_fetch_successfully_", {
          lang,
        }),
        data: groupedPermission,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to verify whether specified roles has particular permission or not
   */
  async verifyRolePermission(roleIds: any, permissionId: number) {
    const rolePermissionCondition = {
      select: {
        id: true,
        permission_id: true,
        role_id: true,
      },
      where: {
        role_id: { in: roleIds },
        permission_id: permissionId,
      },
    };
    const rolePermission = await this.rolePermissionRepository.findOne(
      rolePermissionCondition.select,
      rolePermissionCondition.where
    );
    if (rolePermission) {
      return true;
    }
    return false;
  }
}
