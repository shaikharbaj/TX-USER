export interface CreateAdminUserBody {
  name: string;
  email_id: string;
  position: string;
  reporting_to: string;
  role_ids: any;
}

export interface ToggleAdminUserVisibilityBody {
  is_active: boolean | string;
}

export interface UpdateAdminUserBody {
  name: string;
  email_id: string;
  position: string;
  reporting_to: string;
  role_ids: any;
}

export interface UpdateAdminUserPasswordBody {
  old_password: string;
  password: string;
  confirm_password: string;
}

export interface SellerBasicDetailBody {
  business_type: string;
  establishment: string;
  operation_locations: string;
  company_name: string;
  company_offerings: string;
  product_industry_id: string;
  product_category_id: string;
  gst_number: string;
  pan_card_number: string;
}

export interface SellerBankDetailBody {
  account_holder_name: string;
  account_number: string;
  ifsc_code: string;
  branch_name: string;
  account_type: string;
}

export interface BuyerRegistrationBody {
  first_name: string;
  last_name: string;
  email: string;
  mobile_number: string;
  pan_card_number: string;
  aadhar_card_number: string;
  user_type?: string; // Optional field
  password: string;
  confirmPassword: string;
}

export interface checkMobileNumberExist {
  mobile_number: string
}

export interface SellerVerificationBody {
  code: string;
}

export interface SellerDocumentsBody {
  personal_identification: string;
}

export interface UpdateBasicInfoStatusBody {
  admin_status: string;
  reason?:string;
}

export interface UpdateBankingInfoStatusBody {
  admin_status: string;
  reason?:string;
}

export interface UpdateVerificationStatusBody {
  admin_status: string;
  reason?:string;
}

export interface UpdateDocumentStatusBody {
  admin_status: string;
  reason?:string;
}