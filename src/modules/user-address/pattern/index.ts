export const USER_ADDRESS_PATTERN: any = {
    TCP: {
      fetchAllAddress: {
        role: 'fetchAllAddress',
        cmd: 'fetch-all-address'
      },
      findAddressById: {
        role: 'findAddressById',
        cmd: 'find-address-by-id'
      },
      createAddress: {
        role: 'createAddress',
        cmd: 'create-address'
      },
      updateAddress: {
        role: 'updateAddress',
        cmd: 'update-address'
      },
      deleteAddress: {
        role: 'deleteAddress',
        cmd: 'delete-address'
      },
      toggleAddressDefault: {
        role: 'toggleAddressDefault',
        cmd: 'toggle-address-default'
      },
      fetchAllAddressDeleted: {
        role: 'fetchAllAddressDeleted',
        cmd: 'fetch-all-address-deleted'
      },
      restoreAddressById: {
        role: 'restoreAddressById',
        cmd: 'restore-address-by-id',
      },
      fetchBuyerAddress:{
        role:'fetchBuyerAddress',
        cmd:'fetch-buyer-address'
     }
    },
    KAFKA: {
      fetchAllAddress: 'fetchAllAddress',
      findAddressById: 'findAddressById',
      createAddress: 'createAddress',
      updateAddress: 'updateAddress',
      deleteAddress: 'deleteAddress',
      toggleAddressDefault: 'toggleAddressDefault',
      fetchAllAddressDeleted: 'fetchAllAddressDeleted',
      restoreAddressById: 'restoreAddressById',
      fetchBuyerAddress:"fetchBuyerAddress"
    },
    REDIS: [],
    RABBITMQ: [],
  };
  