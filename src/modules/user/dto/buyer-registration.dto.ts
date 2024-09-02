import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsEnum,
  Length,
  Matches,
  IsOptional,
} from "class-validator";
import { Match } from "src/common/decorators";

export enum UserType {
  BUYER = "BUYER",
}
export class BuyerRegistrationDto {
  @IsNotEmpty({ message: "_please_enter_first_name" })
  @IsString({ message: "_please_enter_valid_first_name" })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: "_first_name_no_special_characters",
  })
  readonly first_name: string;

  @IsNotEmpty({ message: "_please_enter_last_name" })
  @IsString({ message: "_please_enter_valid_last_name" })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: "_last_name_no_special_characters",
  })
  readonly last_name: string;

  @IsNotEmpty({ message: "_please_enter_email" })
  @IsEmail({}, { message: "_please_enter_valid_email" })
  readonly email: string;

  @IsNotEmpty({ message: "_please_enter_mobile_number" })
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: "_please_enter_valid_mobile_number",
  })
  readonly mobile_number: string;

  @IsNotEmpty({ message: "_please_enter_pan_card_number" })
  readonly pan_card_number: string;

  @IsNotEmpty({ message: "_please_enter_aadhar_card_number" })
  @Matches(/^\d{12}$/, {
    message: "_aadhar_card_number_must_be_12_digit_number",
  })
  readonly aadhar_card_number: string;

  @IsOptional()
  @Matches(/^BUYER$/, { message: "_user_type_must_be_buyer" })
  readonly user_type: string;

  @IsNotEmpty({ message: "_please_enter_password" })
  @Length(8, 100, { message: "_password_must_be_at_least_8_character" })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\#])[A-Za-z\d@$!%*?&#]{8,}$/,
    {
      message:
        "_contain_at_least_one_upparcase_lowercase_number_special_chatacter",
    }
  )
  readonly password: string;

  @IsNotEmpty({ message: "_please_enter_confirm_password" })
  @Match("password", { message: "_confirm_password_mismatch" })
  readonly confirmPassword: string;
}
