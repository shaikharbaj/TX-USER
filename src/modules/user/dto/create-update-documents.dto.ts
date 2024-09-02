/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class CreateUpdateSellerDocumentsDto {
  @IsNotEmpty({ message: "_please_enter_personal_identification" })
  readonly personal_identification: string;
}
