/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class BuyerLoginDto {
  @IsNotEmpty({ message: "_please_enter_email" })
  readonly email: string;

  @IsNotEmpty({ message: "_please_enter_password" })
  readonly password: string;
}
