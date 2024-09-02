/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Matches, IsEmail } from 'class-validator';

export class CreateUpdateSellerBasicDetailsDto {
  @IsNotEmpty({ message: '_please_enter_business_type' })
  readonly business_type: string;

  @IsNotEmpty({ message: '_please_enter_establishment' })
  readonly establishment: string;

  @IsNotEmpty({ message: '_please_enter_operation_locations' })
  readonly operation_locations: string;

  @IsNotEmpty({ message: '_please_enter_company_name' })
  readonly company_name: string;

  @IsNotEmpty({ message: '_please_enter_company_offerings' })
  readonly company_offerings: string;

  @IsNotEmpty({ message: '_please_enter_product_division' })
  readonly product_industry_id: string;

  @IsNotEmpty({ message: '_please_enter_product_category' })
  readonly product_category_id: string;

  @IsNotEmpty({ message: '_please_enter_gstin' })
  readonly gst_number: string;

  @IsNotEmpty({ message: '_please_enter_business_pan' })
  readonly pan_card_number: string;
}
