export const USER_PATTERN = {
  TCP: {
    findUserByConditionForLogin: {
      role: "findUserByConditionForLogin",
      cmd: "find-user-by-condition-for-login",
    },
    findUserByCondition: {
      role: "findUserByCondition",
      cmd: "find-user-by-condition",
    },
    fetchBuyerProfile: {
      role: "fetchBuyerProfile",
      cmd: "fetch-buyer-profile",
    },
    fetchUserByResetToken: {
      role: "fetchUserByResetToken",
      cmd: "fetch-user-by-reset-token",
    },
    verifyUserPermission: {
      role: "verifyUserPermission",
      cmd: "verify-user-permission",
    },
    registerBuyer: { role: "registerBuyer", cmd: "register-buyer" },
    findBuyerForLogin: {
      role: "findBuyerForLogin",
      cmd: "find-buyer-for-login",
    },
    findBuyerForRegistration: {
      role: "findBuyerForRegistration",
      cmd: "find-buyer-for-registration",
    },
    createBuyer: {
      role: "createBuyer",
      cmd: "create-buyer",
    },
    checkMobileNumberAlreadyExist: {
      role: "checkMobileNumberAlreadyExist",
      cmd: "check-mobile-number-already-exist",
    },
    findUserById: {
      role: "findUserById",
      cmd: "find-user-by-id",
    },
    forgotPassword: {
      role: "forgotPassword",
      cmd: "forgot-password",
    },
    resetPassword: {
      role: "resetPassword",
      cmd: "reset-password",
    },
    encryptData: {
      role: "encryptData",
      cmd: "encrypt-data",
    },
    decryptData: {
      role: "decryptData",
      cmd: "decrypt-data",
    },
    hashData: {
      role: "hashData",
      cmd: "hash-data",
    },
    fetchAllBuyers: { role: "fetchAllBuyers", cmd: "fetch-all-buyers" },
    fetchUsersBasicDetailsId: {
      role: "fetchUsersBasicDetailsId",
      cmd: "fetch-users-basic-details-by-id",
    },
  },
  KAFKA: {
    findUserByConditionForLogin: "findUserByConditionForLogin",
    findUserByCondition: "findUserByCondition",
    fetchBuyerProfile: "fetchBuyerProfile",
    fetchUserByResetToken: "fetchUserByResetToken",
    verifyUserPermission: "verifyUserPermission",
    registerBuyer: "registerBuyer",
    findBuyerForLogin: "findBuyerForLogin",
    findBuyerForRegistration: "findBuyerForRegistration",
    createBuyer: "createBuyer",
    checkMobileNumberAlreadyExist: "checkMobileNumberAlreadyExist",
    findUserById: "findUserById",
    fetchAllBuyers: "fetchAllBuyers",
    forgotPassword: "forgotPassword",
    resetPassword: "resetPassword",
    encryptData: "encryptData",
    decryptData: "decryptData",
    hashData: "hashData",
    fetchUsersBasicDetailsId: "fetchUsersBasicDetailsId",
  },
  REDIS: {},
  RABBITMQ: {},
};

