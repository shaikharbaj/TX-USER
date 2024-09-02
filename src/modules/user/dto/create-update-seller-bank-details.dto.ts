/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Matches, IsEmail } from "class-validator";

export class CreateUpdateSellerBankDetailsDto {
  @IsNotEmpty({ message: "_please_enter_account_holder_name" })
  readonly account_holder_name: string;

  @IsNotEmpty({ message: "_please_enter_account_number" })
  readonly account_number: string;

  @IsNotEmpty({ message: "_please_enter_ifsc_code" })
  readonly ifsc_code: string;

  @IsNotEmpty({ message: "_please_enter_branch_name" })
  readonly branch_name: string;

  @IsNotEmpty({ message: "_please_enter_account_type" })
  readonly account_type: string;
}
