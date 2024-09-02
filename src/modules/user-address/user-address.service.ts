/**
 * @fileoverview
 * User Address service file to handle all address related functionality.
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
} from '@nestjs/common';
import { UserAddressRepository } from './repository';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class UserAddressService {
  constructor(
    private readonly i18n: I18nService,
    private userAddressRepository: UserAddressRepository,
  ) { }

  //Function to get current language
  public getLang(): string {
    const currentLang = I18nContext.current()?.lang;
    return (currentLang) ? currentLang : 'en';
  }

  /**
 * @description
 * Function to find address by given condition
 */
  async fetchAddressByCondition(select: any, condition: any) {
    return this.userAddressRepository.findMany(select, condition);
  }

  /**
 * @description
 * Function to find all user addresses
 */
  async fetchAllAddress(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const addressCondition = {
        select: {
          uuid: true,
          address_name: true,
          full_name: true,
          mobile_number: true,
          pincode: true,
          address1: true,
          address2: true,
          landmark: true,
          city: true,
          state: true,
          country: true,
          delivery_days: true,
          is_default: true,
          is_active: true,
        },
        where: {},
      };
      if (searchText) {
        addressCondition['where']['OR'] = [
          {
            address_name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            full_name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ];
      }
      const addresses = await this.userAddressRepository.findManyWithPaginate(
        page,
        addressCondition.select,
        addressCondition.where,
      );
      return {
        status: true,
        message: this.i18n.t("user-address._user_address_fetched_successfully", { lang }),
        data: addresses,
      };
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  /**
   * @description
   * Function to find particular address of given id
   */
  async findAddressById(uuid: string) {
    try {
      const lang = this.getLang();
      const select = {
        uuid: true,
        user_id: true,
        address_name: true,
        full_name: true,
        mobile_number: true,
        pincode: true,
        address1: true,
        address2: true,
        landmark: true,
        city: true,
        state: true,
        country: true,
        delivery_days: true,
        is_default: true,
        is_active: true,
      };
      const address = await this.userAddressRepository.findOne(
        select,
        { uuid: uuid, deleted_at: null }
      );
      if (!address) {
        throw new NotFoundException(this.i18n.t("user-address._we_could_not_find_what_you_are_looking_for", {
          lang,
        }));
      }
      return {
        status: true,
        message: this.i18n.t("user-address._user_address_fetched_successfully", { lang }),
        data: address,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
 * @description
 * Function to create addres
 */
  async createAddress(auth: any, payload: any) {
    try {
      const lang = this.getLang();
      //Checking address already exist
      const addressCondition = {
        select: {
          id: true,
          user_id: true,
          address_name: true,
          is_deleted: true,
        },
        where: {
          OR: [{ address_name: payload.address_name, user_id: auth.id }],
        },
      };
      const address: any = await this.userAddressRepository.findOneWithoutDelete(
        addressCondition.select,
        addressCondition.where,
      );
      if (address && address.is_deleted === false) {
        throw new ConflictException(
          this.i18n.t("user-address._record_already_exists", { lang })
        );
      }
      //Preparing address payload
      const addressPayload = {
        create: {
          user_id: auth?.id,
          address_name: payload.address_name,
          full_name: payload.full_name,
          mobile_number: payload.mobile_number,
          pincode: payload.pincode,
          address1: payload.address1,
          landmark: payload.landmark,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          is_default: payload.is_default,
          delivery_days: payload.delivery_days,
          created_by: auth?.id,
        },
        update: {
          user_id: auth.id,
          address_name: payload.address_name,
          full_name: payload.full_name,
          mobile_number: payload.mobile_number,
          pincode: payload.pincode,
          address1: payload.address1,
          landmark: payload.landmark,
          city: payload.city,
          state: payload.state,
          country: payload.country,
          is_default: payload.is_default,
          delivery_days: payload.delivery_days,
          updated_by: auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          address_name: payload.address_name,
        },
      };
      const createdAddress = await this.userAddressRepository.upsert(
        addressPayload.create,
        addressPayload.update,
        addressPayload.where,
      );
      if (createdAddress) {
        return { status: true, message: this.i18n.t("user-address._user_address_created_successfully", { lang }), };
      }
      throw new BadRequestException(
        this.i18n.t("user-address._error_while_creating_user_address", { lang })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle address default
   */
  async toggleAddressDefault(auth: any, uuid: string, payload: any) {
    try {
      const lang = this.getLang();
      //Checking role information exists or not
      const addressCondition = {
        select: {
          id: true,
          uuid: true,
          user_id: true
        },
        where: {
          uuid: uuid,
        },
      };
      const address = await this.userAddressRepository.findOne(
        addressCondition.select,
        addressCondition.where,
      );
      if (!address) {
        throw new NotFoundException(
          this.i18n.t("user-address._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const addressPayload = {
        ...payload,
        updated_by: auth.id,
      };
      this.userAddressRepository.update({ id: address.id }, addressPayload);
      // Update all other addresses for the same user to not be the default
      const updated = await this.userAddressRepository.updateMany(
        { user_id: auth?.id, uuid: { not: uuid } },
        { is_default: false, updated_by: auth.id }
      );
      if (updated) {
        return {
          status: true,
          message: this.i18n.t("user-address._user_address_visibility_updated_successfully", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("user-address._error_while_updating_user_address_visibility", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update existing address
   */
  async updateAddress(auth: any, uuid: string, payload: any) {
    try {
      const lang = this.getLang();
      //Checking address information exists or not
      const addressCondition = {
        select: {
          id: true,
          uuid: true,
          user_id: true,
          address_name: true,
          is_deleted: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const address = await this.userAddressRepository.findOne(
        addressCondition.select,
        addressCondition.where,
      );
      if (!address) {
        throw new NotFoundException(
          this.i18n.t("user-address._we_could_not_find_what_you_are_looking_for", {
          lang,
        }));
      }
      //Checking address already exist
      const anotherAddressWithSameName = await this.userAddressRepository.findOne(
        { id: true, uuid: true, address_name: true },
        {
          OR: [{ address_name: payload.address_name }],
          NOT: { uuid: uuid },
        },
      );
      if (anotherAddressWithSameName) {
        throw new ConflictException(
          this.i18n.t("user-address._user_address_with_same_name_already_exists", {
            lang,
          })
        );
      }
      //Preparing role payload
      const addressPayload = {
        address_name: payload.address_name,
        full_name: payload.full_name,
        mobile_number: payload.mobile_number,
        pincode: payload.pincode,
        address1: payload.address1,
        landmark: payload.landmark,
        city: payload.city,
        state: payload.state,
        country: payload.country,
        is_default: payload.is_default,
        delivery_days: payload.delivery_days,
        updated_by: auth.id,
      };
      const updatedRole = await this.userAddressRepository.update({ id: address.id }, addressPayload);
      if (updatedRole) {
        return { status: true, message: this.i18n.t("user-address._user_address_updated_successfully", {
          lang,
        }), };
      }
      throw new BadRequestException(
        this.i18n.t("user-address._error_while_updating_user_address", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
 * @description
 * Function to delete existing address
 */
  async deleteAddress(auth: any, uuid: string) {
    try {
      const lang = this.getLang();
      //Checking address information exists or not
      const addressCondition = {
        select: {
          uuid: true,
          address_name: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const address = await this.userAddressRepository.findOne(
        addressCondition.select,
        addressCondition.where,
      );
      if (!address) {
        throw new NotFoundException(
          this.i18n.t("user-address._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const addressPayload = {
        is_default: false,
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedAddress = await this.userAddressRepository.update({ uuid }, addressPayload);
      if (deletedAddress) {
        return { status: true, message: this.i18n.t("user-address._user_address_deleted_successfully", {
          lang,
        }), };
      }
      throw new BadRequestException(
        this.i18n.t("user-address._error_while_deleting_user_address", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
* @description
* Function to find all deleted address
*/
  async fetchAllAddressDeleted(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const addressCondition = {
        select: {
          id: true,
          uuid: true,
          address_name: true,
          full_name: true,
          mobile_number: true,
          pincode: true,
          address1: true,
          address2: true,
          landmark: true,
          city: true,
          state: true,
          country: true,
          delivery_days: true,
          is_default: true,
          is_active: true,
        },
        where: {},
      };
      if (searchText) {
        addressCondition['where']['OR'] = [
          {
            address_name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            full_name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ];
      }
      const address = await this.userAddressRepository.findManyDeletedWithPaginate(
        addressCondition.select,
        addressCondition.where,
        page,
      );
      return {
        status: true,
        message: this.i18n.t("user-address._user_address_fetched_successfully", { lang }),
        data: address,
      };
    } catch (err) {
      throw err;
    }
  }

  /**
 * @description
 * Function to restore particular address of given id
 */
  async restoreAddressById(uuid: string) {
    try {
      const lang = this.getLang();
      //Checking address information exists or not
      const addressExist = await this.userAddressRepository.findOneWithoutDelete(
        { uuid: true, address_name: true },
        { uuid: uuid, is_deleted: true },
      );
      if (!addressExist) {
        throw new NotFoundException(
          this.i18n.t("user-address._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const addressPayload = {
        is_active: true,
        updated_at: new Date(),
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
      };
      const restoredAddress = await this.userAddressRepository.updateWithOutDeleted(
        { uuid },
        addressPayload,
      );
      if (restoredAddress) {
        return {
          status: true,
          message: this.i18n.t("user-address._user_address_restore_successfully", {
            lang,
          }),
        };
      }
      throw new BadRequestException(this.i18n.t("user-address._error_while_restoring_user_address", {
        lang,
      }));
    } catch (error) {
      throw error;
    }
  }
}