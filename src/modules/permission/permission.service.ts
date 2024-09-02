import { Injectable } from '@nestjs/common';
import { PermissionRepository } from './repository';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class PermissionService {
  constructor(private permissionsRepositiory: PermissionRepository) {}

  /**
   * @description
   * Function to fetch all permissions
   */
  async fetchAllPermissions() {
    try {
      const permissions = await this.permissionsRepositiory.findMany(
        {
          id: true,
          permissions_name: true,
          slug: true,
          description: true,
          module: true,
          is_active: true,
        },
        { is_active: true },
      );
      if (permissions.length > 0) {
        // Example: Grouping by a specific field
        const groupedPermission: any = permissions.reduce((acc: any, item) => {
          const key: any = item?.module;
          acc[key] = acc[key] || [];
          // Push the current object to the array for the key
          acc[key].push(item);
          return acc;
        }, {});
        return {
          status: true,
          message: 'Permissions fetched successfully.',
          data: groupedPermission,
        };
      }
      return {
        status: true,
        message: 'No permission found.',
        data: [],
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function find particular permission
   */
  async findPermissionsById(id: number) {
    try {
      const permission = await this.permissionsRepositiory.findOne({ id: id });
      return {
        status: true,
        message: 'Permission fetched successfully.',
        data: permission,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function find particular permission
   */
  async findPermissionsBySlug(slug: string) {
    try {
      const permission = await this.permissionsRepositiory.findOne({ slug: slug });
      return {
        status: true,
        message: 'Permission fetched successfully.',
        data: permission,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create permission
   */
  async createPermissions(auth: any, payload: any) {
    try {
      const permissionPayload = {
        permissions_name: payload.name,
        slug: payload.slug,
        description: payload.description,
        module: payload.module,
        is_active: payload.is_active,
        created_by: auth.id,
      };
      await this.permissionsRepositiory.save(permissionPayload);
      return { status: true, message: 'Permission created successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function update particular permission
   */
  async updatePermissions(auth: any, id: number, payload: any) {
    try {
      const permissionPayload = {
        permissions_name: payload.name,
        slug: payload.slug,
        description: payload.description,
        module: payload.module,
        is_active: payload.is_active,
        updated_by: auth.id,
      };
      await this.permissionsRepositiory.update({ id: id }, permissionPayload);
      return { status: true, message: 'Permission updated successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function delete particular permission
   */
  async deletePermissions(auth: any, id: number) {
    try {
      const permissionPayload = {
        is_active: false,
        deleted_at: new Date(),
        deleted_by: auth.id,
      };
      await this.permissionsRepositiory.update({ id: id }, permissionPayload);
      return { status: true, message: 'Permission deleted successfully' };
    } catch (error) {
      throw error;
    }
  }
}