export const ADMIN_PATTERN = {
  TCP: {
    findAdminUserForLogin: {
      role: "findAdminUserForLogin",
      cmd: "find-admin-user-for-login",
    },
    fetchAllAdminUser: {
      role: "fetchAllAdminUser",
      cmd: "fetch-all-admin-user",
    },
    fetchAllDeletedAdminUser: {
      role: "fetchAllDeletedAdminUser",
      cmd: "fetch-all-deleted-admin-user",
    },
    fetchAllAdminUserForDropdown: {
      role: "fetchAllAdminUserForDropdown",
      cmd: "fetch-all-admin-user-for-dropdown",
    },
    findAdminUserById: {
      role: "findAdminUserById",
      cmd: "find-admin-user-by-id",
    },
    createAdminUser: { role: "createAdminUser", cmd: "create-admin-user" },
    findAdminUserProfile: {
      role: "findAdminUserProfile",
      cmd: "find-admin-user-profile",
    },
    toggleAdminUserVisibility: {
      role: "toggleAdminUserVisibility",
      cmd: "toggle-admin-user-visibility",
    },
    updateAdminUser: { role: "updateAdminUser", cmd: "update-admin-user" },
    updateAdminUserPassword: {
      role: "updateAdminUserPassword",
      cmd: "update-admin-user-password",
    },
    deleteAdminUser: { role: "deleteAdminUser", cmd: "delete-admin-user" },
    restoreAdminUser: { role: "restoreAdminUser", cmd: "restore-admin-user" },
    updateBasicInformationStatus: {
      role: "updateBasicInformationStatus",
      cmd: "update-basic-information-status",
    },
    updateBankingInformationStatus: {
      role: "updateBankingInformationStatus",
      cmd: "update-banking-information-status",
    },
    updateVerificationStatus: {
      role: "updateVerificationStatus",
      cmd: "update-verification-status",
    },
    updateDocumentStatus: {
      role: "updateDocumentStatus",
      cmd: "update-document-status",
    },
    fetchAdminUserBasicDetailsById: {
      role: "fetchAdminUserBasicDetailsById",
      cmd: "fetch-admin-user-basic-details",
    },
  },
  KAFKA: {
    findAdminUserForLogin: "findAdminUserForLogin",
    fetchAllAdminUser: "fetchAllAdminUser",
    fetchAllDeletedAdminUser: "fetchAllDeletedAdminUser",
    fetchAllAdminUserForDropdown: "fetchAllAdminUserForDropdown",
    findAdminUserById: "findAdminUserById",
    findAdminUserProfile: "findAdminUserProfile",
    createAdminUser: "createAdminUser",
    toggleAdminUserVisibility: "toggleAdminUserVisibility",
    updateAdminUser: "updateAdminUser",
    updateAdminUserPassword: "updateAdminUserPassword",
    deleteAdminUser: "deleteAdminUser",
    restoreAdminUser: "restoreAdminUser",
    updateBasicInformationStatus: "updateBasicInformationStatus",
    updateBankingInformationStatus: "updateBankingInformationStatus",
    updateVerificationStatus: "updateVerificationStatus",
    updateDocumentStatus: "updateDocumentStatus",
    fetchAdminUserBasicDetailsById: "fetchAdminUserBasicDetailsById",
  },
  REDIS: {},
  RABBITMQ: {},
};

export const SELLER_PATTERN = {
  TCP: {
    fetchAllSeller: { role: "fetchAllSeller", cmd: "fetch-all-seller" },
    findSellerForLogin: {
      role: "findSellerForLogin",
      cmd: "find-seller-for-login",
    },
    findSellerForRegistration: {
      role: "findSellerForRegistration",
      cmd: "find-seller-for-registration",
    },
    createSeller: {
      role: "createSeller",
      cmd: "create-seller",
    },
    fetchSellerProfile: {
      role: "fetchSellerProfile",
      cmd: "fetch-seller-profile",
    },
    fetchBasicDetails: {
      role: "fetchBasicDetails",
      cmd: "fetch-basic-details",
    },
    fetchBankDetails: {
      role: "fetchBankDetails",
      cmd: "fetch-bank-details",
    },
    fetchVerificationDetails: {
      role: "fetchVerificationDetails",
      cmd: "fetch-verification-details",
    },
    fetchDocumentsDetails: {
      role: "fetchDocumentsDetails",
      cmd: "fetch-documents-details",
    },
    createUpdateBasicDetails: {
      role: "createUpdateBasicDetails",
      cmd: "create-update-basic-details",
    },
    createUpdateBankDetails: {
      role: "createUpdateBankDetails",
      cmd: "create-update-bank-details",
    },
    createUpdateVerification: {
      role: "createUpdateVerification",
      cmd: "create-update-verification",
    },
    createUpdateDocuments: {
      role: "createUpdateDocuments",
      cmd: "create-update-documents",
    },
    fetchSellerBasicDetailsById: {
      role: "fetchSellerBasicDetailsId",
      cmd: "fetch-seller-basic-details-by-id",
    },
    fetchSellerBankDetailsById: {
      role: "fetchSellerBankDetailsById",
      cmd: "fetch-seller-bank-details-by-id",
    },
    fetchSellerVerificationById: {
      role: "fetchSellerVerificationById",
      cmd: "fetch-seller-verification-by-id",
    },
    fetchSellerDocumentsById: {
      role: "fetchSellerDocumentsById",
      cmd: "fetch-seller-Documents-by-id",
    },
    fetchSellerProductCategories:{
      role:"fetchSellerProductCategories",
      cmd:"fetch-seller-product-category"
 }
  },
  KAFKA: {
    findSellerForLogin: "findSellerForLogin",
    findSellerForRegistration: "findSellerForRegistration",
    createSeller: "createSeller",
    fetchSellerProfile: "fetchSellerProfile",
    fetchBasicDetails: "fetchBasicDetails",
    fetchBankDetails: "fetchBankDetails",
    fetchVerificationDetails: "fetchVerificationDetails",
    fetchDocumentsDetails: "fetchDocumentsDetails",
    createUpdateBasicDetails: "createUpdateBasicDetails",
    createUpdateBankDetails: "createUpdateBankDetails",
    createUpdateVerification: "createUpdateVerification",
    createUpdateDocuments: "createUpdateDocuments",
    fetchAllSeller: "fetchAllSeller",
    fetchSellerBasicDetailsById: "fetchSellerBasicDetailsById",
    fetchSellerBankDetailsById: "fetchSellerBankDetailsById",
    fetchSellerVerificationById: "fetchSellerVerificationById",
    fetchSellerDocumentsById: "fetchSellerDocumentsById",
    fetchSellerProductCategories:"fetchSellerProductCategories"
  },
  REDIS: {},
  RABBITMQ: {},
};

