/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class CreateUpdateSellerVerificationDto {
  @IsNotEmpty({ message: "_please_enter_code" })
  readonly code: string;
}
