/**
 * @fileoverview
 * Financier service file to handle all financier related functionality.
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
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";
import { UserType } from "@prisma/client";
import {
  UserBankDetailsRepository,
  UserDocumentRepository,
  UserRepository,
  UserVerificationRepository,
} from "./repository";
import { SecurityHelper } from "src/common/helpers";
import { lastValueFrom } from "rxjs";
import {
  PRODUCTMS_CATEGORY_PATTERN,
  PRODUCTMS_INDUSTRY_PATTERN,
} from "./pattern";
import { MODULE_CONFIG } from "./module.config";
import { ClientKafka, ClientProxy } from "@nestjs/microservices";

@Injectable()
export class FinancierService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject("PRODUCT_MICROSERVICE")
    private readonly productClient: ClientKafka | ClientProxy | any,
    private readonly i18n: I18nService,
    private userRepository: UserRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
    private userVerificationRepository: UserVerificationRepository,
    private userDocumentRepository: UserDocumentRepository,
    private securityHelper: SecurityHelper
  ) {}

  async onModuleInit() {
    if (MODULE_CONFIG.PRODUCT_MS.transport === "KAFKA") {
      this.productClient.subscribeToResponseOf("fetchAllCategoryWithId");
    }
  }

  async onModuleDestroy() {
    if (MODULE_CONFIG.PRODUCT_MS.transport === "KAFKA") {
      this.productClient.close();
    }
  }

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
   * Function to fetch categories meta.
   */
  async fetchCategoriesMeta() {
    return lastValueFrom(
      this.productClient.send(
        PRODUCTMS_CATEGORY_PATTERN[MODULE_CONFIG.PRODUCT_MS.transport]
          .fetchCategoriesMeta,
        {}
      )
    );
  }

  /**
   * @description
   * Function to fetch industry by id.
   */
  async fetchIndustryById(id: number) {
    try {
      return lastValueFrom(
        this.productClient.send(
          PRODUCTMS_INDUSTRY_PATTERN[MODULE_CONFIG.PRODUCT_MS.transport]
            .fetchIndustryById,
          { id }
        )
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to find particular financier by email
   */
  async findFinancierByEmail(email: string, select: any, where: any = {}) {
    const emailHash = await this.securityHelper.hash(email);
    const financierCondition = {
      select: select,
      where: {
        ...where,
        email: {
          startsWith: `${emailHash}|`,
        },
      },
    };
    return this.userRepository.findOne(
      financierCondition.select,
      financierCondition.where
    );
  }

  /**
   * @description
   * Function to fetch all financier user
   */
  async fetchAllFinancier(
    page_size: number,
    page: number,
    searchText: string,
    is_active: string,
    sortColumn: string = "id",
    sortBy: string = "desc"
  ) {
    try {
      const lang = this.getLang();
      const financierCondition = {
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
        },
        where: {
          user_type: UserType.FINANCIER,
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
        financierCondition.where["OR"] = orCondition;
      }
      if (andOrCondition.length > 0) {
        financierCondition.where["AND"] = [
          {
            OR: andOrCondition,
          },
        ];
      }
      let orderByObj = this.formatOrderByParameter(sortColumn, sortBy);
      const financiers: any = await this.userRepository.findManyWithPaginate(
        page,
        financierCondition.select,
        financierCondition.where,
        page_size,
        orderByObj
      );
      return {
        status: true,
        message: this.i18n.t("financier._financier_fetch_successfully_", {
          lang,
        }),
        data: financiers,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function fetch financier basic details by id.
   */
  async fetchFinancierBasicDetailsById(uuid: string) {
    try {
      const lang = this.getLang();
      const financierPayload = {
        select: {
          uuid: true,
          email: true,
          first_name: true,
          last_name: true,
          company_name: true,
          pan_card_number: true,
          mobile_number: true,
          status: true,
          UserAddress: {
            select: {
              address1: true,
              address2: true,
              landmark: true,
              city: true,
              state: true,
              pincode: true,
              country: true,
            },
          },
          gst_number: true,
          business_type: true,
          establishment: true,
          operation_locations: true,
          company_offerings: true,
          product_industry_id: true,
          product_category_id: true,
        },
        where: {
          uuid: uuid,
          user_type: UserType.FINANCIER,
        },
      };
      const financier: any = await this.userRepository.findOne(
        financierPayload.select,
        financierPayload.where
      );
      if (!financier) {
        throw new BadRequestException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //fetch seller division......
      if (financier.product_industry_id) {
        const industry: any = await this.fetchIndustryById(
          financier.product_industry_id
        );
        financier["product_industry"] = industry.industry_name;
      } else {
        financier["product_industry"] = null;
      }
      if (
        financier?.product_category_id ||
        financier?.product_category_id?.lenght > 0
      ) {
        const categoryMeta = await this.fetchCategoriesMeta();
        financier["categoryMeta"] = categoryMeta;
      }

      //Decrypting seller email....
      if (financier.email) {
        const decryptedEmail = await this.securityHelper.decrypt(
          financier.email
        );
        financier.email = decryptedEmail;
      }

      //Decrypting financier mobile
      if (financier.mobile_number) {
        const decryptedMobileNumber = await this.securityHelper.decrypt(
          financier.mobile_number
        );
        financier.mobile_number = decryptedMobileNumber;
      }

      //Decrypting pan card number
      if (financier.pan_card_number) {
        const decryptedPanCardNumber = await this.securityHelper.decrypt(
          financier.pan_card_number
        );
        financier.pan_card_number = decryptedPanCardNumber;
      }

      //Decrypting gst number
      if (financier.gst_number) {
        const decryptedGstNumber = await this.securityHelper.decrypt(
          financier.gst_number
        );
        financier.gst_number = decryptedGstNumber;
      }

      return {
        status: true,
        message: this.i18n.t(
          "financier._financier_basic_information_fetched_successfully",
          { lang }
        ),
        data: financier,
      };
    } catch (error) {
      throw new error();
    }
  }
}
