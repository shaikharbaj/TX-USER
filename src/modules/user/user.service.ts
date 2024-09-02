/**
 * @fileoverview
 * User service file to handle all user related functionality.
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
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";
import { lastValueFrom } from "rxjs";
import { I18nContext, I18nService } from "nestjs-i18n";
import { UserType, UserStatus } from "@prisma/client";
import {
  AuthRepository,
  UserRepository,
  UserRoleRepository,
} from "./repository";
import { PermissionService } from "../permission/permission.service";
import { RoleService } from "../role/role.service";
import { CommonHelper, SecurityHelper } from "src/common/helpers";
import { SerialNumberConfigurationService } from "../serial-number-configiration/serial-number-configuration.service";
import { BuyerRegistrationBody, checkMobileNumberExist } from "./types";
import { NOTIFICATION_MS_PATTERN } from "./pattern";
import { MODULE_CONFIG } from "./module.config";

@Injectable()
export class UserService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject("NOTIFICATION_MICROSERVICE")
    private readonly notificationClient: ClientKafka | ClientProxy | any,
    private readonly i18n: I18nService,
    private userRepository: UserRepository,
    private userRoleRepository: UserRoleRepository,
    private permissionService: PermissionService,
    private roleService: RoleService,
    private authRepository: AuthRepository,
    private serialNumberConfigurationService: SerialNumberConfigurationService,
    private commonHelper: CommonHelper,
    private securityHelper: SecurityHelper
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
   * Function to send email
   */
  public sendEmail(payload: any): Promise<any> {
    const data = this.commonHelper.generateEmailPayload(payload);
    return lastValueFrom(
      this.notificationClient.emit(
        NOTIFICATION_MS_PATTERN[MODULE_CONFIG.NOTIFICATION_MS.transport]
          .sendEmailTemplate,
        { data }
      )
    );
  }

  /**
   * @description
   * Function to generate buyer Id
   */
  async generateBuyerId() {
    const serialObj =
      await this.serialNumberConfigurationService.fetchSerialNumber(
        "BUYER_USER"
      );
    return this.commonHelper.generateUniqueId(
      serialObj.alias,
      serialObj.uniqueNumber
    );
  }

  /**
   * @description
   * Function to find particular user by condition for login
   */
  async findUserByConditionForLogin(condition: any) {
    const select = {
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
    };
    return this.userRepository.findOne(select, condition);
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
   * Function to verify particular user permission
   */
  async verifyUserPermission(payload: any) {
    const lang = this.getLang();
    const auth = payload.auth;
    const { data } = await this.permissionService.findPermissionsBySlug(
      payload.permission
    );
    if (!data) {
      return {
        status: false,
        message: this.i18n.t("user._invalid_permission_", { lang }),
      };
    }
    const userRoleCondition = {
      select: {
        user_id: true,
        role_id: true,
      },
      where: {
        user_id: auth?.id,
      },
    };
    const userRoles = await this.userRoleRepository.findMany(
      userRoleCondition.select,
      userRoleCondition.where
    );
    if (userRoles.length === 0) {
      return {
        status: false,
        message: this.i18n.t(
          "user._role_is_not_assigned_yet_please_contact_the_administrator_",
          { lang }
        ),
      };
    }
    const roleIds = this.commonHelper.pluck(userRoles, "role_id");
    const rolePermissionExist = await this.roleService.verifyRolePermission(
      roleIds,
      data.id
    );
    if (rolePermissionExist) {
      return {
        status: true,
        message: this.i18n.t("user._specified_permission_present_in_role_", {
          lang,
        }),
      };
    }
    return {
      status: false,
      message: this.i18n.t(
        "user._you_dont_have_required_permission_to_perform_this_action_",
        { lang }
      ),
    };
  }

  /**
   * @description
   * Function to find particular buyer user by condition for login
   */
  async findBuyerForLogin(payload: any) {
    const buyerCondition = {
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        email: true,
        mobile_number: true,
        status: true,
        is_deleted: true,
        auth: {
          select: {
            id: true,
            user_id: true,
            password: true,
          },
        },
      },
      where: {
        user_type: "BUYER",
      },
    };
    return await this.findBuyerByEmail(
      payload.email,
      buyerCondition.select,
      buyerCondition.where
    );
  }

  /**
   * @description
   * Function to find particular buyer user by condition for registration
   */
  async findBuyerForRegistration(payload: any) {
    const buyerCondition = {
      select: {
        email: true,
        is_deleted: true,
      },
      where: {
        user_type: "BUYER",
      },
    };
    return await this.findBuyerByEmail(
      payload.email,
      buyerCondition.select,
      buyerCondition.where
    );
  }

  /**
   * @description
   * Function to check mobile number is already present or not.
   */
  async checkMobileNumberAlreadyExist(payload: checkMobileNumberExist) {
    const mobileHash = await this.securityHelper.hash(payload.mobile_number);
    const buyerCondition = {
      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        email: true,
        mobile_number: true,
        status: true,
        is_deleted: true,
      },
      where: {
        mobile_number: {
          startsWith: `${mobileHash}|`,
        },
      },
    };
    return await this.userRepository.findOne(
      buyerCondition.select,
      buyerCondition.where
    );
  }

  /**
   * @description
   * Function to find particular user by email
   */
  async findBuyerByEmail(emailId: string, select: any, where: any = {}) {
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
   * Function to generate buyer payload
   */
  async generateBuyerPayload(payload: any) {
    const emailEncrypt = await this.securityHelper.encrypt(payload.email);
    const panCardNumberEncrypt = await this.securityHelper.encrypt(
      payload.pan_card_number
    );
    const aadharNumberEncrypt = await this.securityHelper.encrypt(
      payload.aadhar_card_number
    );
    const mobileNumberEncrypt = await this.securityHelper.encrypt(
      payload.mobile_number
    );
    let obj = {
      first_name: payload.first_name,
      middle_name: payload.middle_name,
      last_name: payload.last_name,
      email: emailEncrypt,
      mobile_number: mobileNumberEncrypt,
      pan_card_number: panCardNumberEncrypt,
      aadhar_card_number: aadharNumberEncrypt,
      user_type: UserType.BUYER,
      status: UserStatus.ACTIVE,
    };
    return obj;
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
   * Function to handel create buyer
   */

  async createBuyer(payload: BuyerRegistrationBody) {
    const buyerEmail = payload.email;
    // Generating user payload
    const buyerPayload = await this.generateBuyerPayload(payload);
    const uniqueId = await this.generateBuyerId();
    buyerPayload["unique_id"] = uniqueId;
    let buyer = await this.userRepository.create(buyerPayload);
    if (buyer) {
      //Generating user password  payload
      const encodedPassword = await this.commonHelper.encodePassword(
        payload.password
      );
      const authPayload = {
        user_id: buyer.id,
        password: encodedPassword,
      };
      await this.authRepository.create(authPayload);

      //Email payload for sending email
      const emailPayload = {
        subject: "Welocme to Trexo PRO!",
        to: buyerEmail,
        template: "welcome",
        data: {
          name: `${buyer.first_name} ${buyer.last_name}`,
        },
      };
      //Added try and catch block so that it will not break this code,if the sendEmail fucntion throws any error
      try {
        this.sendEmail(emailPayload);
      } catch (error) {
        console.error(error);
      }
    }
    return buyer;
  }

  /**
   * @description
   * Function to find user of by id
   */

  async findUserById(where: any = {}) {
    try {
      const userCondition = {
        select: {
          first_name: true,
          middle_name: true,
          last_name: true,
          email: true,
          mobile_number: true,
          UserAddress: {
            select: {
              address_name: true,
              addressType: true,
              pincode: true,
              city: true,
              state: true,
              country: true,
            },
          },
        },
        where: where,
      };
      const user = await this.userRepository.findOne(
        userCondition.select,
        userCondition.where
      );
      user.email = (await this.securityHelper.decrypt(
        user.email as any
      )) as any;
      user.mobile_number = (await this.securityHelper.decrypt(
        user.mobile_number as any
      )) as any;
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all customer/buyers user
   */
  async fetchAllBuyers(
    page_size: number,
    page: number,
    searchText: string,
    is_active: string,
    sortColumn: string = "id",
    sortBy: string = "desc"
  ) {
    try {
      const lang = this.getLang();
      const buyerCondition = {
        select: {
          uuid: true,
          unique_id: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          designation: true,
          mobile_number: true,
          profile_url: true,
          email: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
        where: {
          user_type: UserType.BUYER,
        },
      };

      let orCondition = [];
      const andOrCondition = [];
      if (searchText) {
        andOrCondition.push(
          { unique_id: { contains: searchText, mode: "insensitive" } },
          { first_name: { contains: searchText, mode: "insensitive" } },
          { middle_name: { contains: searchText, mode: "insensitive" } },
          { last_name: { contains: searchText, mode: "insensitive" } }
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
        buyerCondition.where["OR"] = orCondition;
      }
      if (andOrCondition.length > 0) {
        buyerCondition.where["AND"] = [
          {
            OR: andOrCondition,
          },
        ];
      }
      let orderByObj = this.formatOrderByParameter(sortColumn, sortBy);
      const buyers: any = await this.userRepository.findManyWithPaginate(
        page,
        buyerCondition.select,
        buyerCondition.where,
        page_size,
        orderByObj
      );
      for (let i in buyers.result) {
        //Decrypting buyers email
        const decryptedEmail = await this.securityHelper.decrypt(
          buyers.result[i].email
        );
        buyers.result[i].email = decryptedEmail;

        //Decrypting buyers mobile number
        const decryptedMobileNumber = await this.securityHelper.decrypt(
          buyers.result[i].mobile_number
        );
        buyers.result[i].mobile_number = decryptedMobileNumber;
      }
      return {
        status: true,
        message: this.i18n.t("user._buyers_fetch_successfully_", {
          lang,
        }),
        data: buyers,
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * @description
   * Function to fetch buyer profile
   */
  async fetchBuyerProfile(auth: any) {
    try {
      const lang = this.getLang();

      const buyerCondition = {
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

      const buyer: any = await this.userRepository.findOne(
        buyerCondition.select,
        buyerCondition.where
      );

      if (!buyer) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //Decrypting buyer email
      const decryptedEmail = await this.securityHelper.decrypt(buyer.email);
      buyer.email = decryptedEmail;

      //Decrypting buyer email
      const decryptedMobileNumber = await this.securityHelper.decrypt(
        buyer.mobile_number
      );
      buyer.mobile_number = decryptedMobileNumber;

      return {
        status: true,
        message: this.i18n.t("user._buyer_user_profile_fetched_successfully", {
          lang,
        }),
        data: buyer,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function for forgot password
   */
  async forgotPassword(payload: any) {
    try {
      const salt = await this.securityHelper.generateSalt();
      const resetToken = await this.securityHelper.hash(salt);
      const generatedLink =
        await this.commonHelper.generateResetPasswordLink(resetToken);

      const updateResetToken = {
        where: {
          uuid: payload?.uuid,
        },
        update: {
          reset_token: resetToken,
        },
      };
      //To update reset_token in the database
      await this.userRepository.update(
        updateResetToken.where,
        updateResetToken.update
      );

      if (payload) {
        const emailPayload = {
          template: "forgot-password",
          subject: "Verify reset password!",
          to: payload.email,
          data: {
            name: `${payload.first_name} ${payload.last_name}`,
            email: payload.email,
            resetPassword: generatedLink,
          },
        };

        //Added try and catch block so that it will not break this code,if the sendEmail fucntion throws any error
        try {
          this.sendEmail(emailPayload);
        } catch (error) {
          console.error(error);
        }
      }
    } catch (error) {
      throw new error();
    }
  }

  /**
   * @description
   * Function for fetch user by reset token
   */
  async fetchUserByResetToken(token: string) {
    try {
      const lang = this.getLang();
      const userPayload = {
        select: {
          uuid: true,
          email: true,
        },
        where: {
          reset_token: token,
        },
      };
      const user: any = await this.findUserByCondition(userPayload);
      if (!user) {
        throw new BadRequestException(
          this.i18n.t("user._invalid_reset_password_token", { lang })
        );
      }
      const decryptedEmail = await this.decrypt(user.email);
      user.email = decryptedEmail;

      return {
        status: true,
        message: this.i18n.t("user._user_fetched_successfully", { lang }),
        data: user,
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * @description
   * Function for forgot password
   */
  async resetPassword(payload: any) {
    try {
      //encode new password
      const updatedPassword = await this.commonHelper.encodePassword(
        payload?.newPassword
      );

      const updatePayload = {
        where: {
          user_id: payload?.userId,
        },
        update: {
          password: updatedPassword,
        },
      };
      await this.authRepository.update(
        updatePayload.where,
        updatePayload.update
      );
      return {
        status: true,
      };
    } catch (error) {
      throw new error();
    }
  }

  /**
   * @description
   * Function fetch users basic details by id.
   */
  async fetchBuyerBasicDetailsById(uuid: string) {
    try {
      const lang = this.getLang();
      const userPayload = {
        select: {
          uuid: true,
          email: true,
          first_name: true,
          last_name: true,
          mobile_number: true,
          gst_number: true,
          status: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const user: any = await this.findUserByCondition(userPayload);
      if (!user) {
        throw new BadRequestException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const decryptedEmail = await this.decrypt(user.email);
      user.email = decryptedEmail;

      if (user.mobile_number) {
        const decryptedMobileNumber = await this.decrypt(user.mobile_number);
        user.mobile_number = decryptedMobileNumber;
      }

      return {
        status: true,
        message: this.i18n.t(
          "user._consumer_basic_details_fetched_successfully",
          { lang }
        ),
        data: user,
      };
    } catch (error) {
      throw new error();
    }
  }
  /**
   * @description
   * Function for encryption
   */
  async encrypt(data: any) {
    return this.securityHelper.encrypt(data);
  }

  /**
   * @description
   * Function for decryption
   */
  async decrypt(data: any) {
    return this.securityHelper.decrypt(data);
  }

  /**
   * @description
   * Function for hashing
   */
  async hash(data: any) {
    return this.securityHelper.hash(data);
  }
}
