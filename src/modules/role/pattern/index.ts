export const ROLE_PATTERN: any = {
  TCP: {
    fetchAllRole: {
      role: 'fetchAllRole',
      cmd: 'fetch-all-role'
    },
    fetchAllRoleForDropdown: {
      role: 'fetchAllRoleForDropdown',
      cmd: 'fetch-all-role-for-dropdown'
    },
    findRoleById: {
      role: 'findRoleById',
      cmd: 'find-role-by-id'
    },
    createRole: {
      role: 'createRole',
      cmd: 'create-role'
    },
    updateRole: {
      role: 'updateRole',
      cmd: 'update-role'
    },
    deleteRole: {
      role: 'deleteRole',
      cmd: 'delete-role'
    },
    toggleRoleVisibility: {
      role: 'toggleRoleVisibility',
      cmd: 'toggle-role-visibility'
    },
    attachPermissionsToRole: {
      role: 'attachPermissionsToRole',
      cmd: 'attach-permissions-to-role'
    },
    fetchRolesPermissions: {
      role: 'fetchRolesPermissions',
      cmd: 'fetch-roles-permissions'
    },
    fetchAllRolesMeta: {
      role: 'fetchAllRolesMeta',
      cmd: 'fetch-all-roles-meta'
    },
    fetchAllRolesDeleted: {
      role: 'fetchAllRolesDeleted',
      cmd: 'fetch-all-roles-deleted'
    },
    restoreRoleById: {
      role: 'restoreRoleById',
      cmd: 'restore-role-by-id'
    },
  },
  KAFKA: {
    fetchAllRole: 'fetchAllRole',
    fetchAllRoleForDropdown: 'fetchAllRoleForDropdown',
    findRoleById: 'findRoleById',
    createRole: 'createRole',
    updateRole: 'updateRole',
    deleteRole: 'deleteRole',
    toggleRoleVisibility: 'toggleRoleVisibility',
    attachPermissionsToRole: 'attachPermissionsToRole',
    fetchRolesPermissions: 'fetchRolesPermissions',
    fetchAllRolesMeta: 'fetchAllRolesMeta',
    fetchAllRolesDeleted: 'fetchAllRolesDeleted',
    restoreRoleById: 'restoreRoleById',
  },
  REDIS: [],
  RABBITMQ: [],
};
