/**
 * @fileoverview
 * Admin service file to handle all admin user related functionality.
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
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";

import { UserType, UserStatus } from "@prisma/client";
import {
  UserRepository,
  AuthRepository,
  UserRoleRepository,
  UserBankDetailsRepository,
  UserVerificationRepository,
} from "./repository";
import { PermissionService } from "../permission/permission.service";
import { RoleService } from "../role/role.service";
import { SerialNumberConfigurationService } from "../serial-number-configiration/serial-number-configuration.service";
import { CommonHelper, SecurityHelper } from "src/common/helpers";
import {
  CreateAdminUserBody,
  ToggleAdminUserVisibilityBody,
  UpdateAdminUserBody,
  UpdateAdminUserPasswordBody,
  UpdateBankingInfoStatusBody,
  UpdateBasicInfoStatusBody,
  UpdateDocumentStatusBody,
  UpdateVerificationStatusBody,
} from "./types";
import { I18nContext, I18nService } from "nestjs-i18n";

@Injectable()
export class AdminService implements OnModuleInit, OnModuleDestroy {
  constructor(
    private userRepository: UserRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
    private userVerificationRepository: UserVerificationRepository,
    private authRepository: AuthRepository,
    private userRoleRepository: UserRoleRepository,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private serialNumberConfigurationService: SerialNumberConfigurationService,
    private commonHelper: CommonHelper,
    private securityHelper: SecurityHelper,
    private readonly i18n: I18nService
  ) {}

  async onModuleInit() {}

  async onModuleDestroy() {}

  //Function to get current language
  public getLang(): string {
    const currentLang = I18nContext.current()?.lang;
    return currentLang ? currentLang : "en";
  }

  /**
   * @description
   * Function to format order by parameter
   */
  formatOrderByParameter(sortColumn: string, sortBy: string) {
    switch (sortColumn) {
      case "name":
        return {
          first_name: sortBy,
        };
      default:
        return { [sortColumn]: sortBy };
    }
  }

  /**
   * @description
   * Function to find particular user of given condition
   */
  async findUserByCondition(condition: any) {
    return this.userRepository.findOne(condition.select, condition.where);
  }

  /**
   * @description
   * Function to find particular user by email
   */
  async findUserByEmail(emailId: string, select: any, where: any = {}) {
    const emailHash = await this.securityHelper.hash(emailId);
    const userCondition = {
      select: select,
      where: {
        ...where,
        email: {
          startsWith: `${emailHash}|`,
        },
      },
    };
    return this.userRepository.findOne(
      userCondition.select,
      userCondition.where
    );
  }

  /**
   * @description
   * Function to find particular user of given condition with delete check
   */
  async findUserByConditionWithoutDelete(condition: any) {
    return this.userRepository.findOneWithoutDelete(
      condition.select,
      condition.where
    );
  }

  /**
   * @description
   * Function to check whether provided roles exist or not
   */
  public checkRolesExits(roles: any) {
    return this.roleService.fetchRolesByCondition(
      { id: true, role_name: true },
      { uuid: { in: roles } }
    );
  }

  /**
   * @description
   * Function to generate employee Id
   */
  async generateEmployeeId() {
    const serialObj =
      await this.serialNumberConfigurationService.fetchSerialNumber(
        "ADMIN_USER"
      );
    return this.commonHelper.generateUniqueId(
      serialObj.alias,
      serialObj.uniqueNumber
    );
  }

  /**
   * @description
   * Function to generate user payload
   */
  async generateUserPayload(payload: any) {
    const names = payload.name.split(" ");
    const emailEncrypt = await this.securityHelper.encrypt(payload.email_id);
    let obj = {
      first_name: "",
      middle_name: "",
      last_name: "",
      email: emailEncrypt,
      designation: payload?.position ? payload.position : null,
      user_type: "SUBADMIN",
      status: "ACTIVE",
    };
    if (names.length === 1) {
      obj.first_name = names[0];
    } else if (names.length === 2) {
      obj.first_name = names[0];
      obj.last_name = names[1];
    } else {
      obj.first_name = names[0];
      obj.middle_name = names[1];
      obj.last_name = names[2];
    }
    return obj;
  }

  /**
   * @description
   * Function to save allowed roles for given user
   */
  public attachRolesToUser(userId: number, roles: any) {
    const allowedRoleArr = [];
    roles.forEach((role: any) => {
      allowedRoleArr.push({
        user_id: userId,
        role_id: role.id,
      });
    });
    this.userRoleRepository.createMany(allowedRoleArr);
  }

  /**
   * @description
   * Function to find particular admin user by condition for login
   */
  async findAdminUserForLogin(payload: any) {
    const adminUserCondition = {
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        email: true,
        mobile_number: true,
        status: true,
        auth: {
          select: {
            id: true,
            user_id: true,
            password: true,
          },
        },
      },
      where: {
        OR: [{ user_type: "ADMIN" }, { user_type: "SUBADMIN" }],
      },
    };
    return this.findUserByEmail(
      payload.email_id,
      adminUserCondition.select,
      adminUserCondition.where
    );
  }

  /**
   * @description
   * Function to fetch all admin user
   */
  async fetchAllAdminUser(
    page_size: number,
    page: number,
    searchText: string,
    is_active: string,
    sortColumn: string = "id",
    sortBy: string = "desc"
  ) {
    try {
      const lang = this.getLang();
      const adminUserCondition = {
        select: {
          uuid: true,
          unique_id: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          designation: true,
          reporting_to: true,
          status: true,
          mobile_number: true,
          email: true,
          is_login: true,
          user_roles: {
            select: {
              role_id: true,
              role: {
                select: {
                  uuid: true,
                  role_name: true,
                },
              },
            },
          },
          created_at: true,
        },
        where: {
          user_type: UserType.SUBADMIN,
        },
      };
      let orCondition = [];
      const andOrCondition = [];

      if (searchText) {
        andOrCondition.push(
          { unique_id: { contains: searchText, mode: "insensitive" } },
          { first_name: { contains: searchText, mode: "insensitive" } },
          { middle_name: { contains: searchText, mode: "insensitive" } },
          { last_name: { contains: searchText, mode: "insensitive" } },
          { designation: { contains: searchText, mode: "insensitive" } },
          {
            user_roles: {
              some: {
                role: {
                  role_name: { contains: searchText, mode: "insensitive" },
                },
              },
            },
          }
        );
      }
      // Add is_active condition if it exists
      if (is_active) {
        const splittedValue = is_active.split(",");
        for (const value of splittedValue) {
          andOrCondition.push({
            status: value,
          });
        }
      }
      if (orCondition.length > 0) {
        adminUserCondition.where["OR"] = orCondition;
      }
      if (andOrCondition.length > 0) {
        adminUserCondition.where["AND"] = [
          {
            OR: andOrCondition,
          },
        ];
      }
      let orderByObj = this.formatOrderByParameter(sortColumn, sortBy);
      const adminUsers: any = await this.userRepository.findManyWithPaginate(
        page,
        adminUserCondition.select,
        adminUserCondition.where,
        page_size,
        orderByObj
      );

      for (let i in adminUsers.result) {
        //Decrypting admin email
        const decryptedEmail = await this.securityHelper.decrypt(
          adminUsers.result[i].email
        );
        adminUsers.result[i].email = decryptedEmail;

        //Decrypting admin mobile number
        const decryptedMobileNumber = await this.securityHelper.decrypt(
          adminUsers.result[i].mobile_number
        );
        adminUsers.result[i].mobile_number = decryptedMobileNumber;
      }
      return {
        status: true,
        message: this.i18n.t("admin._admin_users_fetch_successfully_", {
          lang,
        }),
        data: adminUsers,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted admin user
   */
  async fetchAllDeletedAdminUser(
    page_size: number,
    page: number,
    searchText: string,
    sortColumn: string = "id",
    sortBy: string = "desc"
  ) {
    try {
      const lang = this.getLang();
      const adminUserCondition = {
        select: {
          uuid: true,
          unique_id: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          designation: true,
          reporting_to: true,
          status: true,
          is_login: true,
          user_roles: {
            select: {
              role_id: true,
              role: {
                select: {
                  id: true,
                  role_name: true,
                },
              },
            },
          },
        },
        where: {
          user_type: UserType.SUBADMIN,
          is_deleted: true,
        },
      };
      const adminUsers = await this.userRepository.findManyWithPaginate(
        page,
        adminUserCondition.select,
        adminUserCondition.where
      );
      return {
        status: true,
        message: this.i18n.t("admin._deleted_admin_user_fetch_successfully_", {
          lang,
        }),
        data: adminUsers,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all the admin user for dropdown
   */
  async fetchAllAdminUserForDropdown() {
    try {
      const lang = this.getLang();
      const adminUserCondition = {
        select: {
          uuid: true,
          unique_id: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          designation: true,
        },
        where: {
          user_type: UserType.SUBADMIN,
          status: UserStatus.ACTIVE,
        },
      };
      const adminUser = await this.userRepository.findMany(
        adminUserCondition.select,
        adminUserCondition.where
      );
      return {
        status: true,
        message: this.i18n.t("admin._admin_user_fetch_successfully_", {
          lang,
        }),
        data: adminUser,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the admin user by id
   */
  async findAdminUserById(uuid: string) {
    try {
      const lang = this.getLang();
      const adminUserCondition = {
        select: {
          uuid: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          email: true,
          designation: true,
          reporting_to: true,
          user_roles: {
            select: {
              role_id: true,
              role: {
                select: {
                  uuid: true,
                  role_name: true,
                },
              },
            },
          },
        },
        where: {
          uuid: uuid,
        },
      };
      const adminUser: any = await this.userRepository.findOne(
        adminUserCondition.select,
        adminUserCondition.where
      );

      if (!adminUser) {
        throw new NotFoundException(
          this.i18n.t("admin._data_not_found_", {
            lang,
          })
        );
      }
      //Decrypting email id
      //adminUser['email'] = await this.securityHelper.decrypt(adminUser.email);
      return {
        status: true,
        message: this.i18n.t("admin._admin_user_fetch_successfully_", {
          lang,
        }),
        data: adminUser,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create admin user
   */
  async createAdminUser(auth: any, payload: CreateAdminUserBody) {
    try {
      const lang = this.getLang();
      let action = "CREATE";
      //Checking roles exist or not
      const parsedRoleIds = JSON.parse(payload.role_ids);
      if (parsedRoleIds.length === 0) {
        throw new BadRequestException(
          this.i18n.t("admin._please_select_atleast_one_role_", {
            lang,
          })
        );
      }
      //Checking reporting exist or not
      const parsedReportingTo = JSON.parse(payload.reporting_to);
      if (parsedReportingTo.length === 0) {
        throw new BadRequestException(
          this.i18n.t("admin._please_select_atleast_one_reporting_", {
            lang,
          })
        );
      }
      //Checking provided roles exists or not
      const roles = await this.checkRolesExits(parsedRoleIds);
      if (roles.length !== parsedRoleIds.length) {
        throw new BadRequestException(
          this.i18n.t("admin._role_with_this_specified_id_does_not_exist_", {
            lang,
          })
        );
      }
      // //Checking user email already exists
      const userSelect = {
        id: true,
        email: true,
        is_deleted: true,
      };
      const anotherUserWithSameEmail: any = await this.findUserByEmail(
        payload.email_id,
        userSelect
      );
      if (
        anotherUserWithSameEmail &&
        anotherUserWithSameEmail["is_deleted"] === false
      ) {
        throw new BadRequestException(
          this.i18n.t("admin._user_with_this_email_id_already_exist_", {
            lang,
          })
        );
      } else if (
        anotherUserWithSameEmail &&
        anotherUserWithSameEmail["is_deleted"] === true
      ) {
        action = "RESTORE";
      }
      let adminUser = undefined;
      //Generating user payload
      const userPayload = await this.generateUserPayload(payload);
      userPayload["reporting_to"] = parsedReportingTo;
      if (action === "CREATE") {
        const uniqueId = await this.generateEmployeeId();
        userPayload["unique_id"] = uniqueId;
        userPayload["created_by"] = auth?.id;
        adminUser = await this.userRepository.create(userPayload);
      } else {
        (userPayload["status"] = UserStatus.ACTIVE),
          (userPayload["updated_by"] = auth?.id);
        userPayload["is_deleted"] = false;
        userPayload["deleted_at"] = null;
        userPayload["deleted_by"] = null;
        adminUser = await this.userRepository.update(
          { id: anotherUserWithSameEmail.id, is_deleted: true },
          userPayload
        );
      }
      if (adminUser) {
        //Generating user password  payload
        const encodedPassword = await this.commonHelper.encodePassword(
          payload.email_id
        );
        const authPayload = {
          user_id: adminUser.id,
          password: encodedPassword,
        };
        if (action === "CREATE") {
          await this.authRepository.create(authPayload);
        } else {
          await this.authRepository.update(
            { user_id: adminUser.id },
            authPayload
          );
          //Removing already assigned roles
          await this.userRoleRepository.deleteMany({ user_id: adminUser.id });
        }
        this.attachRolesToUser(adminUser.id, roles);
        return {
          status: true,
          message: this.i18n.t("admin._admin_user_created_successfully_", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("admin._error_while_creating_admin_user_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the admin user status i.e: active and inactive
   */
  async toggleAdminUserVisibility(
    uuid: string,
    auth: any,
    payload: ToggleAdminUserVisibilityBody
  ) {
    try {
      const lang = this.getLang();
      //Checking admin user exist or not
      const adminUserCondition = {
        select: {
          id: true,
          status: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const adminUser = await this.userRepository.findOne(
        adminUserCondition.select,
        adminUserCondition.where
      );
      if (!adminUser) {
        throw new NotFoundException(
          this.i18n.t("admin._data_not_found_", {
            lang,
          })
        );
      }
      const updatePayload = {
        status: payload.is_active === true ? "ACTIVE" : "INACTIVE",
        updated_by: auth?.id,
      };
      const updateAdminUser = await this.userRepository.update(
        { id: adminUser.id },
        updatePayload
      );
      if (updateAdminUser) {
        return {
          status: true,
          message: this.i18n.t(
            "admin._admin_user_visibility_updated_successfully_",
            {
              lang,
            }
          ),
        };
      }
      throw new BadRequestException(
        this.i18n.t("admin._error_while_updating_admin_user_visibility", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the admin user
   */
  async updateAdminUser(uuid: string, auth: any, payload: UpdateAdminUserBody) {
    try {
      const lang = this.getLang();
      //Checking roles exist or not
      const parsedRoleIds = JSON.parse(payload.role_ids);
      if (parsedRoleIds.length === 0) {
        throw new BadRequestException(
          this.i18n.t("admin._please_select_atleast_one_role_", {
            lang,
          })
        );
      }
      //Checking reporting exist or not
      const parsedReportingTo = JSON.parse(payload.reporting_to);
      if (parsedReportingTo.length === 0) {
        throw new BadRequestException(
          this.i18n.t("admin._please_select_atleast_one_reporting_", {
            lang,
          })
        );
      }
      //Checking provided roles exists or not
      const roles = await this.checkRolesExits(parsedRoleIds);
      if (roles.length !== parsedRoleIds.length) {
        throw new BadRequestException(
          this.i18n.t("admin._role_with_this_specified_id_does_not_exist_", {
            lang,
          })
        );
      }
      //Checking admin user exist or not
      const adminUserCondition = {
        select: {
          id: true,
          status: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const adminUser = await this.userRepository.findOne(
        adminUserCondition.select,
        adminUserCondition.where
      );
      if (!adminUser) {
        throw new NotFoundException(
          this.i18n.t("admin._data_not_found_", {
            lang,
          })
        );
      }
      //Checking admin with same email already exist or not
      const anotherAdminUserWithSameEmailCondition = {
        select: {
          id: true,
          email: true,
        },
        where: { id: { not: adminUser.id } },
      };
      const anotherAdminUserWithSameEmail = await this.findUserByEmail(
        payload.email_id,
        anotherAdminUserWithSameEmailCondition.select,
        anotherAdminUserWithSameEmailCondition.where
      );
      if (anotherAdminUserWithSameEmail) {
        throw new BadRequestException(
          this.i18n.t("admin._user_with_this_email_id_already_exist_", {
            lang,
          })
        );
      }
      //Generating user payload
      const userPayload = this.generateUserPayload(payload);
      userPayload["reporting_to"] = parsedReportingTo;
      userPayload["updated_by"] = auth?.id;
      const updatedUser = await this.userRepository.update(
        { id: adminUser.id },
        userPayload
      );
      if (updatedUser) {
        //Removing already assigned roles
        await this.userRoleRepository.deleteMany({ user_id: updatedUser.id });
        //Assigning provided roles
        this.attachRolesToUser(updatedUser.id, roles);
        return {
          status: true,
          message: this.i18n.t("admin._admin_user_updated_successfully_", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("admin._error_while_updating_admin_user_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the admin user
   */
  async deleteAdminUser(uuid: string, auth: any) {
    try {
      const lang = this.getLang();
      //Checking admin user exist or not
      const adminUserCondition = {
        select: {
          id: true,
          status: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const adminUser = await this.userRepository.findOne(
        adminUserCondition.select,
        adminUserCondition.where
      );
      if (!adminUser) {
        throw new NotFoundException(
          this.i18n.t("admin._data_not_found_", {
            lang,
          })
        );
      }
      const updatePayload = {
        status: UserStatus.INACTIVE,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedAdminUser = await this.userRepository.update(
        { id: adminUser.id },
        updatePayload
      );
      if (deletedAdminUser) {
        return {
          status: true,
          message: this.i18n.t("admin._admin_user_deleted_successfully_", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("admin._error_while_deleting_admin_user_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore deleted the admin user details
   */
  async restoreAdminUser(uuid: string, auth: any) {
    try {
      const lang = this.getLang();
      //Checking user already exists
      const userCondition = {
        select: {
          id: true,
          email: true,
          is_deleted: true,
        },
        where: {
          uuid: uuid,
          is_deleted: true,
        },
      };
      const adminUser: any = await this.findUserByCondition(userCondition);
      if (!adminUser) {
        throw new NotFoundException(
          this.i18n.t("admin._data_not_found_", {
            lang,
          })
        );
      }
      //Preparing restore payload
      const restoreCondition = {
        payload: {
          status: UserStatus.ACTIVE,
          updated_by: auth.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          id: adminUser?.id,
          is_deleted: true,
        },
      };
      const restoredAdminUser = await this.userRepository.update(
        restoreCondition.where,
        restoreCondition.payload
      );
      if (restoredAdminUser) {
        return {
          status: true,
          message: this.i18n.t("admin._admin_user_restored_successfully_", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("admin._error_while_restoring_admin_user_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch admin user profile
   */
  async fetchAdminUserProfile(auth: any) {
    try {
      const lang = this.getLang();
      const adminUserCondition = {
        select: {
          uuid: true,
          first_name: true,
          last_name: true,
          email: true,
          mobile_number: true,
          user_type: true,
        },
        where: {
          id: auth?.id,
        },
      };

      const adminUser: any = await this.userRepository.findOne(
        adminUserCondition.select,
        adminUserCondition.where
      );

      if (!adminUser) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      // Decrypting admin user email
      const decryptedEmail = await this.securityHelper.decrypt(adminUser.email);
      adminUser.email = decryptedEmail;

      return {
        status: true,
        message: this.i18n.t("user._admin_user_profile_fetched_successfully", {
          lang,
        }),
        data: adminUser,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to change admin user password
   */
  async updateAdminUserPassword(
    authentication: any,
    payload: UpdateAdminUserPasswordBody
  ) {
    try {
      const lang = this.getLang();
      const adminUserCondition = {
        select: {
          id: true,
          auth: {
            select: {
              password: true,
            },
          },
        },
        where: {
          id: authentication.id,
        },
      };
      const adminUser: any = await this.userRepository.findOne(
        adminUserCondition.select,
        adminUserCondition.where
      );

      // checking password exists or not
      const passwordMatched = this.commonHelper.isPasswordValid(
        payload.old_password,
        adminUser?.auth?.password
      );

      if (!passwordMatched) {
        throw new BadRequestException(
          this.i18n.t("admin._old_password_is_incorrect_", {
            lang,
          })
        );
      }

      //updating password
      const encodedPassword = await this.commonHelper.encodePassword(
        payload.password
      );
      const updatePassword = await this.authRepository.update(
        { user_id: adminUser.id },
        { password: encodedPassword }
      );
      if (updatePassword) {
        return {
          status: true,
          message: this.i18n.t(
            "user._admin_user_password_updated_successfully",
            { lang }
          ),
        };
      }

      throw new BadRequestException(
        this.i18n.t("user._error_while_updating_admin_user_password", { lang })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update onboarding basic information status
   */
  async updateBasicInformationStatus(
    uuid: string,
    auth: any,
    payload: UpdateBasicInfoStatusBody
  ) {
    try {
      const lang = this.getLang();
      //check seller / financier is present or not......
      const condition: any = {
        uuid: uuid,
        OR: [{ user_type: UserType.SELLER }, { user_type: UserType.FINANCIER }],
      };

      const isUserExist: any = await this.userRepository.findOne(
        { id: true },
        condition
      );

      if (!isUserExist) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      const updateStatusCondition = {
        payload: {
          basic_info_status: payload.admin_status,
          updated_by: auth.id,
        },
        where: {
          id: isUserExist?.id,
        },
      };

      if (payload.admin_status === "APPROVED") {
        updateStatusCondition.payload["basic_info_rejection_detail"] = null;
      } else {
        updateStatusCondition.payload["basic_info_rejection_detail"] =
          payload.reason;
      }

      //update the status of seller or financier........
      const updateUserStatus = await this.userRepository.update(
        updateStatusCondition.where,
        updateStatusCondition.payload
      );

      //update universal status if all steps status is APPROVED
      await this.updateUniversalOnBoardingStatus(isUserExist.id);
      if (updateUserStatus) {
        return {
          status: true,
          message: this.i18n.t(
            "user._basic_information_status_updated_successfully_",
            {
              lang,
            }
          ),
        };
      }

      throw new BadRequestException(
        this.i18n.t("user._error_while_updating_basic_information_status", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update onboarding banking information status
   */
  async updateBankingInformationStatus(
    uuid: string,
    auth: any,
    payload: UpdateBankingInfoStatusBody
  ) {
    try {
      const lang = this.getLang();
      //check seller / financier is present or not......
      const condition: any = {
        uuid: uuid,
        OR: [{ user_type: UserType.SELLER }, { user_type: UserType.FINANCIER }],
      };

      const isUserExist: any = await this.userRepository.findOne(
        { id: true },
        condition
      );

      if (!isUserExist) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //check record is exist or not.........
      const checkBankingDetailsDataPresent =
        await this.userBankDetailsRepository.findOne(
          { id: true },
          { user_id: isUserExist.id }
        );

      if (!checkBankingDetailsDataPresent) {
        throw new NotFoundException(
          this.i18n.t("user._banking_details_is_not_present_", {
            lang,
          })
        );
      }
      const updateStatusCondition = {
        payload: {
          banking_status: payload.admin_status,
          updated_by: auth.id,
        },
        where: {
          id: checkBankingDetailsDataPresent?.id,
        },
      };
      if (payload.admin_status === "APPROVED") {
        updateStatusCondition.payload["banking_rejection_detail"] = null;
      } else {
        updateStatusCondition.payload["banking_rejection_detail"] =
          payload.reason;
      }

      //update the status of seller or financier........
      const updateUserStatus = await this.userBankDetailsRepository.update(
        updateStatusCondition.where,
        updateStatusCondition.payload
      );
      //update universal status if all steps status is APPROVED
      await this.updateUniversalOnBoardingStatus(isUserExist.id);
      if (updateUserStatus) {
        return {
          status: true,
          message: this.i18n.t(
            "user._banking_information_status_updated_successfully_",
            {
              lang,
            }
          ),
        };
      }

      throw new BadRequestException(
        this.i18n.t("user._error_while_updating_banking_information_status", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update onboarding verification status
   */
  async updateVerificationStatus(
    uuid: string,
    auth: any,
    payload: UpdateVerificationStatusBody
  ) {
    try {
      const lang = this.getLang();
      //check seller / financier is present or not......
      const condition: any = {
        uuid: uuid,
        OR: [{ user_type: UserType.SELLER }, { user_type: UserType.FINANCIER }],
      };

      const isUserExist: any = await this.userRepository.findOne(
        { id: true },
        condition
      );

      if (!isUserExist) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //check record is exist or not.........
      const checkVerificationDataPresent =
        await this.userVerificationRepository.findOne(
          { id: true },
          { user_id: isUserExist.id }
        );

      if (!checkVerificationDataPresent) {
        throw new NotFoundException(
          this.i18n.t("user._verification_data_is_not_present_", {
            lang,
          })
        );
      }

      const updateStatusCondition = {
        payload: {
          verification_status: payload.admin_status,
          updated_by: auth.id,
        },
        where: {
          id: checkVerificationDataPresent?.id,
        },
      };
      if (payload.admin_status === "APPROVED") {
        updateStatusCondition.payload["verification_rejection_detail"] = null;
      } else {
        updateStatusCondition.payload["verification_rejection_detail"] =
          payload.reason;
      }

      //update the status of seller or financier........
      const updateUserStatus = await this.userVerificationRepository.update(
        updateStatusCondition.where,
        updateStatusCondition.payload
      );
      //update universal status if all steps status is APPROVED
      await this.updateUniversalOnBoardingStatus(isUserExist.id);
      if (updateUserStatus) {
        return {
          status: true,
          message: this.i18n.t(
            "user._verification_status_updated_successfully_",
            {
              lang,
            }
          ),
        };
      }

      throw new BadRequestException(
        this.i18n.t("user._error_while_updating_verification_status", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update onboarding document status
   */
  async updateDocumentStatus(
    uuid: string,
    auth: any,
    payload: UpdateDocumentStatusBody
  ) {
    try {
      const lang = this.getLang();
      //check seller / financier is present or not......
      const condition: any = {
        uuid: uuid,
        OR: [{ user_type: UserType.SELLER }, { user_type: UserType.FINANCIER }],
      };

      const isUserExist: any = await this.userRepository.findOne(
        { id: true },
        condition
      );

      if (!isUserExist) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      throw new BadRequestException(
        this.i18n.t("user._error_while_updating_document_status", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  async updateUniversalOnBoardingStatus(user_id: number) {
    try {
      const checkOnboardingStatusPayload: any = {
        select: {
          basic_info_status: true,
          universalOnBoardingStatus: true,
          BankDetails: {
            select: {
              banking_status: true,
            },
          },
          UserVerification: {
            select: {
              verification_status: true,
            },
          },
        },
        where: {
          id: user_id,
        },
      };

      //check all onBoarding state status is APPROVED or not....
      const checkIsStatusApproved: any = await this.userRepository.findOne(
        checkOnboardingStatusPayload.select,
        checkOnboardingStatusPayload.where
      );
      const basicInfoStatus: any = checkIsStatusApproved["basic_info_status"];
      const bankDetailsStatus: any =
        checkIsStatusApproved["BankDetails"]?.[0]?.["banking_status"];
      const verificationStatus: any =
        checkIsStatusApproved["UserVerification"]?.[0]?.["verification_status"];
      if (
        basicInfoStatus === "APPROVED" &&
        bankDetailsStatus === "APPROVED" &&
        verificationStatus === "APPROVED"
      ) {
        const result = await this.userRepository.update(
          { id: user_id },
          { universalOnBoardingStatus: "APPROVED" }
        );
      } else {
        if (checkIsStatusApproved["universalOnBoardingStatus"] === "APPROVED") {
          await this.userRepository.update(
            { id: user_id },
            { universalOnBoardingStatus: "PENDING" }
          );
        }
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function fetch admin user basic details by id.
   */
  async fetchAdminUserBasicDetailsById(uuid: string) {
    try {
      const lang = this.getLang();
      const adminUserPayload = {
        select: {
          uuid: true,
          email: true,
          first_name: true,
          last_name: true,
          mobile_number: true,
          status: true,
          UserAddress: true,
          gst_number: true,
        },
        where: {
          uuid: uuid,
          user_type: UserType.SUBADMIN,
        },
      };
      const admin: any = await this.userRepository.findOne(
        adminUserPayload.select,
        adminUserPayload.where
      );
      if (!admin) {
        throw new BadRequestException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //Decrypting admin email
      const decryptedEmail = await this.securityHelper.decrypt(admin.email);
      admin.email = decryptedEmail;

      //Decrypting admin email
      const decryptedMobileNumber = await this.securityHelper.decrypt(
        admin.mobile_number
      );
      admin.mobile_number = decryptedMobileNumber;

      return {
        status: true,
        message: this.i18n.t(
          "admin._admin_user_basic_information_fetched_successfully",
          { lang }
        ),
        data: admin,
      };
    } catch (error) {
      throw new error();
    }
  }
}
