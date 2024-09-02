/**
 * @fileoverview
 * Seller service file to handle all seller related functionality.
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
import {
  AuthRepository,
  UserBankDetailsRepository,
  UserDocumentRepository,
  UserRepository,
  UserVerificationRepository,
} from "./repository";
import { CommonHelper, S3Helper, SecurityHelper } from "src/common/helpers";
import { SerialNumberConfigurationService } from "../serial-number-configiration/serial-number-configuration.service";
import {
  SellerBankDetailBody,
  SellerBasicDetailBody,
  SellerDocumentsBody,
  SellerVerificationBody,
} from "./types";
import { UserType } from "@prisma/client";
import { ClientKafka, ClientProxy, RpcException } from "@nestjs/microservices";
import { MODULE_CONFIG } from "./module.config";
import { lastValueFrom } from "rxjs";
import {
  NOTIFICATION_MS_PATTERN,
  PRODUCTMS_CATEGORY_PATTERN,
  PRODUCTMS_INDUSTRY_PATTERN,
} from "./pattern";

@Injectable()
export class SellerService implements OnModuleInit, OnModuleDestroy {
  constructor(
    @Inject("PRODUCT_MICROSERVICE")
    private readonly productClient: ClientKafka | ClientProxy | any,
    @Inject("NOTIFICATION_MICROSERVICE")
    private readonly notificationClient: ClientKafka | ClientProxy | any,
    private readonly i18n: I18nService,
    private userRepository: UserRepository,
    private userBankDetailsRepository: UserBankDetailsRepository,
    private userVerificationRepository: UserVerificationRepository,
    private userDocumentRepository: UserDocumentRepository,
    private authRepository: AuthRepository,
    private commonHelper: CommonHelper,
    private securityHelper: SecurityHelper,
    private s3Helper: S3Helper,
    private serialNumberConfigurationService: SerialNumberConfigurationService
  ) { }

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
      case "seller_name":
        return {
          first_name: sortBy,
        };
      default:
        return { [sortColumn]: sortBy };
    }
  }

  /**
   * @description
   * Function to generate employee Id
   */
  async generateSellerId() {
    const serialObj =
      await this.serialNumberConfigurationService.fetchSerialNumber(
        "SELLER_USER"
      );
    return this.commonHelper.generateUniqueId(
      serialObj.alias,
      serialObj.uniqueNumber
    );
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
   * Function to find particular seller by email
   */
  async findSellerByEmail(email: string, select: any, where: any = {}) {
    const emailHash = await this.securityHelper.hash(email);
    const sellerCondition = {
      select: select,
      where: {
        ...where,
        email: {
          startsWith: `${emailHash}|`,
        },
      },
    };
    return this.userRepository.findOne(
      sellerCondition.select,
      sellerCondition.where
    );
  }

  /**
   * @description
   * Function to find particular seller by condition for login
   */
  async findSellerForLogin(payload: any) {
    const sellerCondition = {
      select: {
        id: true,
        uuid: true,
        first_name: true,
        last_name: true,
        email: true,
        mobile_number: true,
        status: true,
        is_deleted: true,
        onboarding_completed: true,
        step_completed: true,
        auth: {
          select: {
            user_id: true,
            password: true,
          },
        },
      },
      where: {
        OR: [{ user_type: "SELLER" }],
      },
    };
    return this.findSellerByEmail(
      payload.email,
      sellerCondition.select,
      sellerCondition.where
    );
  }

  /**
   * @description
   * Function to find particular seller by condition for registration
   */
  async findSellerForRegistration(payload: any) {
    const sellerCondition = {
      select: {
        email: true,
        is_deleted: true,
      },
      where: {
        OR: [{ user_type: "SELLER" }],
      },
    };
    return this.findSellerByEmail(
      payload.email,
      sellerCondition.select,
      sellerCondition.where
    );
  }
  /**
   * @description
   * Function to generate seller payload
   */
  async generateSellerPayload(payload: any) {
    const emailEncrypt = await this.securityHelper.encrypt(payload.email);
    const mobileNumebrEncrypt = await this.securityHelper.encrypt(
      payload.mobile_number
    );
    let obj = {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: emailEncrypt,
      mobile_number: mobileNumebrEncrypt,
      user_type: "SELLER",
      status: "ACTIVE",
    };
    return obj;
  }

  /**
   * @description
   * Function to generate basic details payload
   */
  async generateBasicDetailsPayload(payload: any) {
    const gstEncrypt = await this.securityHelper.encrypt(payload.gst_number);
    const panEncrypt = await this.securityHelper.encrypt(
      payload.pan_card_number
    );
    let obj = {
      business_type: payload.business_type,
      establishment: payload.establishment,
      operation_locations: payload.operation_locations,
      company_name: payload.company_name,
      company_offerings: payload.company_offerings,
      product_industry_id: Number(payload.product_industry_id),
      product_category_id: payload.product_category_id,
      gst_number: gstEncrypt,
      pan_card_number: panEncrypt,
    };
    return obj;
  }

  /**
   * @description
   * Function to generate bank details payload
   */
  async generateBankDetailsPayload(payload: any) {
    const accountNumberEncrypt = await this.securityHelper.encrypt(
      payload.account_number
    );
    let obj = {
      account_holder_name: payload.account_holder_name,
      account_number: accountNumberEncrypt,
      ifsc_code: payload.ifsc_code,
      branch_name: payload.branch_name,
      account_type: payload.account_type,
    };
    return obj;
  }

  /**
   * @description
   * Function to fetch all seller user
   */
  async fetchAllSeller(
    page_size: number,
    page: number,
    searchText: string,
    is_active: string,
    sortColumn: string = "id",
    sortBy: string = "desc"
  ) {
    try {
      const lang = this.getLang();
      const sellerCondition = {
        select: {
          uuid: true,
          unique_id: true,
          first_name: true,
          middle_name: true,
          last_name: true,
          mobile_number: true,
          profile_url: true,
          product_category_id: true,
          email: true,
          status: true,
          created_at: true,
        },
        where: {
          user_type: UserType.SELLER,
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
        sellerCondition.where["OR"] = orCondition;
      }
      if (andOrCondition.length > 0) {
        sellerCondition.where["AND"] = [
          {
            OR: andOrCondition,
          },
        ];
      }
      let orderByObj = this.formatOrderByParameter(sortColumn, sortBy);

      const categoriesMeta = await this.fetchCategoriesMeta();
      const sellers: any = await this.userRepository.findManyWithPaginate(
        page,
        sellerCondition.select,
        sellerCondition.where,
        page_size,
        orderByObj
      );
      return {
        status: true,
        message: this.i18n.t("seller._sellers_fetch_successfully_", {
          lang,
        }),
        data: {
          result: sellers.result,
          meta: sellers.meta,
          customeMeta: categoriesMeta,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create seller
   */
  async createSeller(payload: any) {
    let sellerUser = undefined;
    let sellerEmail = payload.email;
    //Generating seller payload
    const sellerPayload = await this.generateSellerPayload(payload);
    // Generating seller Id
    const uniqueId = await this.generateSellerId();
    sellerPayload["unique_id"] = uniqueId;
    sellerUser = await this.userRepository.create(sellerPayload);
    if (sellerUser) {
      //Generating seller password payload
      const encodedPassword = await this.commonHelper.encodePassword(
        payload.password
      );
      const authPayload = {
        user_id: sellerUser.id,
        password: encodedPassword,
      };
      await this.authRepository.create(authPayload);
      //Email payload for sending email
      const emailPayload = {
        subject: "Welocme to Trexo PRO!",
        to: sellerEmail,
        template: "welcome",
        data: {
          name: `${sellerUser.first_name} ${sellerUser.last_name}`,
        },
      };

      //Added try and catch block so that it will not break this code,if the sendEmail fucntion throws any error
      try {
        this.sendEmail(emailPayload);
      } catch (error) {
        console.error(error);
      }
      return sellerUser;
    }
  }

  /**
   * @description
   * Function to fetch seller profile
   */
  async fetchSellerProfile(auth: any) {
    try {
      const lang = this.getLang();
      const sellerCondition = {
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

      const seller: any = await this.userRepository.findOne(
        sellerCondition.select,
        sellerCondition.where
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //Decrypting seller email
      const decryptedEmail = await this.securityHelper.decrypt(seller.email);
      seller.email = decryptedEmail;

      //Decrypting seller email
      const decryptedMobileNumber = await this.securityHelper.decrypt(
        seller.mobile_number
      );
      seller.mobile_number = decryptedMobileNumber;

      return {
        status: true,
        message: this.i18n.t(
          "seller._seller_user_profile_fetched_successfully",
          { lang }
        ),
        data: seller,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch basic details
   */
  async fetchBasicDetails(auth: any) {
    try {
      const lang = this.getLang();
      const sellerCondition = {
        select: {
          uuid: true,
          business_type: true,
          establishment: true,
          operation_locations: true,
          company_name: true,
          company_offerings: true,
          product_industry_id: true,
          product_category_id: true,
          gst_number: true,
          pan_card_number: true,
        },
        where: {
          id: auth?.id,
        },
      };

      const seller: any = await this.userRepository.findOne(
        sellerCondition.select,
        sellerCondition.where
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //Decrypting seller gst number
      const decryptedGst = await this.securityHelper.decrypt(seller.gst_number);
      seller.gst_number = decryptedGst;

      //Decrypting seller pan card number
      const decryptedPanCard = await this.securityHelper.decrypt(
        seller.pan_card_number
      );
      seller.pan_card_number = decryptedPanCard;

      return {
        status: true,
        message: this.i18n.t("seller._basic_details_fetched_successfully", {
          lang,
        }),
        data: seller,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create and update seller basic details
   */
  async createUpdateBasicDetails(auth: any, payload: SellerBasicDetailBody) {
    try {
      const lang = this.getLang();
      let action = "CREATE";
      let detailsPayload = {};

      // Decrypting seller email
      const decryptedEmail = await this.securityHelper.decrypt(auth.email);

      // Checking if user email already exists
      const sellerSelect = {
        uuid: true,
        email: true,
        business_type: true,
        establishment: true,
        operation_locations: true,
        company_name: true,
        company_offerings: true,
        product_industry_id: true,
        product_category_id: true,
        gst_number: true,
        pan_card_number: true,
        step_completed: true,
        is_deleted: true,
      };
      const seller: any = await this.findSellerByEmail(
        decryptedEmail,
        sellerSelect
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("seller._seller_not_found_", { lang })
        );
      }

      if (seller.is_deleted) {
        throw new ForbiddenException(
          this.i18n.t(
            "seller._seller_with_this_email_is_restricted_please_contact_administrator_for_support_",
            { lang }
          )
        );
      }

      // Generating seller basic details payload
      detailsPayload = await this.generateBasicDetailsPayload(payload);
      detailsPayload["updated_by"] = auth?.id;

      if (seller.step_completed === 0) {
        detailsPayload["step_completed"] = 1;
      } else {
        action = "UPDATE";
      }

      const sellerAction = await this.userRepository.update(
        { uuid: seller.uuid, is_deleted: false },
        detailsPayload
      );

      if (sellerAction) {
        return {
          status: true,
          message: `Basic details ${action.toLowerCase()}d successfully`,
        };
      } else {
        throw new BadRequestException(
          `Error while ${action.toLowerCase()}ing basic details.`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch bank details
   */
  async fetchBankDetails(auth: any) {
    try {
      const lang = this.getLang();
      const sellerCondition = {
        select: {
          uuid: true,
          account_holder_name: true,
          account_number: true,
          ifsc_code: true,
          branch_name: true,
          account_type: true,
        },
        where: {
          user_id: auth?.id,
        },
      };

      const seller: any = await this.userBankDetailsRepository.findOne(
        sellerCondition.select,
        sellerCondition.where
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //Decrypting seller account number
      const decryptedAccountNumber = await this.securityHelper.decrypt(
        seller.account_number
      );
      seller.account_number = decryptedAccountNumber;

      return {
        status: true,
        message: this.i18n.t("seller._bank_details_fetched_successfully", {
          lang,
        }),
        data: seller,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create and update seller bank details
   */
  async createUpdateBankDetails(auth: any, payload: SellerBankDetailBody) {
    try {
      const lang = this.getLang();
      let action = "CREATE";
      let detailsPayload = {};

      // Decrypting seller email
      const decryptedEmail = await this.securityHelper.decrypt(auth.email);

      // Checking if user email already exists
      const sellerSelect = {
        id: true,
        uuid: true,
        email: true,
        step_completed: true,
        is_deleted: true,
      };
      const seller: any = await this.findSellerByEmail(
        decryptedEmail,
        sellerSelect
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("seller._seller_not_found_", { lang })
        );
      }

      if (seller.is_deleted) {
        throw new ForbiddenException(
          this.i18n.t(
            "seller._seller_with_this_email_is_restricted_please_contact_administrator_for_support_",
            { lang }
          )
        );
      }

      // Checking if bank details already exist for the seller
      const bankDetails = await this.userBankDetailsRepository.findOne(
        {
          id: true,
          uuid: true,
          user_id: true,
          account_holder_name: true,
          account_number: true,
          ifsc_code: true,
          branch_name: true,
          account_type: true,
        },
        {
          user_id: seller.id,
        }
      );

      // Generating seller bank details payload
      detailsPayload = await this.generateBankDetailsPayload(payload);

      if (seller.step_completed === 1) {
        detailsPayload["user_id"] = seller?.id;
        detailsPayload["created_by"] = seller?.id;
      } else {
        detailsPayload["updated_by"] = seller?.id;
        action = "UPDATE";
      }

      let sellerAction;
      if (!bankDetails) {
        sellerAction =
          await this.userBankDetailsRepository.create(detailsPayload);
        await this.userRepository.update(
          { uuid: seller.uuid },
          { step_completed: 2 }
        );
      } else {
        sellerAction = await this.userBankDetailsRepository.update(
          { uuid: bankDetails.uuid },
          detailsPayload
        );
      }

      if (sellerAction) {
        return {
          status: true,
          message: `Bank details ${action.toLowerCase()}d successfully`,
        };
      } else {
        throw new BadRequestException(
          `Error while ${action.toLowerCase()}ing bank details.`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch verification details
   */
  async fetchVerificationDetails(auth: any) {
    try {
      const lang = this.getLang();
      const sellerCondition = {
        select: {
          id: true,
          uuid: true,
          code: true,
          code_image: true,
        },
        where: {
          user_id: auth?.id,
        },
      };

      const seller: any = await this.userVerificationRepository.findOne(
        sellerCondition.select,
        sellerCondition.where
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      return {
        status: true,
        message: this.i18n.t("seller._verification_fetched_successfully", {
          lang,
        }),
        data: seller,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create and update seller verification
   */
  async createUpdateVerification(
    auth: any,
    file: any,
    payload: SellerVerificationBody
  ) {
    try {
      const lang = this.getLang();
      let action = "CREATE";
      let detailsPayload = {};
      // Decrypting seller email
      const decryptedEmail = await this.securityHelper.decrypt(auth.email);
      // Checking if user email already exists
      const sellerSelect = {
        id: true,
        uuid: true,
        email: true,
        step_completed: true,
        is_deleted: true,
      };
      const seller: any = await this.findSellerByEmail(
        decryptedEmail,
        sellerSelect
      );
      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("seller._seller_not_found_", { lang })
        );
      }
      if (seller.is_deleted) {
        throw new ForbiddenException(
          this.i18n.t(
            "seller._seller_with_this_email_is_restricted_please_contact_administrator_for_support_",
            { lang }
          )
        );
      }
      // Checking if verification details already exist for the seller
      const verificationDetails = await this.userVerificationRepository.findOne(
        {
          id: true,
          uuid: true,
          user_id: true,
          code: true,
          code_image: true,
        },
        {
          user_id: seller.id,
        }
      );

      let uploadedResponse: any;
      if (file) {
        try {
          uploadedResponse = await this.handleFileUpload(
            "verification",
            file,
            seller.id
          );
        } catch (error) {
          throw error;
        }
      }
      // Generating seller verification payload
      detailsPayload = {
        user_id: seller.id,
        code: payload.code,
        code_image: uploadedResponse?.fileName,
      };
      if (seller.step_completed === 2) {
        detailsPayload["user_id"] = seller?.id;
        detailsPayload["created_by"] = seller?.id;
      } else {
        detailsPayload["updated_by"] = seller?.id;
        action = "UPDATE";
      }
      let sellerAction;
      if (!verificationDetails) {
        sellerAction =
          await this.userVerificationRepository.create(detailsPayload);
        await this.userRepository.update(
          { uuid: seller.uuid },
          { step_completed: 3 }
        );
      } else {
        if (verificationDetails?.code_image) {
          let image = this.commonHelper.userFolderPath(
            "verification",
            seller.id
          );
          let key = `${image}${verificationDetails.code_image}`;
          this.s3Helper.deleteFromBucket(key);
        }
        sellerAction = await this.userVerificationRepository.update(
          { uuid: verificationDetails.uuid },
          detailsPayload
        );
      }

      if (sellerAction) {
        return {
          status: true,
          message: `Verification ${action.toLowerCase()}d successfully`,
        };
      } else {
        throw new BadRequestException(
          `Error while ${action.toLowerCase()}ing verification details.`
        );
      }
    } catch (error) {
      throw error;
    }
  }

  /**
 * @description
 * Function to fetch documents details
 */
  async fetchDocumentsDetails(auth: any) {
    try {
      const lang = this.getLang();
      const sellerCondition = {
        select: {
          id: true,
          uuid: true,
          document_name: true,
          document: true,
        },
        where: {
          user_id: auth?.id,
        },
      };

      const seller: any = await this.userDocumentRepository.findMany(
        sellerCondition.select,
        sellerCondition.where
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      return {
        status: true,
        message: this.i18n.t("seller._documents_fetched_successfully", {
          lang,
        }),
        data: seller,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create and update seller documents
   */
  async createUpdateDocuments(
    auth: any,
    files: any,
    payload: SellerDocumentsBody
  ) {
    try {
      const lang = this.getLang();
      let action = "CREATE";
      // Decrypting seller email
      const decryptedEmail = await this.securityHelper.decrypt(auth.email);
      // Checking if user email already exists
      const sellerSelect = {
        id: true,
        uuid: true,
        email: true,
        step_completed: true,
        is_deleted: true,
      };
      const seller: any = await this.findSellerByEmail(
        decryptedEmail,
        sellerSelect
      );

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("seller._seller_not_found_", { lang })
        );
      }
      if (seller.is_deleted) {
        throw new ForbiddenException(
          this.i18n.t(
            "seller._seller_with_this_email_is_restricted_please_contact_administrator_for_support_",
            { lang }
          )
        );
      }
      // Checking if documents already exist for the seller
      const documentDetails = await this.userDocumentRepository.findMany(
        {
          uuid: true,
          user_id: true,
          document_name: true,
          document: true,
        },
        {
          user_id: seller.id,
        }
      );

      let uploadedResponses: any[] = [];
      if (files && Object.keys(files).length > 0) {
        try {
          const filesArray = Object.entries(files) as [string, any[]][];
          const flattenedFiles = filesArray.flatMap(([key, fileArray]) =>
            fileArray.map((file) => ({ key, file }))
          );
          uploadedResponses = await Promise.all(
            flattenedFiles.map(
              ({ key, file }) =>
                this.handleFileUpload("documents", file, seller.id).then(
                  (uploadedFile) => ({ key, fileName: uploadedFile.fileName })
                ) // Map key with uploaded response
            )
          );
        } catch (error) {
          throw error;
        }
      }
      // Generating seller document payload
      const detailsPayloadArray = uploadedResponses.map(
        ({ key, fileName }) => ({
          user_id: seller.id,
          document_name:
            key === "personalFile" ? payload?.personal_identification : key,
          document: fileName,
        })
      );

      // Create or Update the documents
      // Create or Update the documents
      for (const detailsPayload of detailsPayloadArray) {
        let existingDocument;

        // Check for special document types
        if (['Aadhar card', 'Pan card', 'Passport'].includes(detailsPayload.document_name)) {
          existingDocument = documentDetails.find(doc =>
            ['Aadhar card', 'Pan card', 'Passport'].includes(doc.document_name)
          );
        } else {
          // For other document types, match by exact document_name
          existingDocument = documentDetails.find(
            doc => doc.document_name === detailsPayload.document_name
          );
        }

        if (existingDocument) {
          // If document already exists, update it and delete the old file from S3
          if (existingDocument.document) {
            const image = this.commonHelper.userFolderPath(
              "documents",
              seller.id
            );
            const key = `${image}${existingDocument.document}`;
            await this.s3Helper.deleteFromBucket(key);
          }
          await this.userDocumentRepository.update(
            { uuid: existingDocument.uuid },
            {
              ...detailsPayload,
              updated_by: seller.id,
            }
          );
          action = "UPDATE";
        } else {
          // If document does not exist, create a new one
          await this.userDocumentRepository.create({
            ...detailsPayload,
            created_by: seller.id,
          });
          action = "CREATE";
        }
      }

      // Update the seller's step_completed status if needed
      if (seller.step_completed < 3) {
        await this.userRepository.update(
          { uuid: seller.uuid },
          { step_completed: 4 }
        );
      }

      return {
        status: true,
        message: `Documents ${action.toLowerCase()}d successfully`,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to hdndle file upload
   */
  private async handleFileUpload(folder: any, file: any, sellerId: number) {
    const verificationFolderPath = this.commonHelper.userFolderPath(
      folder,
      sellerId
    );
    const fileExtention = this.commonHelper.mimeTypeExtension(file.mimetype);
    const fileName = this.commonHelper.generateRandomFileName(fileExtention);

    const uploadResponse = await this.s3Helper.uploadBinaryFile(
      verificationFolderPath,
      fileName,
      file.mimetype,
      file.buffer
    );

    if (!uploadResponse.status) {
      throw new RpcException("Error while uploading file.");
    }

    return uploadResponse?.bucketResponse;
  }

  /**
   * @description
   * Function fetch seller basic details by id.
   */
  async fetchSellerBasicDetailsById(uuid: string) {
    try {
      const lang = this.getLang();
      const sellerPayload = {
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
        },
      };

      //fetch seller category.....
      const seller: any = await this.userRepository.findOne(
        sellerPayload.select,
        sellerPayload.where
      );

      if (!seller) {
        throw new BadRequestException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      //fetch seller division......
      if (seller.product_industry_id) {
        const industry: any = await this.fetchIndustryById(
          seller.product_industry_id
        );
        seller["product_industry"] = industry.industry_name;
      } else {
        seller["product_industry"] = null;
      }
      if (
        seller?.product_category_id ||
        seller?.product_category_id?.lenght > 0
      ) {
        const categoryMeta = await this.fetchCategoriesMeta();
        seller["categoryMeta"] = categoryMeta;
      }

      //Decrypting seller email
      if (seller.email) {
        const decryptedEmail = await this.securityHelper.decrypt(seller.email);
        seller.email = decryptedEmail;
      }

      //Decrypting seller mobile_number
      if (seller.mobile_number) {
        const decryptedMobileNumber = await this.securityHelper.decrypt(
          seller.mobile_number
        );
        seller.mobile_number = decryptedMobileNumber;
      }

      //Decrypting pan card number
      if (seller.pan_card_number) {
        const decryptedPanCardNumber = await this.securityHelper.decrypt(
          seller.pan_card_number
        );
        seller.pan_card_number = decryptedPanCardNumber;
      }

      //Decrypting gst number
      if (seller.gst_number) {
        const decryptedGstNumber = await this.securityHelper.decrypt(
          seller.gst_number
        );
        seller.gst_number = decryptedGstNumber;
      }

      return {
        status: true,
        message: this.i18n.t("seller._basic_details_fetched_successfully", {
          lang,
        }),
        data: seller,
      };
    } catch (error) {
      throw new error();
    }
  }

  /**
   * @description
   * Function fetch seller bank details by id.
   */
  async fetchSellerBankDetailsById(uuid: string) {
    try {
      const lang = this.getLang();

      // Checking if user email already exists
      const sellerSelect = {
        id: true,
        uuid: true,
        email: true,
        is_deleted: true,
      };
      const seller: any = await this.userRepository.findOne(sellerSelect, {
        uuid: uuid,
        user_type: UserType.SELLER,
      });

      if (!seller) {
        throw new NotFoundException(
          this.i18n.t("seller._seller_not_found_", { lang })
        );
      }

      if (seller.is_deleted) {
        throw new ForbiddenException(
          this.i18n.t(
            "seller._seller_with_this_email_is_restricted_please_contact_administrator_for_support_",
            { lang }
          )
        );
      }

      const sellerCondition = {
        select: {
          uuid: true,
          account_holder_name: true,
          account_number: true,
          ifsc_code: true,
          branch_name: true,
          account_type: true,
        },
        where: {
          user_id: seller?.id,
        },
      };

      const sellerData: any = await this.userBankDetailsRepository.findOne(
        sellerCondition.select,
        sellerCondition.where
      );

      if (!sellerData) {
        throw new NotFoundException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      //Decrypting seller account number
      if (sellerData.account_number) {
        const decryptedAccountNumber = await this.securityHelper.decrypt(
          sellerData.account_number
        );
        sellerData.account_number = decryptedAccountNumber;
      }
      return {
        status: true,
        message: this.i18n.t("seller._bank_details_fetched_successfully", {
          lang,
        }),
        data: sellerData,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function fetch seller verification details by id.
   */
  async fetchSellerVerificationById(uuid: string) {
    try {
      const lang = this.getLang();
      const sellerPayload = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
        },
      };

      const seller: any = await this.userRepository.findOne(
        sellerPayload.select,
        sellerPayload.where
      );

      if (!seller) {
        throw new BadRequestException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      const sellerVerificationCondition = {
        select: {
          code_image: true,
          verification_status: true,
          verification_rejection_detail: true,
          user_id: true,
        },
        where: {
          user_id: seller.id,
        },
      };

      const sellerVerification = await this.userVerificationRepository.findOne(
        sellerVerificationCondition.select,
        sellerVerificationCondition.where
      );

      return {
        status: true,
        message: this.i18n.t(
          "seller._verification_details_fetched_successfully",
          {
            lang,
          }
        ),
        data: sellerVerification,
      };
    } catch (error) {
      throw new error();
    }
  }

  /**
   * @description
   * Function fetch seller verification details by id.
   */
  async fetchSellerDocumentsById(uuid: string) {
    try {
      const lang = this.getLang();
      const sellerPayload = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
        },
      };

      const seller: any = await this.userRepository.findOne(
        sellerPayload.select,
        sellerPayload.where
      );

      if (!seller) {
        throw new BadRequestException(
          this.i18n.t("user._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }

      const sellerDocumentCondition = {
        select: {
          document: true,
          document_name: true,
          user_id: true,
        },
        where: {
          user_id: seller.id,
        },
      };

      const sellerDocument = await this.userDocumentRepository.findMany(
        sellerDocumentCondition.select,
        sellerDocumentCondition.where
      );

      return {
        status: true,
        message: this.i18n.t("seller._document_details_fetched_successfully", {
          lang,
        }),
        data: sellerDocument,
      };
    } catch (error) {
      throw new error();
    }
  }


  /**
 * @description
 * Function fetch seller product category by id.
 */
  async fetchSellerProductCategories(id: number) {
    try {
      console.log(id)
      const sellerPayload = {
        select: {
          product_category_id: true
        },
        where: {
          id: +id
        },
      };

      const productCategory: any = await this.userRepository.findOne(
        sellerPayload.select,
        sellerPayload.where
      );

      return productCategory;
    } catch (error) {
      throw new error();
    }
  }
}
