/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, Matches, IsEmail } from 'class-validator';

export class CreateAdminUserDto {
  @IsNotEmpty({ message: '_please_enter_name' })
  @IsString({ message: '_please_enter_valid_name' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: '_name_no_numbers_or_special_chars',
  })
  readonly name: string;

  @IsNotEmpty({ message: '_please_enter_email' })
  @IsEmail({}, { message: '_please_enter_valid_email' })
  readonly email_id: string;

  @IsNotEmpty({ message: '_please_enter_position' })
  @IsString({ message: '_please_enter_valid_name' })
  @Matches(/^[a-zA-Z\s]+$/, {
    message: '_position_no_numbers_or_special_chars',
  })
  readonly position: string;

  @IsNotEmpty({ message: '_please_select_role' })
  readonly role_ids: string;

  @IsNotEmpty({ message: '_please_select_reporting_to' })
  readonly reporting_to: string;
}