export const PRODUCTMS_CATEGORY_PATTERN = {
  TCP: {
    fetchCategoriesMeta: {
      role: "fetchCategoriesMeta",
      cmd: "fetch-categories-meta",
    },
  },
  KAFKA: {
    fetchCategoriesMeta: "fetchCategoriesMeta",
  },
  REDIS: {},
  RABBITMQ: {},
};

export const PRODUCTMS_INDUSTRY_PATTERN = {
  TCP: {
    fetchIndustryById: {
      role: "fetchIndustryById",
      cmd: "fetch-industry-by-id",
    },
  },
  KAFKA: {
    fetchIndustryById: "fetchIndustryById",
  },
  REDIS: {},
  RABBITMQ: {},
};

export const FINANCIER_PATTERN = {
  TCP: {
    fetchAllFinanciers: {
      role: "fetchAllFinanciers",
      cmd: "fetch-all-financiers",
    },
    fetchFinancierBasicDetailsById: {
      role: "fetchFinancierBasicDetailsById",
      cmd: "fetch-financier-basic-details-by-id",
    },
    fetchFinancierBankDetailsById: {
      role: "fetchFinancierBankDetailsById",
      cmd: "fetch-financier-bank-details-by-id",
    },
    fetchFinancierVerificationById: {
      role: "fetchFinancierVerificationById",
      cmd: "fetch-financier-verification-by-id",
    },
    fetchFinancierDocumentsById: {
      role: "fetchFinancierDocumentsById",
      cmd: "fetch-financier-documents-by-id",
    },
  },
  KAFKA: {
    fetchAllFinanciers: "fetchAllFinanciers",
    fetchFinancierBasicDetailsById: "fetchFinancierBasicDetailsById",
    fetchFinancierBankDetailsById: "fetchFinancierBankDetailsById",
    fetchFinancierVerificationById: "fetchFinancierVerificationById",
    fetchFinancierDocumentsById: "fetchFinancierDocumentsById",
  },
  REDIS: {},
  RABBITMQ: {},
};
export const NOTIFICATION_MS_PATTERN = {
  TCP: {
    sendEmailTemplate: {
      role: "sendEmailTemplate",
      cmd: "send-email-template",
    },
  },
  KAFKA: {
    sendEmailTemplate: "sendEmailTemplate",
  },
  REDIS: {},
  RABBITMQ: {},
};
