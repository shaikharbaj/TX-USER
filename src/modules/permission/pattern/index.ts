export const PERMISSION_PATTERN: any = {
  TCP: {
    fetchAllPermissions: {
      role: 'fetchAllPermissions',
      cmd: 'fetch-all-permissions'
    },
    findPermissionsById: {
      role: 'findPermissionsById',
      cmd: 'find-permissions-by-id'
    },
    createPermissions: {
      role: 'createPermissions',
      cmd: 'create-permissions'
    },
    updatePermissions: {
      role: 'updatePermissions',
      cmd: 'update-permissions'
    },
    deletePermissions: {
      role: 'deletePermissions',
      cmd: 'delete-permissions'
    },
  },
  KAFKA: {
    fetchAllPermissions: 'fetchAllPermissions',
    findPermissionsById: 'findPermissionsById',
    createPermissions: 'createPermissions',
    updatePermissions: 'updatePermissions',
    deletePermissions: 'deletePermissions',
  },
  REDIS: [],
  RABBITMQ: [],
};
